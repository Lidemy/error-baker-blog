#!/usr/bin/env node
/**
 * Minimal, dependency-free tests for the translation guard helpers.
 * Run: npm run test:translations
 */
"use strict";

const assert = require("assert");
const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");
const {
  extractBody,
  hashBody,
  hashSource,
  isTranslationPath,
  translationPathFor,
  sourcePathForTranslation,
  frontmatterField,
  isTranslationManagedSource,
  publicationReviewIssue,
  sourceHashIssue,
  TARGET_LANGS,
} = require("./check-translations.js");

const GUARD_SCRIPT = path.join(__dirname, "check-translations.js");

// Git hook runners (the pre-commit/pre-push packages) export GIT_DIR and
// GIT_INDEX_FILE to their children. If the integration tests inherit them,
// every `git add` in the temporary repo silently rewrites the REAL repository's
// index instead. Strip all GIT_* variables so the temp repos stay hermetic.
const ISOLATED_ENV = Object.fromEntries(
  Object.entries(process.env).filter(([key]) => !key.startsWith("GIT_"))
);

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

test("hashSource reacts to title and body changes but ignores copied metadata", () => {
  const sameContent =
    "---\ntitle: Hi\ndate: 2026-07-12\ntags: [javascript]\n---\n\nBody line one.\n";
  const changedTitle = "---\ntitle: Hello\n---\n\nBody line one.\n";
  const changedBody = "---\ntitle: Hi\n---\n\nBody line TWO.\n";

  assert.strictEqual(hashSource(sameContent), hashSource(SAMPLE));
  assert.notStrictEqual(hashSource(changedTitle), hashSource(SAMPLE));
  assert.notStrictEqual(hashSource(changedBody), hashSource(SAMPLE));
  assert.notStrictEqual(hashSource(SAMPLE), hashBody(SAMPLE));
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

test("sourceHashIssue requires the title-aware source hash", () => {
  const source =
    "---\ntitle: Original\nlang: zh-TW\ntranslationKey: tian/example\n---\n\nBody\n";

  assert.strictEqual(sourceHashIssue(hashSource(source), source), null);
  assert.strictEqual(sourceHashIssue(hashBody(source), source), "stale");
  assert.strictEqual(sourceHashIssue(null, source), "no-hash");
});

function git(repo, args) {
  return execFileSync("git", args, {
    cwd: repo,
    env: ISOLATED_ENV,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
}

function write(repo, relativePath, contents) {
  const absolutePath = path.join(repo, relativePath);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, contents, "utf8");
}

function sourcePost(title, body = "Source body.\n") {
  return (
    "---\n" +
    `title: ${title}\n` +
    "lang: zh-TW\n" +
    "translationKey: tester/example\n" +
    "---\n\n" +
    body
  );
}

function translationPost(lang, sourceHash, body = "Translated body.\n") {
  return (
    "---\n" +
    `title: Translation ${lang}\n` +
    `lang: ${lang}\n` +
    "sourceLang: zh-TW\n" +
    "translationKey: tester/example\n" +
    "draft: true\n" +
    `sourceHash: ${sourceHash}\n` +
    "---\n\n" +
    body
  );
}

function runGuard(repo, args = []) {
  return spawnSync(process.execPath, [GUARD_SCRIPT, ...args], {
    cwd: repo,
    env: ISOLATED_ENV,
    encoding: "utf8",
  });
}

function runHash(repo, sourcePath) {
  return spawnSync(process.execPath, [GUARD_SCRIPT, "--hash", sourcePath], {
    cwd: repo,
    env: ISOLATED_ENV,
    encoding: "utf8",
  });
}

function withTranslationRepo(fn) {
  const repo = fs.mkdtempSync(path.join(os.tmpdir(), "translation-guard-"));
  const sourcePath = "posts/tester/example.md";
  const initialSource = sourcePost("Original title");
  const sourceHash = hashSource(initialSource);
  const translations = {};

  try {
    git(repo, ["init", "--quiet"]);
    git(repo, ["config", "user.name", "Translation Guard Test"]);
    git(repo, ["config", "user.email", "translation-guard@example.test"]);
    write(repo, sourcePath, initialSource);
    for (const lang of TARGET_LANGS) {
      const translationPath = `posts/tester/example.${lang}.md`;
      translations[lang] = translationPath;
      write(repo, translationPath, translationPost(lang, sourceHash));
    }
    git(repo, ["add", "."]);
    git(repo, ["commit", "--quiet", "-m", "initial translations"]);

    fn({ repo, sourcePath, initialSource, sourceHash, translations });
  } finally {
    fs.rmSync(repo, { recursive: true, force: true });
  }
}

test("integration: a staged title change makes translations stale", () => {
  withTranslationRepo(({ repo, sourcePath, translations }) => {
    const retitledSource = sourcePost("Retitled source");
    write(repo, sourcePath, retitledSource);
    git(repo, ["add", sourcePath]);

    const stale = runGuard(repo);
    assert.strictEqual(stale.status, 1);
    for (const lang of TARGET_LANGS) {
      assert.match(stale.stderr, new RegExp(`${lang} \\(stale\\)`));
    }

    const hashResult = runHash(repo, sourcePath);
    assert.strictEqual(hashResult.status, 0, hashResult.stderr);
    assert.strictEqual(hashResult.stdout.trim(), hashSource(retitledSource));
    for (const lang of TARGET_LANGS) {
      write(repo, translations[lang], translationPost(lang, hashResult.stdout.trim()));
      git(repo, ["add", translations[lang]]);
    }

    const repaired = runGuard(repo);
    assert.strictEqual(repaired.status, 0, repaired.stderr);
  });
});

test("integration: a staged translation deletion is reported from the index", () => {
  withTranslationRepo(({ repo, translations }) => {
    const deletedContents = fs.readFileSync(path.join(repo, translations.ja), "utf8");
    git(repo, ["rm", "--quiet", translations.ja]);
    // Recreate an unstaged working-tree copy. The staged deletion must still win.
    write(repo, translations.ja, deletedContents);

    const result = runGuard(repo);
    assert.strictEqual(result.status, 1);
    assert.match(result.stderr, /ja \(missing\)/);
  });
});

test("integration: source comparisons use staged content, not the working tree", () => {
  withTranslationRepo(({ repo, sourcePath, initialSource }) => {
    write(repo, sourcePath, sourcePost("Staged title"));
    git(repo, ["add", sourcePath]);
    // Make the working tree look current again without changing the index.
    write(repo, sourcePath, initialSource);

    const result = runGuard(repo);
    assert.strictEqual(result.status, 1);
    assert.match(result.stderr, /en \(stale\)/);
  });
});

test("integration: --all validates the working checkout", () => {
  withTranslationRepo(({ repo, sourcePath }) => {
    write(repo, sourcePath, sourcePost("Unstaged title change"));

    const stagedOnly = runGuard(repo);
    assert.strictEqual(stagedOnly.status, 0, stagedOnly.stderr);

    const fullRepository = runGuard(repo, ["--all"]);
    assert.strictEqual(fullRepository.status, 1);
    assert.match(fullRepository.stderr, /en \(stale\)/);
  });
});

test("integration: --all catches a missing translation in a clean checkout", () => {
  withTranslationRepo(({ repo, translations }) => {
    git(repo, ["rm", "--quiet", translations.ja]);
    git(repo, ["commit", "--quiet", "-m", "delete Japanese translation"]);

    const stagedOnly = runGuard(repo);
    assert.strictEqual(stagedOnly.status, 0, stagedOnly.stderr);

    const fullRepository = runGuard(repo, ["--all"]);
    assert.strictEqual(fullRepository.status, 1);
    assert.match(fullRepository.stderr, /ja \(missing\)/);
  });
});

console.log(`\n${passed} tests passed.`);
