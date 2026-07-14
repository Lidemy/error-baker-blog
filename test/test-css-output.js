"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const activeLanguages = require("../_11ty/activeLanguages.js");

function inlinedCss(relativeOutputPath) {
  const filename = path.join(PROJECT_ROOT, "_site", relativeOutputPath);
  assert.ok(fs.existsSync(filename), `Missing build output: ${filename}`);
  const doc = new JSDOM(fs.readFileSync(filename, "utf8")).window.document;
  const style = doc.querySelector("style");
  assert.ok(style, `Missing inlined CSS: ${filename}`);
  return style.textContent;
}

describe("purged CSS output", () => {
  it("keeps language UI styles only when other languages are live", () => {
    const css = inlinedCss("index.html");
    assert.doesNotMatch(css, /\.lang-nav/);
    assert.match(css, /\.lang-switch/);
    // The reading-language banner only renders (and its styles only survive
    // PurgeCSS) once at least one non-default language has published posts.
    if (activeLanguages(false).length > 1) {
      assert.match(css, /\.lang-suggest/);
    } else {
      assert.doesNotMatch(css, /\.lang-suggest/);
    }
  });

  it("keeps classes added dynamically by the table-of-contents script", () => {
    const css = inlinedCss("posts/tian/git-flow/index.html");
    assert.match(css, /\.toc\.toc-ready/);
    assert.match(css, /\.toc-list \.toc-h3/);
    assert.match(css, /\.toc-list a\.active/);
  });

  it("contains no retired language-nav selectors in the source stylesheet", () => {
    const css = fs.readFileSync(path.join(PROJECT_ROOT, "css", "main.css"), "utf8");
    assert.doesNotMatch(css, /\.lang-nav/);
    assert.match(css, /\.lang-suggest/);
  });
});
