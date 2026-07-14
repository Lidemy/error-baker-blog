/**
 * Build-time reader-discussion signals from utterances.
 *
 * utterances stores each post's comment thread as a GitHub issue on this repo,
 * labelled `utterancex`, with the issue title set to the page <title> at the
 * time the first comment was posted (issue-term="title"). A couple of API
 * calls map every thread to its post title and comment count.
 *
 * The fetch is memoized per build process and fails soft: an offline or
 * rate-limited build resolves to null, and the templates simply hide reader
 * stats instead of failing the build. Set GITHUB_TOKEN (e.g. in the Netlify
 * build environment) to lift the unauthenticated 60 req/hr API limit.
 */
"use strict";

const REPO = "Lidemy/error-baker-blog";
const LABEL = "utterancex";
const TIMEOUT_MS = 8000;
const MAX_PAGES = 10; // 1000 discussion threads — far above current volume

// Issue titles are page <title>s. Post pages append `｜<site name>`, so strip
// any such suffix to recover the raw post title used as the lookup key.
const normalizeTitle = (title) => (title || "").split("｜")[0].trim();

async function fetchCommentCounts() {
  const byTitle = Object.create(null);
  const headers = {
    accept: "application/vnd.github+json",
    "user-agent": "error-baker-blog-build",
  };
  if (process.env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }
  for (let page = 1; page <= MAX_PAGES; page++) {
    const url = `https://api.github.com/repos/${REPO}/issues?labels=${LABEL}&state=all&per_page=100&page=${page}`;
    const res = await fetch(url, {
      headers,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) throw new Error(`GitHub issues API responded ${res.status}`);
    const issues = await res.json();
    for (const issue of issues) {
      if (issue.pull_request) continue; // the issues API also returns PRs
      const key = normalizeTitle(issue.title);
      if (!key) continue;
      byTitle[key] = (byTitle[key] || 0) + issue.comments;
    }
    if (issues.length < 100) break;
  }
  return byTitle;
}

let cached; // Promise<Object|null> — memoized so collections can re-run freely

function commentCountsByTitle() {
  if (!cached) {
    cached = fetchCommentCounts().catch((error) => {
      console.warn(`[discussions] skipping reader stats: ${error.message}`);
      return null;
    });
  }
  return cached;
}

module.exports = { commentCountsByTitle, normalizeTitle };
