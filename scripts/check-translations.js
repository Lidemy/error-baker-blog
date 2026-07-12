#!/usr/bin/env node
/**
 * Translation staleness guard (Husky pre-commit, Tier A).
 *
 * For every affected *staged*, i18n-enabled source post (or every managed
 * source when invoked with `--all` in CI)
 * (`posts/<author>/<slug>.md` with `lang: zh-TW` and `translationKey`), this
 * checks that each translation declared by the source's `translationTargets`
 * (a) exists, (b) is up to date, and (c) has an audit trail before it is
 * published. All comparisons read Git's index, never the working tree, so a
 * partially staged change cannot accidentally bypass the guard.
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

// The language list is single-sourced from _data/langs.json (source language
// first); .eleventy.js and the tests derive from the same file. A JSON require
// keeps this script free of third-party dependencies.
const SITE_LANGS = require(path.join(__dirname, "..", "_data", "langs.json"));
const DEFAULT_LANG = SITE_LANGS[0];
// Languages available as translation targets. Each source post may select a
// subset with `translationTargets`; legacy sources without that field keep the
// original all-languages behavior.
const TARGET_LANGS = SITE_LANGS.filter((lang) => lang !== DEFAULT_LANG);
// Any filename suffix `.<lang>.md` with one of these is treated as a translation
// (so it is never itself mistaken for a source post).
const ALL_LANG_SUFFIXES = SITE_LANGS;

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

/** SHA-256 (hex) of a source post's body. Kept exported for focused tests. */
function hashBody(raw) {
  return crypto.createHash("sha256").update(extractBody(raw), "utf8").digest("hex");
}

/**
 * SHA-256 (hex) of the translatable source content.
 *
 * `title` is deliberately parsed from frontmatter while the rest of the
 * frontmatter is ignored: title and prose are translated, but metadata such as
 * date, tags, and layout is copied verbatim. The domain separator prevents this
 * newer hash from being confused with the legacy body-only hash.
 */
function hashSource(raw) {
  const title = frontmatterField(extractFrontmatter(raw), "title") || "";
  return crypto
    .createHash("sha256")
    .update("translation-source-v2\0", "utf8")
    .update(title, "utf8")
    .update("\0", "utf8")
    .update(extractBody(raw), "utf8")
    .digest("hex");
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
  const re = new RegExp(`^${field}:\\s*(.*?)\\s*$`, "m");
  const m = frontmatter.match(re);
  if (!m) return null;
  const value = m[1].trim();
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

/**
 * Parse the site's draft scalar contract. Eleventy treats YAML boolean true and
 * the exact quoted string "true" as drafts; it also ignores whitespace-prefixed
 * inline comments. Matching that behavior keeps the guard aligned with
 * production visibility.
 */
function frontmatterBoolean(frontmatter, field) {
  const re = new RegExp(`^${field}:\\s*(.*?)\\s*$`, "m");
  const match = frontmatter.match(re);
  if (!match) return null;

  const value = match[1].replace(/\s+#.*$/, "").trim();
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value.slice(1, -1) === "true" ? true : null;
  }

  if (/^true$/i.test(value)) return true;
  if (/^false$/i.test(value)) return false;
  return null;
}

/** True when a source post has explicitly opted into the i18n workflow. */
function isTranslationManagedSource(raw) {
  const frontmatter = extractFrontmatter(raw);
  return (
    frontmatterField(frontmatter, "lang") === DEFAULT_LANG &&
    Boolean(frontmatterField(frontmatter, "translationKey"))
  );
}

/**
 * Parse the source's explicit translation contract.
 *
 * The guide uses an inline YAML list so this dependency-free guard does not need
 * a YAML parser. Missing `translationTargets` retains the pre-existing contract
 * that every configured target language is required.
 */
function translationTargetsForSource(raw) {
  const value = frontmatterField(extractFrontmatter(raw), "translationTargets");
  if (value === null) return { langs: [...TARGET_LANGS], issue: null };

  // YAML permits an inline comment after the list. Language codes cannot
  // contain `#`, so stripping a whitespace-prefixed comment is unambiguous.
  const normalized = value.replace(/\s+#.*$/, "").trim();
  const list = normalized.match(/^\[(.*)\]$/);
  if (!list) {
    return {
      langs: [],
      issue: "translationTargets must be an inline YAML list, e.g. [en, ja]",
    };
  }

  const langs = list[1]
    .split(",")
    .map((lang) => lang.trim().replace(/^(?:\"([^\"]*)\"|'([^']*)')$/, "$1$2"))
    .filter(Boolean);
  if (langs.length === 0) {
    return { langs: [], issue: "translationTargets must contain at least one language" };
  }

  const duplicates = langs.filter((lang, index) => langs.indexOf(lang) !== index);
  if (duplicates.length > 0) {
    return {
      langs: [],
      issue: `translationTargets contains duplicate languages: ${[
        ...new Set(duplicates),
      ].join(", ")}`,
    };
  }

  const unsupported = langs.filter((lang) => !TARGET_LANGS.includes(lang));
  if (unsupported.length > 0) {
    return {
      langs: [],
      issue: `translationTargets contains unsupported languages: ${unsupported.join(", ")}`,
    };
  }

  return {
    langs: TARGET_LANGS.filter((lang) => langs.includes(lang)),
    issue: null,
  };
}

/** Return a publication-review error for a translation frontmatter block. */
function publicationReviewIssue(frontmatter) {
  if (frontmatterBoolean(frontmatter, "draft") === true) return null;
  const reviewer = frontmatterField(frontmatter, "reviewedBy");
  const reviewedAt = frontmatterField(frontmatter, "reviewedAt");
  return reviewer && reviewedAt ? null : "not-reviewed";
}

/**
 * Return a sourceHash error, or null when it is current. All managed
 * translations use the title-aware v2 hash so CI can detect title changes from
 * a clean checkout without relying on Git history.
 */
function sourceHashIssue(actual, currentSource) {
  if (!actual) return "no-hash";
  return actual === hashSource(currentSource) ? null : "stale";
}

module.exports = {
  extractBody,
  extractFrontmatter,
  hashBody,
  hashSource,
  isTranslationPath,
  translationPathFor,
  sourcePathForTranslation,
  frontmatterField,
  frontmatterBoolean,
  isTranslationManagedSource,
  translationTargetsForSource,
  publicationReviewIssue,
  sourceHashIssue,
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
  process.stdout.write(hashSource(fs.readFileSync(file, "utf8")) + "\n");
  process.exit(0);
}
const checkAll = args[0] === "--all";
if (args.length > 0 && !checkAll) {
  console.error("usage: check-translations.js [--all | --hash <source-post.md>]");
  process.exit(2);
}

// --- Mode 2: pre-commit guard over staged source posts.
if (process.env.SKIP_TRANSLATION_CHECK) {
  process.exit(0);
}

let affectedFiles = [];
try {
  const gitArgs = checkAll
    ? ["ls-files", "--cached", "--", "posts"]
    : [
        "diff",
        "--cached",
        "--name-only",
        "--diff-filter=ACMD",
        "--no-renames",
      ];
  affectedFiles = execFileSync("git", gitArgs, { encoding: "utf8" })
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
} catch (e) {
  // Not a git repo / git unavailable — nothing to guard.
  process.exit(0);
}

const sourcePosts = new Set();
for (const file of affectedFiles) {
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

/**
 * Pre-commit checks must inspect exactly what will be committed; full build
 * checks must inspect the checkout that Eleventy is about to build.
 */
function readCheckedFile(filePath) {
  if (!checkAll) return readIndexFile(filePath);
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (e) {
    if (e.code === "ENOENT") return null;
    throw e;
  }
}

const problems = [];
for (const sourcePath of sourcePosts) {
  const raw = readCheckedFile(sourcePath);
  const translations = TARGET_LANGS.map((lang) => ({
    lang,
    path: translationPathFor(sourcePath, lang),
  })).map((entry) => ({
    ...entry,
    raw: readCheckedFile(entry.path),
  }));
  const existingTranslations = translations.filter((entry) => entry.raw !== null);

  // Deleting every version together is intentional. Leaving even a draft
  // translation behind is not: without its source, sourceHash can never be
  // validated again and a published translation would remain live indefinitely.
  if (raw === null) {
    for (const { lang } of existingTranslations) {
      problems.push({ sourcePath, lang, reason: "orphaned-translation" });
    }
    continue;
  }

  // Translation is opt-in so unrelated authors' existing posts are unaffected.
  // Once translations exist, removing the source's opt-in metadata must not turn
  // the guard off while those translations continue to build.
  if (!isTranslationManagedSource(raw)) {
    for (const { lang } of existingTranslations) {
      problems.push({ sourcePath, lang, reason: "unmanaged-source" });
    }
    continue;
  }

  const sourceFrontmatter = extractFrontmatter(raw);
  // A draft source may have draft translations for work-in-progress previews,
  // but it cannot anchor translations that production is allowed to publish.
  if (frontmatterBoolean(sourceFrontmatter, "draft") === true) {
    for (const { lang, raw: translation } of existingTranslations) {
      const frontmatter = extractFrontmatter(translation);
      if (frontmatterBoolean(frontmatter, "draft") !== true) {
        problems.push({ sourcePath, lang, reason: "source-unpublished" });
      }
    }
    continue;
  }

  const targetSelection = translationTargetsForSource(raw);
  if (targetSelection.issue) {
    problems.push({
      sourcePath,
      reason: "invalid-targets",
      detail: targetSelection.issue,
    });
    continue;
  }

  const expectedLangs = new Set(targetSelection.langs);
  for (const { lang, raw: translation } of translations) {
    if (translation === null) {
      if (expectedLangs.has(lang)) {
        problems.push({ sourcePath, lang, reason: "missing" });
      }
      continue;
    }
    if (!expectedLangs.has(lang)) {
      problems.push({ sourcePath, lang, reason: "not-declared" });
      continue;
    }
    const frontmatter = extractFrontmatter(translation);
    const actual = frontmatterField(frontmatter, "sourceHash");
    const hashIssue = sourceHashIssue(actual, raw);
    if (hashIssue) {
      problems.push({ sourcePath, lang, reason: hashIssue });
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

console.error("\n✖ Translation checks failed:\n");
for (const [sourcePath, items] of bySource) {
  const issues = items
    .map((i) => (i.lang ? `${i.lang} (${i.reason})` : `${i.reason}: ${i.detail}`))
    .join(", ");
  console.error(`  ${sourcePath}`);
  console.error(`    → ${issues}`);
  const languagesFor = (reason) =>
    items.filter((i) => i.reason === reason).map((i) => i.lang);

  const orphaned = languagesFor("orphaned-translation");
  if (orphaned.length > 0) {
    console.error(
      `    Restore the source, or remove its remaining translations: ${orphaned.join(",")}.`
    );
  }
  const unmanaged = languagesFor("unmanaged-source");
  if (unmanaged.length > 0) {
    console.error(
      "    Restore lang: zh-TW and translationKey on the source, " +
        `or remove its translations: ${unmanaged.join(",")}.`
    );
  }
  const unpublished = languagesFor("source-unpublished");
  if (unpublished.length > 0) {
    console.error(
      `    Set these translations back to draft: true, or publish the source: ${unpublished.join(",")}.`
    );
  }
  const undeclared = items.filter((i) => i.reason === "not-declared");
  if (undeclared.length > 0) {
    console.error(
      `    Add ${undeclared.map((i) => i.lang).join(",")} to translationTargets, ` +
        "or remove the corresponding translation file(s)."
    );
  }
  const unreviewed = languagesFor("not-reviewed");
  if (unreviewed.length > 0) {
    console.error(
      `    Add reviewedBy and reviewedAt to the published translations: ${unreviewed.join(",")}.`
    );
  }
  const retranslationReasons = new Set(["missing", "no-hash", "stale"]);
  const langs = [
    ...new Set(
      items
        .filter((i) => i.lang && retranslationReasons.has(i.reason))
        .map((i) => i.lang)
    ),
  ];
  if (langs.length > 0) {
    console.error(`    Run: /translate-post ${sourcePath} ${langs.join(",")}\n`);
  } else {
    console.error("");
  }
}
console.error(
  checkAll
    ? "Fix the translations above before this build can be published.\n"
    : "Fix the translation issues above (see AGENTS.md), or bypass for a WIP commit with:\n" +
        "  SKIP_TRANSLATION_CHECK=1 git commit ...\n" +
        "  git commit --no-verify\n"
);
process.exit(1);
