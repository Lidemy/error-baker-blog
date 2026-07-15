"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const POST_FILENAME = path.resolve(
  __dirname,
  "..",
  "_site",
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
    doc = new JSDOM(fs.readFileSync(POST_FILENAME, "utf8")).window.document;
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

  it("keeps JS-toggled reading UI selectors through the CSS purge", () => {
    assert.match(inlineCss, /#reading-progress/);
    assert.match(inlineCss, /\.toc-ready/);
    assert.match(inlineCss, /\.direct-link/);
  });

  it("keeps language-aware article typography through the CSS purge", () => {
    // `:lang(...) article` starts with a functional pseudo-class purgecss@2
    // cannot match against page content; a whitelistPatterns entry keeps it.
    assert.match(inlineCss, /:lang\([^)]+\)[^{]*article[^{]*\{[^}]*line-height:1\.85/);
    assert.match(inlineCss, /:lang\(en\)[^{]*article[^{]*\{[^}]*line-height:1\.7/);
  });
});
