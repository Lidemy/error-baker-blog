"use strict";

const assert = require("assert").strict;
const isDraftFrontmatter = require("../_11ty/draftFlag.js");
const { frontmatterBoolean } = require("../scripts/check-translations.js");
const activeLanguages = require("../_11ty/activeLanguages.js");
const fs = require("fs");
const os = require("os");
const path = require("path");

// The divergence that motivated this suite: the build's collection gate used
// a bare regex while Eleventy's YAML parser and the translation guard both
// strip inline comments, so `draft: true # TODO` produced a page-less post
// that still leaked into sitemap/feed/hreflang collections.
const CASES = [
  ["draft: true", true],
  ["draft: true # TODO review", true],
  ['draft: "true"', true],
  ["draft: 'true'", true],
  ['draft: "true" # note', true],
  ["draft: True", true],
  ["draft: false", false],
  ["draft: false # keep visible", false],
  ["lang: en", false],
  ["", false],
];

describe("draft frontmatter predicate", () => {
  it("agrees with the translation guard on every scalar variant", () => {
    for (const [frontmatter, expected] of CASES) {
      assert.equal(
        isDraftFrontmatter(frontmatter),
        expected,
        `isDraftFrontmatter(${JSON.stringify(frontmatter)})`
      );
      assert.equal(
        frontmatterBoolean(frontmatter, "draft") === true,
        expected,
        `frontmatterBoolean(${JSON.stringify(frontmatter)})`
      );
    }
  });

  it("treats a commented draft as inactive in language discovery", () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), "draft-flag-"));
    try {
      fs.writeFileSync(
        path.join(dir, "post.en.md"),
        "---\nlang: en\ndraft: true # awaiting review\n---\nbody\n"
      );
      assert.deepEqual(activeLanguages(false, dir), ["zh-TW"]);
      assert.deepEqual(activeLanguages(true, dir), ["zh-TW", "en"]);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
