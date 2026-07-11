#!/usr/bin/env node
/**
 * Minimal, dependency-free tests for the translation guard helpers.
 * Run: npm run test:translations
 */
"use strict";

const assert = require("assert");
const crypto = require("crypto");
const {
  extractBody,
  hashBody,
  isTranslationPath,
  translationPathFor,
  sourcePathForTranslation,
  frontmatterField,
  isTranslationManagedSource,
  publicationReviewIssue,
} = require("./check-translations.js");

let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log("  ✓ " + name);
}

const SAMPLE = "---\ntitle: Hi\nlang: zh-TW\n---\n\nBody line one.\n";

test("extractBody strips the leading frontmatter block", () => {
  assert.strictEqual(extractBody(SAMPLE), "\nBody line one.\n");
});

test("extractBody returns input unchanged when there is no frontmatter", () => {
  assert.strictEqual(extractBody("no frontmatter here"), "no frontmatter here");
});

test("hashBody is deterministic and hashes the body only", () => {
  const expected = crypto
    .createHash("sha256")
    .update("\nBody line one.\n", "utf8")
    .digest("hex");
  assert.strictEqual(hashBody(SAMPLE), expected);
  assert.strictEqual(hashBody(SAMPLE), hashBody(SAMPLE));
});

test("hashBody ignores frontmatter changes, reacts to body changes", () => {
  const otherFm = "---\ntitle: Different\n---\n\nBody line one.\n";
  assert.strictEqual(hashBody(otherFm), hashBody(SAMPLE)); // same body
  const otherBody = "---\ntitle: Hi\n---\n\nBody line TWO.\n";
  assert.notStrictEqual(hashBody(otherBody), hashBody(SAMPLE));
});

test("isTranslationPath detects .<lang>.md but not source posts", () => {
  assert.strictEqual(isTranslationPath("posts/tian/git-flow.en.md"), true);
  assert.strictEqual(isTranslationPath("posts/tian/git-flow.zh-CN.md"), true);
  assert.strictEqual(isTranslationPath("posts/tian/git-flow.ja.md"), true);
  assert.strictEqual(isTranslationPath("posts/tian/git-flow.md"), false);
});

test("translationPathFor builds the sibling translation path", () => {
  assert.strictEqual(
    translationPathFor("posts/tian/git-flow.md", "en"),
    "posts/tian/git-flow.en.md"
  );
});

test("sourcePathForTranslation maps a translation back to its source", () => {
  assert.strictEqual(
    sourcePathForTranslation("posts/tian/git-flow.zh-CN.md"),
    "posts/tian/git-flow.md"
  );
  assert.strictEqual(sourcePathForTranslation("posts/tian/git-flow.md"), null);
});

test("frontmatterField parses a quoted or bare value", () => {
  const fm = 'sourceHash: abc123\nlang: "en"';
  assert.strictEqual(frontmatterField(fm, "sourceHash"), "abc123");
  assert.strictEqual(frontmatterField(fm, "lang"), "en");
  assert.strictEqual(frontmatterField(fm, "missing"), null);
});

test("only zh-TW sources with a translationKey opt into translation checks", () => {
  assert.strictEqual(isTranslationManagedSource(SAMPLE), false);
  assert.strictEqual(
    isTranslationManagedSource(
      "---\nlang: zh-TW\ntranslationKey: tian/example\n---\n\nBody\n"
    ),
    true
  );
  assert.strictEqual(
    isTranslationManagedSource("---\nlang: en\ntranslationKey: tian/example\n---\n\nBody\n"),
    false
  );
});

test("published translations require an auditable human review", () => {
  assert.strictEqual(publicationReviewIssue("draft: true"), null);
  assert.strictEqual(publicationReviewIssue("draft: false"), "not-reviewed");
  assert.strictEqual(
    publicationReviewIssue("draft: false\nreviewedBy: May\nreviewedAt: 2026-07-11"),
    null
  );
});

console.log(`\n${passed} tests passed.`);
