/**
 * Build-time reader-discussion signals from utterances.
 *
 * utterances stores each post's comment thread as a GitHub issue on this
 * repo. Threads are keyed by the source post's path (`/posts/<author>/
 * <slug>/`): legacy threads — created back when the embed used
 * issue-term="title" — are pinned to their path by _data/commentThreads.json
 * (see scripts/build-comment-thread-map.js), and threads created since carry
 * the path as their issue title, because the embed now uses the path as the
 * issue term. One paginated API sweep maps every thread to its path and
 * comment count.
 *
 * The fetch is memoized per build process and fails soft: an offline or
 * rate-limited build resolves to null, and the templates simply hide reader
 * stats instead of failing the build. Set GITHUB_TOKEN (e.g. in the Netlify
 * build environment) to lift the unauthenticated 60 req/hr API limit.
 */
"use strict";

const REPO = "Lidemy/error-baker-blog";
const TIMEOUT_MS = 8000;
const MAX_PAGES = 10; // 1000 issues — far above current volume

const LEGACY_THREADS = require("../_data/commentThreads.json");

// path -> issue number, inverted to issue number -> path for counting.
const legacyPathByNumber = Object.create(null);
for (const [path, number] of Object.entries(LEGACY_THREADS)) {
  legacyPathByNumber[number] = path;
}

// The path a thread belongs to, or null for issues that aren't comment
// threads (engineering issues, PRs are filtered by the caller).
function threadPath(issue) {
  if (legacyPathByNumber[issue.number]) return legacyPathByNumber[issue.number];
  const title = (issue.title || "").trim();
  return /^\/posts\/.+\/$/.test(title) ? title : null;
}

async function fetchCommentCounts() {
  const byPath = Object.create(null);
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "error-baker-blog-build",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `https://api.github.com/repos/${REPO}/issues?state=all&per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`GitHub issues API responded ${res.status}`);
    const issues = await res.json();
    for (const issue of issues) {
      if (issue.pull_request) continue; // the issues API also returns PRs
      const key = threadPath(issue);
      if (!key) continue;
      byPath[key] = (byPath[key] || 0) + issue.comments;
    }
    if (issues.length < 100) break;
  }
  return byPath;
}

let cached; // Promise<Object|null> — memoized so collections can re-run freely

function commentCountsByPath() {
  if (!cached) {
    cached = fetchCommentCounts().catch((error) => {
      console.warn(`[discussions] skipping reader stats: ${error.message}`);
      return null;
    });
  }
  return cached;
}

module.exports = { commentCountsByPath, threadPath };
