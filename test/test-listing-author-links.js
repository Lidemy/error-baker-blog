// The shared `postslist.njk` partial (used by the archive and tag listing
// pages) must build author links through the `authorUrlForLang` filter, the
// same way `home-postslist.njk` does, rather than hardcoding
// `/posts/{author}`. On the default (zh-TW) listings the filter yields the
// canonical trailing-slash form `/posts/{author}/`; hardcoding dropped the
// slash and — more importantly — would point future localized listings at the
// zh-TW author page. This guards both the trailing-slash form and the "links
// resolve to a real author page" invariant.
"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const metadata = require("../_data/metadata.json");

const SITE_ROOT = path.resolve(__dirname, "..", "_site");
const ARCHIVE = path.join(SITE_ROOT, "archive", "index.html");

function authorLinks(doc) {
  return [...doc.querySelectorAll(".archive-by a")].map((link) =>
    link.getAttribute("href")
  );
}

describe("listing-page author links (postslist.njk)", () => {
  let doc;

  before(() => {
    assert.ok(fs.existsSync(ARCHIVE), `Missing build output: ${ARCHIVE}`);
    doc = new JSDOM(fs.readFileSync(ARCHIVE, "utf8")).window.document;
  });

  it("emits at least one author link", () => {
    assert.ok(
      authorLinks(doc).length > 0,
      "Expected the archive listing to render author links"
    );
  });

  it("links each author with the localized (trailing-slash) URL form", () => {
    for (const href of authorLinks(doc)) {
      // zh-TW archive → filter returns `/posts/{author}/`.
      assert.match(
        href,
        /^\/posts\/[^/]+\/$/,
        `Author link is not the localized /posts/{author}/ form: ${href}`
      );
    }
  });

  it("never emits the hardcoded slash-less /posts/{author} link", () => {
    for (const href of authorLinks(doc)) {
      assert.doesNotMatch(
        href,
        /^\/posts\/[^/]+$/,
        `Author link uses the old hardcoded form (missing trailing slash): ${href}`
      );
    }
  });

  it("points every author link at a real generated author page", () => {
    for (const href of authorLinks(doc)) {
      const pathname = decodeURIComponent(new URL(href, metadata.url).pathname);
      const output = path.join(SITE_ROOT, pathname, "index.html");
      assert.ok(
        fs.existsSync(output),
        `Author link points to missing output: ${pathname}`
      );
    }
  });
});
