"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();
const i18n = require("../_data/i18n.json");

const POST_FILENAME = path.resolve(
  __dirname,
  "..",
  "_site",
  "posts",
  "tian",
  "git-flow",
  "index.html"
);
const JA_POST_FILENAME = path.resolve(
  __dirname,
  "..",
  "_site",
  "ja",
  "posts",
  "tian",
  "git-flow",
  "index.html"
);
const EN_POST_FILENAME = path.resolve(
  __dirname,
  "..",
  "_site",
  "en",
  "posts",
  "tian",
  "git-flow",
  "index.html"
);

describe("article readability build output", () => {
  let doc;
  let inlineCss;

  before(() => {
    assert.ok(fs.existsSync(POST_FILENAME), `Missing build output: ${POST_FILENAME}`);
    doc = new JSDOM(fs.readFileSync(POST_FILENAME, "utf8"), { virtualConsole: quietConsole }).window.document;
    inlineCss = doc.querySelector("style").textContent;
  });

  it("ships an empty TOC shell for the client script to fill", () => {
    const toc = doc.querySelector("nav#toc");
    assert.ok(toc, "Expected <nav id='toc'> shell");
    const list = toc.querySelector(".toc-list");
    assert.ok(list);
    assert.equal(list.children.length, 0, "TOC entries are added client-side");
  });

  it("anchors every section heading for the TOC and deep links", () => {
    const headings = [...doc.querySelectorAll("article h2[id], article h3[id]")];
    assert.ok(headings.length >= 2, "Expected at least two addressable headings");
    for (const heading of headings) {
      assert.ok(
        heading.querySelector("a.direct-link"),
        `Heading #${heading.id} is missing its direct link`
      );
    }
  });

  it("renders the reading progress bar element", () => {
    assert.ok(doc.getElementById("reading-progress"));
  });

  it("renders one initially-hidden, localized back-to-top component", () => {
    const tools = doc.querySelector("body > .reader-tools");
    const controls = [...doc.querySelectorAll("#back-to-top")];

    assert.ok(tools, "Expected the fixed reader-tools shell");
    assert.equal(tools.hidden, true, "Client-side scrolling reveals the shell");
    assert.equal(controls.length, 1);

    const control = controls[0];
    assert.ok(control.matches(".reader-tools > button.reader-tool.back-to-top"));
    assert.equal(control.type, "button");
    assert.equal(control.hidden, true, "Client-side scrolling reveals the control");
    assert.equal(control.getAttribute("aria-label"), i18n["zh-TW"].backToTop);
    assert.ok(control.querySelector("svg[aria-hidden='true']"));
    assert.doesNotMatch(control.textContent, /↑/, "Use an icon, not a raw arrow glyph");
  });

  it("keeps JS-toggled reading UI selectors through the CSS purge", () => {
    assert.match(inlineCss, /#reading-progress/);
    assert.match(inlineCss, /\.toc-ready/);
    assert.match(inlineCss, /\.direct-link/);
    assert.match(inlineCss, /\.reader-tools/);
    assert.match(inlineCss, /\.back-to-top/);
  });

  it("keeps language-aware article typography through the CSS purge", () => {
    // `:lang(...) article` starts with a functional pseudo-class purgecss@2
    // cannot match against page content; a whitelistPatterns entry keeps it.
    assert.match(inlineCss, /:lang\([^)]+\)[^{]*article[^{]*\{[^}]*line-height:1\.85/);
    assert.match(inlineCss, /:lang\(en\)[^{]*article[^{]*\{[^}]*line-height:1\.7/);
  });

  it("applies the matching document language on translated pages", () => {
    const ja = new JSDOM(fs.readFileSync(JA_POST_FILENAME, "utf8"), { virtualConsole: quietConsole }).window.document;
    const en = new JSDOM(fs.readFileSync(EN_POST_FILENAME, "utf8"), { virtualConsole: quietConsole }).window.document;
    assert.equal(ja.documentElement.lang, "ja");
    assert.equal(en.documentElement.lang, "en");
    assert.match(ja.querySelector("style").textContent, /line-height:1\.85/);
    assert.match(en.querySelector("style").textContent, /line-height:1\.7/);
  });
});
