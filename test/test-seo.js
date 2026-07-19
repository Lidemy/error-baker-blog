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

function documentFor(relative) {
  const filename = path.join(SITE_ROOT, relative);
  assert.ok(fs.existsSync(filename), `Missing build output: ${filename}`);
  return new JSDOM(fs.readFileSync(filename, "utf8"), { virtualConsole: quietConsole }).window.document;
}

// Head-emission SEO contract for the layouts in base.njk. Canonical,
// description, og:url and hreflang sets are already pinned elsewhere
// (test-homepage, test-generic-post, test-production-output); this suite
// covers the tags no other test asserts.
describe("SEO head emissions", () => {
  const samples = [
    "index.html",
    "posts/tian/git-flow/index.html",
    "tags/index.html",
    "about/index.html",
    "en/about/index.html",
  ];

  for (const relative of samples) {
    describe(relative, () => {
      let doc;

      before(() => {
        doc = documentFor(relative);
      });

      it("stays indexable with exactly one canonical", () => {
        assert.equal(
          doc.querySelector("meta[name='robots']").content,
          "index, follow"
        );
        assert.equal(doc.querySelectorAll("link[rel='canonical']").length, 1);
      });

      it("emits the Open Graph and Twitter card set", () => {
        for (const property of [
          "og:title",
          "og:description",
          "og:image",
          "og:type",
          "og:site_name",
          "og:url",
        ]) {
          const tag = doc.querySelector(`meta[property='${property}']`);
          assert.ok(tag, `missing ${property}`);
          assert.ok(tag.content.length > 0, `empty ${property}`);
        }
        assert.equal(
          doc.querySelector("meta[name='twitter:card']").content,
          "summary"
        );
      });

      it("has a non-empty page title", () => {
        assert.ok(doc.querySelector("title").textContent.trim().length > 0);
      });
    });
  }

  it("links the localized Atom and JSON feeds from every language home", () => {
    for (const lang of activeLanguages(false)) {
      const home = lang === languages[0] ? "index.html" : `${lang}/index.html`;
      const doc = documentFor(home);
      const prefix = lang === languages[0] ? "" : `/${lang}`;
      const atom = doc.querySelector("link[type='application/atom+xml']");
      const json = doc.querySelector("link[type='application/feed+json']");
      assert.ok(atom, `${lang}: missing Atom feed link`);
      assert.equal(atom.getAttribute("href"), `${prefix}${metadata.feed.path}`);
      assert.ok(json, `${lang}: missing JSON feed link`);
      assert.equal(
        json.getAttribute("href"),
        `${prefix}${metadata.jsonfeed.path}`
      );
    }
  });
});

describe("SEO deployment artifacts", () => {
  it("keeps the search index out of search engines via _headers", () => {
    const headers = fs.readFileSync(path.join(SITE_ROOT, "_headers"), "utf8");
    const block = headers.split("/search-index.json")[1] || "";
    assert.ok(
      /X-Robots-Tag:\s*noindex/.test(block),
      "search-index.json must carry X-Robots-Tag: noindex"
    );
  });

  it("advertises the sitemap from robots.txt", () => {
    const robots = fs.readFileSync(path.join(SITE_ROOT, "robots.txt"), "utf8");
    assert.ok(robots.includes(`Sitemap: ${metadata.url}/sitemap.xml`));
  });

  it("lists the topic map in the sitemap", () => {
    const sitemap = fs.readFileSync(
      path.join(SITE_ROOT, "sitemap.xml"),
      "utf8"
    );
    assert.ok(sitemap.includes(`<loc>${metadata.url}/tags/</loc>`));
  });
});
