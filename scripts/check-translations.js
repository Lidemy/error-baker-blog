#!/usr/bin/env node
/**
 * Translation staleness guard (Husky pre-commit, Tier A).
 *
 * For every *staged* source post (`posts/<author>/<slug>.md`, zh-TW), this
 * checks that each target-language translation (a) exists and (b) is up to date
 * — its `sourceHash` frontmatter must equal the SHA-256 of the source post's
 * current body. Missing or stale translations block the commit and the author
 * is told to run `/translate-post`.
 *
 * It does NOT translate anything — translation is done by an agent following
 * AGENTS.md. The agent stamps each translation with the hash printed by:
 *     node scripts/check-translations.js --hash posts/<author>/<slug>.md
 * so the value it writes always matches what this guard recomputes.
 *
 * Escape hatches (for work-in-progress commits):
 *     SKIP_TRANSLATION_CHECK=1 git commit ...
 *     git commit --no-verify
 *
 * No third-party dependencies — Node built-ins only.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");

// Languages every source post is expected to be translated into. Edit to taste;
// keep in sync with SITE_LANGS in .eleventy.js and AGENTS.md.
const TARGET_LANGS = ["en", "ja", "zh-CN"];
// Any filename suffix `.<lang>.md` with one of these is treated as a translation
// (so it is never itself mistaken for a source post).
const ALL_LANG_SUFFIXES = TARGET_LANGS.concat(["zh-TW"]);

/** Strip a leading YAML frontmatter block and return the remaining body. */
function extractBody(raw) {
  const m = raw.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/);
  return m ? raw.slice(m[0].length) : raw;
}

/** Return the leading YAML frontmatter block (without the --- fences), or "". */
function extractFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  return m ? m[1] : "";
}

/** SHA-256 (hex) of a source post's body — the staleness key. */
function hashBody(raw) {
  return crypto.createHash("sha256").update(extractBody(raw), "utf8").digest("hex");
}

/** True if the path is a `.<lang>.md` translation rather than a source post. */
function isTranslationPath(filePath) {
  const base = path.basename(filePath, ".md");
  return ALL_LANG_SUFFIXES.some((lang) => base.endsWith("." + lang));
}

function translationPathFor(sourcePath, lang) {
  const dir = path.dirname(sourcePath);
  const base = path.basename(sourcePath, ".md");
  return path.join(dir, `${base}.${lang}.md`);
}

function frontmatterField(frontmatter, field) {
  const re = new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)["']?\\s*$`, "m");
  const m = frontmatter.match(re);
  return m ? m[1].trim() : null;
}

module.exports = {
  extractBody,
  extractFrontmatter,
  hashBody,
  isTranslationPath,
  translationPathFor,
  frontmatterField,
  TARGET_LANGS,
};

// When required as a module (tests), stop here and don't run the CLI/guard.
if (require.main !== module) {
  return;
}

// --- Mode 1: print the sourceHash for one file (used by the agent / AGENTS.md).
const args = process.argv.slice(2);
if (args[0] === "--hash") {
  const file = args[1];
  if (!file) {
    console.error("usage: check-translations.js --hash <source-post.md>");
    process.exit(2);
  }
  process.stdout.write(hashBody(fs.readFileSync(file, "utf8")) + "\n");
  process.exit(0);
}

// --- Mode 2: pre-commit guard over staged source posts.
if (process.env.SKIP_TRANSLATION_CHECK) {
  process.exit(0);
}

let staged = [];
try {
  staged = execFileSync(
    "git",
    ["diff", "--cached", "--name-only", "--diff-filter=ACM"],
    { encoding: "utf8" }
  )
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
} catch (e) {
  // Not a git repo / git unavailable — nothing to guard.
  process.exit(0);
}

const sourcePosts = staged.filter(
  (f) =>
    f.startsWith("posts/") &&
    f.endsWith(".md") &&
    !isTranslationPath(f)
);

const problems = [];
for (const sourcePath of sourcePosts) {
  if (!fs.existsSync(sourcePath)) continue; // staged delete edge case
  const raw = fs.readFileSync(sourcePath, "utf8");
  // Skip source posts that are themselves drafts — not ready to translate.
  if (frontmatterField(extractFrontmatter(raw), "draft") === "true") continue;

  const expected = hashBody(raw);
  for (const lang of TARGET_LANGS) {
    const tPath = translationPathFor(sourcePath, lang);
    if (!fs.existsSync(tPath)) {
      problems.push({ sourcePath, lang, reason: "missing" });
      continue;
    }
    const actual = frontmatterField(
      extractFrontmatter(fs.readFileSync(tPath, "utf8")),
      "sourceHash"
    );
    if (actual !== expected) {
      problems.push({ sourcePath, lang, reason: actual ? "stale" : "no-hash" });
    }
  }
}

if (problems.length === 0) {
  process.exit(0);
}

const bySource = new Map();
for (const p of problems) {
  if (!bySource.has(p.sourcePath)) bySource.set(p.sourcePath, []);
  bySource.get(p.sourcePath).push(p);
}

console.error("\n✖ Translations missing or out of date:\n");
for (const [sourcePath, items] of bySource) {
  const langs = items
    .map((i) => `${i.lang} (${i.reason})`)
    .join(", ");
  console.error(`  ${sourcePath}`);
  console.error(`    → ${langs}`);
  console.error(`    Run: /translate-post ${sourcePath} ${items.map((i) => i.lang).join(",")}\n`);
}
console.error(
  "Translate the posts above (see AGENTS.md), or bypass for a WIP commit with:\n" +
    "  SKIP_TRANSLATION_CHECK=1 git commit ...\n" +
    "  git commit --no-verify\n"
);
process.exit(1);
