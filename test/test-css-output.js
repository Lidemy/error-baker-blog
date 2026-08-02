"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();
const { CSS_FILES, readCssBundle } = require("../_11ty/css-bundle.js");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const activeLanguages = require("../_11ty/activeLanguages.js");

function inlinedCss(relativeOutputPath) {
  const filename = path.join(PROJECT_ROOT, "_site", relativeOutputPath);
  assert.ok(fs.existsSync(filename), `Missing build output: ${filename}`);
  const doc = new JSDOM(fs.readFileSync(filename, "utf8"), { virtualConsole: quietConsole }).window.document;
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

  it("never opens a selector with a functional pseudo-class", () => {
    // purgecss@2 silently discards any selector branch that *starts* with a
    // functional pseudo-class. That is why `:lang(...)` needs a whitelist
    // pattern — and it is how the editorial inline-code chip
    // (`:not(pre) > code:not([class*="language-"])`) disappeared from every
    // built page, leaving inline <code> on the dark block surface in light
    // mode. Any new rule written that way would fail the same silent way.
    const css = readCssBundle().replace(/\/\*[\s\S]*?\*\//g, "");
    const offenders = css
      .split("}")
      .flatMap((block) => (block.includes("{") ? block.split("{")[0] : []))
      .flatMap((selectorList) => selectorList.split(","))
      .map((selector) => selector.trim())
      .filter((selector) => /^:(?!lang\()[a-z-]+\(/.test(selector));
    assert.deepEqual(
      offenders,
      [],
      "Rewrite these without a leading :not()/:is()/:where() — purgecss@2 drops them"
    );
  });

  it("keeps the inline-code chip on plain <code> through the purge", () => {
    // Pick a page that actually has an inline <code>; PurgeCSS is per page, so
    // asserting on a post without one would pass for the wrong reason.
    const postsRoot = path.join(PROJECT_ROOT, "_site", "posts");
    const page = fs
      .readdirSync(postsRoot)
      .filter((author) => fs.statSync(path.join(postsRoot, author)).isDirectory())
      .flatMap((author) =>
        fs
          .readdirSync(path.join(postsRoot, author))
          .map((slug) => path.join("posts", author, slug, "index.html"))
      )
      .find((relativePath) => {
        const filename = path.join(PROJECT_ROOT, "_site", relativePath);
        if (!fs.existsSync(filename)) return false;
        const body = fs.readFileSync(filename, "utf8").split("</head>")[1] || "";
        return /<p>(?:(?!<\/p>).)*<code(?![^>]*language-)/s.test(body);
      });
    assert.ok(page, "Expected at least one post with inline code");

    const css = inlinedCss(page);
    const chip = [...css.matchAll(/(?:^|\})([^{}]+)\{([^}]*)\}/g)].find(
      ([, selectors, declarations]) =>
        selectors.split(",").some((selector) => selector.trim() === "code") &&
        declarations.includes("--inlineCodeBg")
    );
    assert.ok(chip, "Expected the inline chip to apply to bare <code>");
    assert.match(chip[2], /var\(--inlineCodeColor\)/);
    // Inside a block the <pre> owns the surface, so the chip must be undone.
    assert.match(css, /pre code\{[^}]*background:(?:none|0 0)/);
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
      "css/components/reader-tools.css",
      "css/components/search.css",
      "css/components/not-found.css",
    ]);

    const css = readCssBundle();
    const bannerStart = css.indexOf("Locale-suggestion banner");
    const headerStart = css.indexOf("HEADER — quiet editorial top bar");
    const readerToolsStart = css.indexOf("READER TOOLS — quiet");
    const searchStart = css.indexOf("FIND A LOAF — site-wide");
    const notFoundStart = css.indexOf(".not-found {");
    assert.ok(bannerStart > -1, "Expected the locale suggestion component");
    assert.ok(headerStart > bannerStart, "Expected header styles after banner styles");
    assert.ok(readerToolsStart > headerStart, "Expected reader tools after header styles");
    assert.ok(searchStart > readerToolsStart, "Expected search styles after reader tools");
    assert.ok(notFoundStart > searchStart, "Expected not-found styles after search styles");

    const main = fs.readFileSync(path.join(PROJECT_ROOT, CSS_FILES[0]), "utf8");
    const banner = fs.readFileSync(path.join(PROJECT_ROOT, CSS_FILES[1]), "utf8");
    const header = fs.readFileSync(path.join(PROJECT_ROOT, CSS_FILES[2]), "utf8");
    const readerTools = fs.readFileSync(path.join(PROJECT_ROOT, CSS_FILES[3]), "utf8");
    const search = fs.readFileSync(path.join(PROJECT_ROOT, CSS_FILES[4]), "utf8");
    const notFound = fs.readFileSync(path.join(PROJECT_ROOT, CSS_FILES[5]), "utf8");
    assert.doesNotMatch(main, /\.lang-suggest/);
    assert.match(banner, /body\.dark \.lang-suggest/);
    assert.match(header, /html\.js \.nav__links/);
    assert.match(header, /html:not\(\.js\) #nav-toggle/);
    assert.match(readerTools, /\.reader-tools > button\.reader-tool/);
    assert.match(readerTools, /border-radius:\s*50%/);
    assert.match(search, /dialog\.search-dialog/);
    assert.match(search, /#nav > button\.search-toggle/);
    assert.match(notFound, /\.not-found__mark/);
  });

  it("keeps typography web-safe anchored on the 400/600/700 weight scale", () => {
    const css = readCssBundle();
    // Serif stacks must end on guaranteed platform fonts, not luck-based ones.
    assert.doesNotMatch(css, /Apple Garamond|Source Serif 4/);
    assert.match(css, /"Fraunces", "Iowan Old Style", Georgia/);
    // The display webfont must survive PurgeCSS into built pages (checked
    // below on the bundle; fontFace pruning is the failure mode to catch).
    assert.match(css, /@font-face/);
    assert.match(css, /fraunces-latin-var\.woff2/);
    assert.match(css, /"PMingLiU"/);
    assert.match(css, /"SimSun"/);
    assert.match(css, /"MS PMincho"/);
    // No black weights: CJK system fonts would synthesize them into smears.
    assert.doesNotMatch(css, /font-weight:\s*(800|900)\b/);
    assert.doesNotMatch(css, /--black/);
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
