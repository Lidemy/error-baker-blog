"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();
const metadata = require("../_data/metadata.json");
const computedData = require("../_data/eleventyComputed.js");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SITE_ROOT = path.join(PROJECT_ROOT, "_site");
const { TARGET_LANGS } = require("../scripts/check-translations.js");
const { isDateOnly } = require("../_11ty/publication-dates.js");

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
    const publishable =
      frontmatterValue(raw, "draft") !== "true" &&
      Boolean(frontmatterValue(raw, "reviewedBy")) &&
      isDateOnly(frontmatterValue(raw, "reviewedAt")) &&
      isDateOnly(frontmatterValue(raw, "publishedAt"));
    if (publishable) active.add(lang);
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

  it("loads the Umami analytics script and drops every legacy GA remnant", () => {
    const htmlFiles = walk(SITE_ROOT).filter((name) => name.endsWith(".html"));
    assert.ok(htmlFiles.length > 0, "No built HTML pages to inspect");

    const websiteId = metadata.umami.websiteId;
    const scriptSrc = metadata.umami.scriptSrc;
    assert.ok(websiteId, "metadata.umami.websiteId must be set");

    const homepage = path.join(SITE_ROOT, "index.html");
    assert.ok(fs.existsSync(homepage), `Missing build output: ${homepage}`);
    const homeDoc = new JSDOM(fs.readFileSync(homepage, "utf8")).window.document;
    const umami = homeDoc.querySelector(`script[data-website-id="${websiteId}"]`);
    assert.ok(umami, "Homepage must load the Umami script with its website id");
    assert.equal(umami.getAttribute("src"), scriptSrc);

    const forbidden = [
      /cached\.js/,
      /web-vitals\.js/,
      /google-analytics\.com/,
      /googletagmanager\.com/,
      /\bga-id=/,
      /\bga\(/,
      /\.netlify\/functions\/ga\b/,
    ];
    for (const filename of htmlFiles) {
      const html = fs.readFileSync(filename, "utf8");
      const relative = path.relative(SITE_ROOT, filename);
      for (const pattern of forbidden) {
        assert.doesNotMatch(
          html,
          pattern,
          `${relative} still carries a legacy analytics remnant: ${pattern}`
        );
      }
    }
  });

  it("never publishes internal agent or diagnostic pages", () => {
    assert.equal(fs.existsSync(path.join(SITE_ROOT, "AGENTS", "index.html")), false);
    assert.equal(fs.existsSync(path.join(SITE_ROOT, "page-list", "index.html")), false);
    assert.equal(fs.existsSync(path.join(SITE_ROOT, ".agents")), false);
    assert.doesNotMatch(sitemap, /\/(?:AGENTS|page-list)\//);
  });

  for (const lang of TARGET_LANGS) {
    it(`emits ${lang} site pages only when a reviewed translation can be published`, () => {
      const expected = activeLangs.has(lang);
      const outputs = [
        path.join(SITE_ROOT, lang, "index.html"),
        path.join(SITE_ROOT, lang, "about", "index.html"),
        path.join(SITE_ROOT, lang, "feed", "feed.xml"),
        path.join(SITE_ROOT, lang, "feed", "feed.json"),
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
    const base = {
      page,
      activeLangs: ["zh-TW", "en"],
      permalink: "/{{ ap.lang }}/posts/{{ ap.author }}/",
    };

    // Active shell → the front-matter permalink template is passed through for
    // Eleventy 3.x to re-render per pagination page; inactive shell → false.
    assert.equal(
      computedData.permalink({ ...base, ap: { lang: "en", author: "tian" } }),
      "/{{ ap.lang }}/posts/{{ ap.author }}/"
    );
    assert.equal(
      computedData.permalink({ ...base, ap: { lang: "ja", author: "tian" } }),
      false
    );
  });

  it("enables both localized feed formats only for active languages", () => {
    const activeLangs = ["zh-TW", "en"];
    const cases = [
      {
        inputPath: "./feed/feed-i18n.njk",
        raw: "/{{ flang }}/feed/feed.xml",
      },
      {
        inputPath: "./feed/json-i18n.njk",
        raw: "/{{ flang }}/feed/feed.json",
      },
    ];
    for (const { inputPath, raw } of cases) {
      const base = { page: { inputPath }, activeLangs, permalink: raw };
      // Active language → template passed through verbatim (Eleventy 3.x
      // re-renders it); inactive language → false, so no page is emitted.
      assert.equal(computedData.permalink({ ...base, flang: "en" }), raw);
      assert.equal(computedData.permalink({ ...base, flang: "ja" }), false);
    }
  });

  // Eleventy 3.x re-renders a permalink template returned from computed data,
  // so an active shell simply passes its own front-matter permalink template
  // through and Eleventy resolves it per pagination page. (Eleventy 0.12 did
  // NOT re-render it, which forced an explicit concrete-URL helper here; the
  // concrete output is now asserted end-to-end by the sitemap/existence tests
  // above.)
  it("passes each active localized shell's permalink template through", () => {
    const activeLangs = ["zh-TW", "en"];
    assert.equal(
      computedData.permalink({
        page: { inputPath: "./home-i18n.njk" },
        activeLangs,
        hlang: "en",
        permalink: "/{{ hlang }}/",
      }),
      "/{{ hlang }}/"
    );
    assert.equal(
      computedData.permalink({
        page: { inputPath: "./about-i18n.njk" },
        activeLangs,
        alang: "en",
        permalink: "/{{ alang }}/about/",
      }),
      "/{{ alang }}/about/"
    );
    // An inactive shell still yields false regardless of the raw template.
    assert.equal(
      computedData.permalink({
        page: { inputPath: "./home-i18n.njk" },
        activeLangs,
        hlang: "ja",
        permalink: "/{{ hlang }}/",
      }),
      false
    );
  });
});
