"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const metadata = require("../_data/metadata.json");

const SITE_ROOT = path.resolve(__dirname, "..", "_site");
const FILENAME = path.join(SITE_ROOT, "index.html");

describe("homepage build output", () => {
  let doc;

  before(() => {
    assert.ok(fs.existsSync(FILENAME), `Missing build output: ${FILENAME}`);
    doc = new JSDOM(fs.readFileSync(FILENAME, "utf8")).window.document;
  });

  it("has localized document metadata and a self canonical", () => {
    assert.equal(doc.documentElement.lang, "zh-TW");
    assert.equal(
      doc.querySelector("link[rel='canonical']").href,
      `${metadata.url}/`
    );
    assert.ok(doc.querySelector("meta[name='description']").content.length > 0);
  });

  it("has working primary navigation", () => {
    const hrefs = [...doc.querySelectorAll("header nav a")].map((link) =>
      link.getAttribute("href")
    );
    assert.ok(hrefs.includes("/archive/"));
    assert.ok(hrefs.includes("/tags/"));
    assert.ok(hrefs.includes("/about/"));
  });

  it("lists real posts whose generated pages exist", () => {
    const links = [...doc.querySelectorAll(".posts .post-title a")];
    assert.ok(links.length > 0, "Expected at least one post on the homepage");

    for (const link of links) {
      const pathname = new URL(link.href, metadata.url).pathname;
      const output = path.join(SITE_ROOT, pathname, "index.html");
      assert.ok(fs.existsSync(output), `Homepage links to missing output: ${pathname}`);
    }
  });
});
