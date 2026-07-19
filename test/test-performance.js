"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SITE_ROOT = path.resolve(__dirname, "..", "_site");

function sizesOf(relative) {
  const filename = path.join(SITE_ROOT, relative);
  assert.ok(fs.existsSync(filename), `Missing build output: ${filename}`);
  const raw = fs.readFileSync(filename);
  return { raw: raw.length, gzip: zlib.gzipSync(raw, { level: 9 }).length };
}

// First byte budgets for the artifacts readers actually download.
// Baselines measured 2026-07-19 (133 indexed articles, 349 pages);
// budgets sit ~15-20% above baseline so organic growth passes but a
// regression (accidentally indexing drafts, unminified bundle, purge
// failure) fails loudly. When the search index outgrows its budget,
// revisit the sharded-index decision (Pagefind) recorded in the PR notes.
describe("performance budgets", () => {
  it("keeps the search index within its lazy-download budget", () => {
    const { raw, gzip } = sizesOf("search-index.json");
    assert.ok(raw <= 1_750_000, `search-index.json raw ${raw} > 1750000`);
    assert.ok(gzip <= 640_000, `search-index.json gzip ${gzip} > 640000`);
  });

  it("keeps the JS bundle small", () => {
    const { raw, gzip } = sizesOf("js/min.js");
    assert.ok(raw <= 25_000, `js/min.js raw ${raw} > 25000`);
    assert.ok(gzip <= 9_000, `js/min.js gzip ${gzip} > 9000`);
  });

  it("keeps per-page inlined CSS lean", () => {
    for (const page of ["index.html", "posts/tian/git-flow/index.html"]) {
      const html = fs.readFileSync(path.join(SITE_ROOT, page), "utf8");
      const match = html.match(/<style>([\s\S]*?)<\/style>/);
      assert.ok(match, `${page}: no inlined <style>`);
      assert.ok(
        match[1].length <= 40_000,
        `${page}: inlined CSS ${match[1].length} > 40000`
      );
    }
  });

  it("keeps the display webfont on a latin-subset budget with no third parties", () => {
    const font = path.join(SITE_ROOT, "fonts", "fraunces-latin-var.woff2");
    assert.ok(fs.existsSync(font), "missing self-hosted Fraunces woff2");
    const size = fs.statSync(font).size;
    assert.ok(size <= 51_200, `webfont ${size} > 51200 — latin subset only`);
    for (const page of ["index.html", "posts/tian/git-flow/index.html"]) {
      const html = fs.readFileSync(path.join(SITE_ROOT, page), "utf8");
      assert.ok(
        !/fonts\.(googleapis|gstatic)\.com/.test(html),
        `${page}: fonts must be self-hosted, never third-party`
      );
      assert.ok(
        html.includes("@font-face") && html.includes("fraunces-latin-var.woff2"),
        `${page}: @font-face must survive PurgeCSS into the inlined CSS`
      );
    }
  });

  it("never preloads the search index with the page", () => {
    for (const page of [
      "index.html",
      "posts/tian/git-flow/index.html",
      "tags/index.html",
    ]) {
      const html = fs.readFileSync(path.join(SITE_ROOT, page), "utf8");
      const head = html.slice(0, html.indexOf("</head>"));
      assert.ok(
        !/<link[^>]+search-index\.json/.test(head),
        `${page}: search index referenced from <head> — it must stay lazy`
      );
    }
  });
});
