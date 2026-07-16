"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { CSS_FILES, readCssBundle } = require("../_11ty/css-bundle.js");

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

  it("keeps the banner dismiss control isolated from global button styles", () => {
    const css = inlinedCss("posts/tian/git-flow/index.html");
    const dismissRule = css.match(
      /\.lang-suggest>\.lang-suggest__dismiss\{([^}]*)\}/
    );
    assert.ok(dismissRule, "Expected the specific banner dismiss-button reset");
    assert.match(dismissRule[1], /margin:0/);
    // clean-css serializes `transparent` shorthand as the equivalent `0 0`.
    assert.match(dismissRule[1], /background:(?:transparent|0 0)/);
  });

  it("contains no retired language-nav selectors in the source stylesheet", () => {
    const css = readCssBundle();
    assert.doesNotMatch(css, /\.lang-nav/);
    assert.match(css, /\.lang-suggest/);
  });

  it("bundles component styles in stable cascade order", () => {
    assert.deepEqual(CSS_FILES, [
      "css/main.css",
      "css/components/lang-suggest.css",
      "css/components/header-nav.css",
    ]);

    const css = readCssBundle();
    const bannerStart = css.indexOf("Locale-suggestion banner");
    const headerStart = css.indexOf("HEADER — quiet editorial top bar");
    assert.ok(bannerStart > -1, "Expected the locale suggestion component");
    assert.ok(headerStart > bannerStart, "Expected header styles after banner styles");

    const main = fs.readFileSync(path.join(PROJECT_ROOT, CSS_FILES[0]), "utf8");
    const banner = fs.readFileSync(path.join(PROJECT_ROOT, CSS_FILES[1]), "utf8");
    const header = fs.readFileSync(path.join(PROJECT_ROOT, CSS_FILES[2]), "utf8");
    assert.doesNotMatch(main, /\.lang-suggest/);
    assert.match(banner, /body\.dark \.lang-suggest/);
    assert.match(header, /html\.js \.nav__links/);
    assert.match(header, /html:not\(\.js\) #nav-toggle/);
  });

  it("publishes only CSS that pages load directly", () => {
    CSS_FILES.forEach((relativePath) => {
      assert.equal(
        fs.existsSync(path.join(PROJECT_ROOT, "_site", relativePath)),
        false,
        `${relativePath} is a build-only source`
      );
    });
    assert.ok(
      fs.existsSync(path.join(PROJECT_ROOT, "_site", "css", "gamification.css"))
    );
  });
});
