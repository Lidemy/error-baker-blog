"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
const quietConsole = new VirtualConsole();
const i18n = require("../_data/i18n.json");
const {
  readingMinutes,
  CJK_PER_MINUTE,
  WORDS_PER_MINUTE,
} = require("../_11ty/readingTime.js");

const PROJECT_ROOT = path.resolve(__dirname, "..");

function documentAt(relativeOutputPath) {
  const filename = path.join(PROJECT_ROOT, "_site", relativeOutputPath);
  assert.ok(fs.existsSync(filename), `Missing build output: ${filename}`);
  return new JSDOM(fs.readFileSync(filename, "utf8"), {
    virtualConsole: quietConsole,
  }).window.document;
}

describe("reading time estimate", () => {
  it("never promises less than a minute", () => {
    assert.equal(readingMinutes(""), 1);
    assert.equal(readingMinutes(null), 1);
    assert.equal(readingMinutes("<p>短。</p>"), 1);
  });

  it("counts CJK per character and Latin per word", () => {
    const cjk = "字".repeat(CJK_PER_MINUTE * 3);
    const latin = Array.from({ length: WORDS_PER_MINUTE * 3 }, () => "word").join(" ");
    assert.equal(readingMinutes(`<p>${cjk}</p>`), 3);
    assert.equal(readingMinutes(`<p>${latin}</p>`), 3);
    // A bilingual post adds the two estimates rather than picking one.
    assert.equal(readingMinutes(`<p>${cjk}</p><p>${latin}</p>`), 6);
  });

  it("reads text, not markup", () => {
    const words = Array.from({ length: WORDS_PER_MINUTE * 2 }, () => "word").join(" ");
    const wrapped = `<div class="a-very-long-class-name"><p>${words}</p></div>`;
    assert.equal(readingMinutes(wrapped), 2);
    // Inline scripts (JSON-LD, utterances embeds) are not prose.
    assert.equal(readingMinutes(`<script>${words}</script><p>短文。</p>`), 1);
  });

  it("prints a localized estimate in every post byline", () => {
    const pages = {
      "zh-TW": "posts/tian/git-flow/index.html",
      en: "en/posts/tian/git-flow/index.html",
      ja: "ja/posts/tian/git-flow/index.html",
      "zh-CN": "zh-CN/posts/tian/git-flow/index.html",
    };

    for (const [lang, outputPath] of Object.entries(pages)) {
      const reading = documentAt(outputPath).querySelector(
        ".byline .byline-reading"
      );
      assert.ok(reading, `${lang} post is missing its reading-time byline`);

      const template = i18n[lang].readingTime;
      assert.ok(template.includes("{count}"), `${lang} readingTime needs {count}`);
      const expected = new RegExp(
        `^${template
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
          .replace("\\{count\\}", "\\d+")}$`
      );
      assert.match(reading.textContent.trim(), expected);
    }
  });
});
