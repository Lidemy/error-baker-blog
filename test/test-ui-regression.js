"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();
const metadata = require("../_data/metadata.json");
const activeLanguages = require("../_11ty/activeLanguages.js");
const languages = require("../_data/langs.json");

const SITE_ROOT = path.resolve(__dirname, "..", "_site");

function readPage(relative) {
  const filename = path.join(SITE_ROOT, relative);
  assert.ok(fs.existsSync(filename), `Missing build output: ${filename}`);
  return fs.readFileSync(filename, "utf8");
}

function documentFor(relative) {
  return new JSDOM(readPage(relative), { virtualConsole: quietConsole }).window.document;
}

function inlineStyle(relative) {
  const match = readPage(relative).match(/<style>([\s\S]*?)<\/style>/);
  assert.ok(match, `${relative}: no inlined <style> block`);
  return match[1];
}

describe("search dialog markup", () => {
  let dialog;

  before(() => {
    dialog = documentFor("index.html").getElementById("site-search");
  });

  it("is an accessible dialog wired for lazy index loading", () => {
    assert.ok(dialog, "missing #site-search");
    assert.equal(dialog.tagName, "DIALOG");
    assert.equal(dialog.getAttribute("aria-labelledby"), "search-title");
    assert.ok(dialog.querySelector("h2#search-title"));
    assert.equal(dialog.getAttribute("data-index-url"), "/search-index.json");
    assert.equal(dialog.getAttribute("data-lang"), "zh-TW");
    assert.ok(dialog.getAttribute("data-i18n").includes("{query}"));
  });

  it("keeps the close button and search form scoped and labelled", () => {
    const close = dialog.querySelector("button.search-dialog__close");
    assert.ok(close);
    assert.ok(close.getAttribute("aria-label").length > 0);
    const form = dialog.querySelector("form.search-form");
    assert.equal(form.getAttribute("role"), "search");
    const input = dialog.querySelector("input#search-input");
    assert.equal(input.getAttribute("type"), "search");
    assert.equal(input.getAttribute("aria-controls"), "search-results");
    assert.ok(dialog.querySelector("label[for='search-input']"));
  });

  it("announces result updates through a live region", () => {
    assert.ok(dialog.querySelector("[aria-live]"));
  });

  it("is opened by a toggle that declares its popup contract", () => {
    const toggle = documentFor("index.html").getElementById("search-toggle");
    assert.equal(toggle.getAttribute("aria-controls"), "site-search");
    assert.equal(toggle.getAttribute("aria-haspopup"), "dialog");
    assert.equal(toggle.getAttribute("aria-expanded"), "false");
  });
});

describe("language switcher markup", () => {
  it("links available languages with hreflang and marks the current one", () => {
    const doc = documentFor("index.html");
    const switcher = doc.querySelector("details.lang-switch");
    assert.ok(switcher, "missing language switcher");
    const current = switcher.querySelector(".lang-switch__item.is-current");
    assert.ok(current, "missing current-language marker");
    for (const link of switcher.querySelectorAll("a.lang-switch__item")) {
      assert.ok(link.getAttribute("hreflang"), "switcher link missing hreflang");
      assert.equal(link.getAttribute("hreflang"), link.getAttribute("lang"));
    }
  });
});

describe("signature flavors strip", () => {
  it("lists enthroned categories as chips, localized to published topics", () => {
    for (const lang of activeLanguages(false)) {
      const home = lang === languages[0] ? "index.html" : `${lang}/index.html`;
      const doc = documentFor(home);
      const chips = doc.querySelectorAll(".signature-flavors__chip");
      if (lang === languages[0]) {
        assert.equal(chips.length, 3, "zh-TW: expected all 3 category chips");
      } else {
        // A localized chip only renders when that language has at least one
        // published post in the category — otherwise it would 404.
        assert.ok(chips.length >= 1 && chips.length <= 3, `${lang}: ${chips.length}`);
      }
      for (const chip of chips) {
        assert.match(chip.getAttribute("href"), /\/tags\//);
      }
    }
  });
});

describe("footer feed link", () => {
  it("points at the current language's feed on every home page", () => {
    for (const lang of activeLanguages(false)) {
      const home = lang === languages[0] ? "index.html" : `${lang}/index.html`;
      const prefix = lang === languages[0] ? "" : `/${lang}`;
      const rss = documentFor(home).getElementById("rss");
      assert.ok(rss, `${lang}: missing footer feed link`);
      assert.equal(rss.getAttribute("href"), `${prefix}${metadata.feed.path}`);
    }
  });
});

// Pins the brand design-token decisions so later edits cannot silently
// reintroduce the divergences the design audit removed.
describe("brand token regression", () => {
  it("defines the shared radius tokens on sampled pages", () => {
    for (const page of ["index.html", "posts/tian/git-flow/index.html"]) {
      const css = inlineStyle(page);
      for (const token of [
        "--radius-surface",
        "--radius-control",
        "--radius-chip",
      ]) {
        assert.ok(css.includes(token), `${page}: missing ${token}`);
      }
    }
  });

  it("uses the ink-based shadow tint everywhere, never the off-brand one", () => {
    for (const page of ["index.html", "posts/tian/git-flow/index.html"]) {
      assert.ok(
        !inlineStyle(page).includes("rgba(20,16,13"),
        `${page}: off-brand shadow tint rgba(20,16,13,…) present`
      );
    }
  });

  it("keeps font weights on the 400/600/700 scale", () => {
    for (const page of ["index.html", "posts/tian/git-flow/index.html"]) {
      assert.ok(
        !/font-weight:\s*650/.test(inlineStyle(page)),
        `${page}: off-scale font-weight 650 present`
      );
    }
  });

  it("keeps the conditional topic-card candidate chrome through PurgeCSS", () => {
    const css = inlineStyle("tags/index.html");
    assert.ok(css.includes(".topic-card--candidate"));
    assert.ok(css.includes(".topic-card__badge"));
  });

  it("keeps the global focus-visible ring on sampled pages", () => {
    for (const page of ["index.html", "tags/index.html"]) {
      assert.ok(
        inlineStyle(page).includes(":focus-visible"),
        `${page}: global :focus-visible ring purged`
      );
    }
  });
});
