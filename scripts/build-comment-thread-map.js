/**
 * One-off, read-only generator for _data/commentThreads.json — the frozen
 * map of source-post paths to their legacy utterances comment threads.
 *
 * Background: until 2026-07 the utterances embed used issue-term="title", so
 * every legacy thread is a GitHub issue whose title is the post's <title> at
 * the time of the first comment (the bare post title back then). The embed
 * now binds by issue-number via this map (legacy threads) or issue-term set
 * to the source post's path (new threads), so those issues are never renamed
 * or relabelled — the mapping lives here instead of on GitHub.
 *
 * Usage:
 *   GITHUB_TOKEN=$(gh auth token) node scripts/build-comment-thread-map.js
 *
 * Writes _data/commentThreads.json and reports issues it could not match
 * (post retitled since the thread was created) so they can be added by hand.
 * Never writes anything to GitHub.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const REPO = "Lidemy/error-baker-blog";
const BOT = "utterances-bot";
const POSTS_DIR = path.join(__dirname, "..", "posts");
const OUT_FILE = path.join(__dirname, "..", "_data", "commentThreads.json");
const LANGS = require("../_data/langs.json");

// Threads whose issue title no longer matches any post title exactly (the
// post was retitled after the thread was created). Verified by hand against
// the URL in each issue body.
const OVERRIDES = {
  // "<issue title>": "/posts/<author>/<slug>/",
};

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

// posts/<author>/<slug>.md → /posts/<author>/<slug>/ ; translations are
// <slug>.<lang>.md and never own a legacy thread, so they are skipped.
const isTranslation = (file) =>
  LANGS.some((lang) => file.endsWith(`.${lang}.md`));

function sourcePostsByTitle() {
  const byTitle = Object.create(null);
  for (const file of walk(POSTS_DIR)) {
    if (!file.endsWith(".md") || isTranslation(file)) continue;
    const raw = fs.readFileSync(file, "utf8");
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) continue;
    const titleMatch = frontmatter[1].match(/^title:\s*(.+?)\s*$/m);
    if (!titleMatch) continue;
    const title = titleMatch[1].replace(/^["']|["']$/g, "").trim();
    const rel = path.relative(path.join(POSTS_DIR, ".."), file);
    const url = "/" + rel.replace(/\.md$/, "").split(path.sep).join("/") + "/";
    byTitle[title] = url;
  }
  return byTitle;
}

async function fetchBotThreads() {
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "error-baker-blog-thread-map",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  const threads = [];
  for (let page = 1; page <= 20; page++) {
    const url = `https://api.github.com/repos/${REPO}/issues?state=all&per_page=100&page=${page}`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`GitHub issues API responded ${res.status}`);
    const issues = await res.json();
    for (const issue of issues) {
      if (issue.pull_request) continue;
      if (!issue.user || issue.user.login !== BOT) continue;
      threads.push({ number: issue.number, title: issue.title.trim() });
    }
    if (issues.length < 100) break;
  }
  return threads;
}

async function main() {
  const byTitle = sourcePostsByTitle();
  const threads = await fetchBotThreads();
  const map = {};
  const unmatched = [];
  for (const thread of threads) {
    const url = byTitle[thread.title] || OVERRIDES[thread.title];
    if (url) {
      map[url] = thread.number;
    } else {
      unmatched.push(thread);
    }
  }
  const sorted = {};
  for (const key of Object.keys(map).sort()) sorted[key] = map[key];
  fs.writeFileSync(OUT_FILE, JSON.stringify(sorted, null, 2) + "\n");
  console.log(
    `matched ${Object.keys(sorted).length}/${threads.length} threads → ${path.relative(process.cwd(), OUT_FILE)}`
  );
  if (unmatched.length) {
    console.error("unmatched threads (add to OVERRIDES after checking the issue body URL):");
    for (const t of unmatched) console.error(`  #${t.number}  ${t.title}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
