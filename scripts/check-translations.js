#!/usr/bin/env node
/**
 * Translation staleness guard (Husky pre-commit, Tier A).
 *
 * For every affected *staged*, i18n-enabled source post
 * (`posts/<author>/<slug>.md` with `lang: zh-TW` and `translationKey`), this
 * checks that each target-language translation (a) exists, (b) is up to date,
 * and (c) has an audit trail before it is published. All comparisons read Git's
 * index, never the working tree, so a partially staged change cannot
 * accidentally bypass the guard.
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

/** Return the zh-TW source path for a translation path, or null if not one. */
function sourcePathForTranslation(filePath) {
  const base = path.basename(filePath, ".md");
  const lang = ALL_LANG_SUFFIXES.find((code) => base.endsWith("." + code));
  if (!lang) return null;
  return filePath.slice(0, -(`.${lang}.md`.length)) + ".md";
}

function frontmatterField(frontmatter, field) {
  const re = new RegExp(`^${field}:\\s*["']?([^"'\\r\\n]+)["']?\\s*$`, "m");
  const m = frontmatter.match(re);
  return m ? m[1].trim() : null;
}

/** True when a source post has explicitly opted into the i18n workflow. */
function isTranslationManagedSource(raw) {
  const frontmatter = extractFrontmatter(raw);
  return (
    frontmatterField(frontmatter, "lang") === "zh-TW" &&
    Boolean(frontmatterField(frontmatter, "translationKey"))
  );
}

/** Return a publication-review error for a translation frontmatter block. */
function publicationReviewIssue(frontmatter) {
  if (frontmatterField(frontmatter, "draft") === "true") return null;
  const reviewer = frontmatterField(frontmatter, "reviewedBy");
  const reviewedAt = frontmatterField(frontmatter, "reviewedAt");
  return reviewer && reviewedAt ? null : "not-reviewed";
}

module.exports = {
  extractBody,
  extractFrontmatter,
  hashBody,
  isTranslationPath,
  translationPathFor,
  sourcePathForTranslation,
  frontmatterField,
  isTranslationManagedSource,
  publicationReviewIssue,
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

const sourcePosts = new Set();
for (const file of staged) {
  if (!file.startsWith("posts/") || !file.endsWith(".md")) continue;
  if (isTranslationPath(file)) {
    sourcePosts.add(sourcePathForTranslation(file));
  } else {
    sourcePosts.add(file);
  }
}

/** Read the version that is about to be committed, not the working copy. */
function readIndexFile(filePath) {
  try {
    return execFileSync("git", ["show", `:${filePath}`], { encoding: "utf8" });
  } catch (e) {
    return null;
  }
}

const problems = [];
for (const sourcePath of sourcePosts) {
  const raw = readIndexFile(sourcePath);
  if (raw === null) continue; // staged delete edge case
  // Skip source posts that are themselves drafts — not ready to translate.
  if (frontmatterField(extractFrontmatter(raw), "draft") === "true") continue;
  // Translation is opt-in so unrelated authors' existing posts are unaffected.
  if (!isTranslationManagedSource(raw)) continue;

  const expected = hashBody(raw);
  for (const lang of TARGET_LANGS) {
    const tPath = translationPathFor(sourcePath, lang);
    const translation = readIndexFile(tPath);
    if (translation === null) {
      problems.push({ sourcePath, lang, reason: "missing" });
      continue;
    }
    const frontmatter = extractFrontmatter(translation);
    const actual = frontmatterField(frontmatter, "sourceHash");
    if (actual !== expected) {
      problems.push({ sourcePath, lang, reason: actual ? "stale" : "no-hash" });
      continue;
    }
    // A published AI-assisted translation must record who approved it and when.
    // This does not prove quality automatically, but makes the human review gate
    // explicit and auditable instead of silently publishing machine output.
    const reviewIssue = publicationReviewIssue(frontmatter);
    if (reviewIssue) {
      problems.push({ sourcePath, lang, reason: reviewIssue });
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
