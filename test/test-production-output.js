"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const metadata = require("../_data/metadata.json");
const computedData = require("../_data/eleventyComputed.js");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SITE_ROOT = path.join(PROJECT_ROOT, "_site");
const { TARGET_LANGS } = require("../scripts/check-translations.js");

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function frontmatterValue(raw, field) {
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!block) return null;
  const match = block[1].match(new RegExp(`^${field}:\\s*(.*?)\\s*$`, "m"));
  if (!match) return null;
  const value = match[1].trim();
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function activeTranslationLanguages() {
  const active = new Set();
  for (const filename of walk(path.join(PROJECT_ROOT, "posts"))) {
    const normalized = filename.split(path.sep).join("/");
    const lang = TARGET_LANGS.find((code) => normalized.endsWith(`.${code}.md`));
    if (!lang) continue;
    const raw = fs.readFileSync(filename, "utf8");
    if (frontmatterValue(raw, "draft") !== "true") active.add(lang);
  }
  return active;
}

function outputPathForUrl(urlString) {
  const pathname = decodeURIComponent(new URL(urlString, metadata.url).pathname);
  if (pathname.endsWith("/")) return path.join(SITE_ROOT, pathname, "index.html");
  return path.join(SITE_ROOT, pathname);
}

describe("production output boundaries", () => {
  const activeLangs = activeTranslationLanguages();
  let sitemap;
  let sitemapUrls;

  before(() => {
    const sitemapPath = path.join(SITE_ROOT, "sitemap.xml");
    assert.ok(fs.existsSync(sitemapPath), `Missing build output: ${sitemapPath}`);
    sitemap = fs.readFileSync(sitemapPath, "utf8");
    const sitemapDoc = new JSDOM(sitemap, { contentType: "text/xml" }).window.document;
    sitemapUrls = [...sitemapDoc.querySelectorAll("loc")].map((node) => node.textContent);
  });

  it("never publishes internal agent or diagnostic pages", () => {
    assert.equal(fs.existsSync(path.join(SITE_ROOT, "AGENTS", "index.html")), false);
    assert.equal(fs.existsSync(path.join(SITE_ROOT, "page-list", "index.html")), false);
    assert.doesNotMatch(sitemap, /\/(?:AGENTS|page-list)\//);
  });

  for (const lang of TARGET_LANGS) {
    it(`emits ${lang} site pages only when a reviewed translation can be published`, () => {
      const expected = activeLangs.has(lang);
      const outputs = [
        path.join(SITE_ROOT, lang, "index.html"),
        path.join(SITE_ROOT, lang, "about", "index.html"),
        path.join(SITE_ROOT, lang, "feed", "feed.xml"),
      ];
      for (const output of outputs) {
        assert.equal(
          fs.existsSync(output),
          expected,
          `${output} ${expected ? "was not emitted" : "must not be emitted"}`
        );
      }

      const localizedPrefix = `${metadata.url}/${lang}/`;
      assert.equal(
        sitemapUrls.some((url) => url.startsWith(localizedPrefix)),
        expected,
        `Unexpected sitemap state for ${lang}`
      );
    });
  }

  it("contains no duplicate or non-emitted sitemap URLs", () => {
    assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, "Duplicate sitemap URL");
    for (const url of sitemapUrls) {
      assert.ok(
        fs.existsSync(outputPathForUrl(url)),
        `Sitemap references missing output: ${url}`
      );
    }
  });

  it("does not expose inactive languages through hreflang", () => {
    for (const filename of walk(SITE_ROOT).filter((name) => name.endsWith(".html"))) {
      const html = fs.readFileSync(filename, "utf8");
      for (const lang of TARGET_LANGS) {
        if (activeLangs.has(lang)) continue;
        const attribute = new RegExp(
          `\\bhreflang=(?:"${lang}"|'${lang}'|${lang})(?=\\s|>)`
        );
        assert.doesNotMatch(
          html,
          attribute,
          `${path.relative(SITE_ROOT, filename)} links inactive hreflang ${lang}`
        );
      }
    }
  });

  it("enables localized author shells only for active languages", () => {
    const page = { inputPath: "./author-langs.njk" };
    const collections = { siteLangsWithPublishedPosts: ["zh-TW", "en"] };
    const base = {
      page,
      collections,
      permalink: "/en/posts/tian/",
    };

    assert.equal(
      computedData.permalink({ ...base, ap: { lang: "en", author: "tian" } }),
      base.permalink
    );
    assert.equal(
      computedData.permalink({ ...base, ap: { lang: "ja", author: "tian" } }),
      false
    );
  });
});
