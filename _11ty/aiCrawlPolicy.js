/**
 * AI-crawler opt-in policy, resolved per author with a per-article override.
 *
 * Every author defaults to NOT welcoming AI/GEO crawlers — this is a content
 * authorization decision, not a technical one, so it belongs to whoever wrote
 * the post. An author opts in for all their own writing by setting
 * `aiCrawl: true` on their entry in _data/metadata.json; a single article can
 * flip the outcome the other way with its own frontmatter `aiCrawl: true` or
 * `false`, regardless of what its author's default is.
 *
 * The output feeds robots.txt, which can only express this with path-prefix
 * rules. Per-author rules disallow that author's whole section
 * (`/posts/<author>/` plus each active locale's `/<lang>/posts/<author>/`,
 * since posts and that author's listing page share the same prefix). A
 * per-article override then re-enables (or blocks) just that one URL —
 * robots.txt resolves conflicting rules by longest path match, so a more
 * specific Allow/Disallow on one article's URL always wins over its author's
 * section-wide rule (RFC 9309; every crawler in the allowlist documents
 * following this).
 */
"use strict";

function authorAllows(authors, key) {
  return Boolean(authors[key] && authors[key].aiCrawl === true);
}

function buildAiCrawlRules(posts, authors, siteLangs, defaultLang) {
  const disallowPaths = new Set();
  const allowOverridePaths = new Set();
  const disallowOverridePaths = new Set();

  for (const key of Object.keys(authors || {})) {
    if (authorAllows(authors, key)) continue;
    disallowPaths.add(`/posts/${key}/`);
    for (const lang of siteLangs || []) {
      if (lang === defaultLang) continue;
      disallowPaths.add(`/${lang}/posts/${key}/`);
    }
  }

  for (const item of posts || []) {
    const override = item.data && item.data.aiCrawl;
    if (typeof override !== "boolean") continue;
    const allowedByDefault = authorAllows(authors, item.data.author);
    if (override === true && !allowedByDefault) {
      allowOverridePaths.add(item.url);
    } else if (override === false && allowedByDefault) {
      disallowOverridePaths.add(item.url);
    }
  }

  return {
    disallowPaths: Array.from(disallowPaths).sort(),
    allowOverridePaths: Array.from(allowOverridePaths).sort(),
    disallowOverridePaths: Array.from(disallowOverridePaths).sort(),
  };
}

module.exports = { buildAiCrawlRules, authorAllows };
