"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();
const metadata = require("../_data/metadata.json");
const i18n = require("../_data/i18n.json");

const POST_PATH = "/posts/tian/git-flow/";
const POST_URL = metadata.url + POST_PATH;
const POST_FILENAME = path.resolve(
  __dirname,
  "..",
  "_site",
  "posts",
  "tian",
  "git-flow",
  "index.html"
);
const IMAGE_POST_FILENAME = path.resolve(
  __dirname,
  "..",
  "_site",
  "posts",
  "ruofan",
  "go-RESTful-api",
  "index.html"
);

describe("representative post build output", () => {
  let doc;

  before(() => {
    assert.ok(fs.existsSync(POST_FILENAME), `Missing build output: ${POST_FILENAME}`);
    doc = new JSDOM(fs.readFileSync(POST_FILENAME, "utf8"), { virtualConsole: quietConsole }).window.document;
  });

  it("has correct title, language, canonical, and social metadata", () => {
    assert.equal(doc.documentElement.lang, "zh-TW");
    assert.match(doc.title, /^我所理解的 GitFlow/);
    assert.equal(doc.querySelector("link[rel='canonical']").href, POST_URL);
    assert.equal(doc.querySelector("meta[property='og:url']").content, POST_URL);
    assert.ok(doc.querySelector("meta[name='description']").content.length > 0);
  });

  it("has inlined CSS and the fingerprinted client bundle", () => {
    const styles = doc.querySelectorAll("style");
    assert.equal(styles.length, 1, "Expected one optimized inline stylesheet");
    assert.match(styles[0].textContent, /header nav/);
    assert.equal(
      doc.querySelectorAll("link[rel='stylesheet']").length,
      0,
      "Post pages should not request another stylesheet"
    );
    const bundle = doc.querySelector("script[src^='/js/min.js?hash=']");
    assert.ok(bundle, "Expected fingerprinted /js/min.js client bundle");
  });

  it("has an accessible share control and correct publication date", () => {
    const shares = [...doc.querySelectorAll("[on-click='share']")];
    assert.equal(shares.length, 1, "Expected one article sharing action");

    const share = shares[0];
    assert.ok(share.matches("main article .post-share > button.post-share__button"));
    assert.equal(share.tagName, "BUTTON");
    assert.equal(share.type, "button");
    assert.equal(share.hasAttribute("href"), false, "A button must not have href");
    assert.equal(share.dataset.shareUrl, POST_URL);
    assert.equal(share.getAttribute("aria-label"), i18n["zh-TW"].shareArticle);
    assert.match(share.textContent, new RegExp(i18n["zh-TW"].shareArticle));

    const published = doc.querySelector("time.byline-date");
    assert.equal(published.getAttribute("datetime"), "2021-10-28");
    assert.match(published.textContent, /2021-10-28/);
  });

  it("emits valid Article JSON-LD for the post", () => {
    const value = doc.querySelector("script[type='application/ld+json']").textContent;
    const article = JSON.parse(value);
    assert.equal(article["@type"], "Article");
    assert.equal(article.headline, "我所理解的 GitFlow");
    assert.equal(article.inLanguage, "zh-TW");
    assert.equal(article.url, POST_URL);
    assert.equal(article.mainEntityOfPage, POST_URL);
    assert.equal(article.datePublished, "2021-10-28");
    assert.equal(article.dateModified, article.datePublished);
    assert.deepEqual(article.image, [metadata.ogimage]);
    assert.equal(article.author.name, "Tian");
    assert.equal(article.author.url, `${metadata.url}/posts/tian/`);
    assert.equal(article.publisher.name, metadata.publisher.name);
    assert.equal(article.publisher.url, metadata.url);
    assert.equal(article.publisher.logo.url, metadata.url + metadata.publisher.logo);
    assert.equal(article.publisher.logo.width, 512);
    assert.equal(article.publisher.logo.height, 512);
    assert.equal(Object.hasOwn(article, "genre"), false);
  });

  it("uses exactly the declared hero image when a post has one", () => {
    assert.ok(
      fs.existsSync(IMAGE_POST_FILENAME),
      `Missing build output: ${IMAGE_POST_FILENAME}`
    );
    const imagePost = new JSDOM(fs.readFileSync(IMAGE_POST_FILENAME, "utf8"), {
      virtualConsole: quietConsole,
    }).window.document;
    const article = JSON.parse(
      imagePost.querySelector("script[type='application/ld+json']").textContent
    );
    assert.deepEqual(article.image, [
      `${metadata.url}/img/posts/ruofan/go-1.png`,
    ]);
  });

  it("adds dimensions and responsive sources to local raster images", () => {
    assert.ok(
      fs.existsSync(IMAGE_POST_FILENAME),
      `Missing build output: ${IMAGE_POST_FILENAME}`
    );
    const imageDoc = new JSDOM(fs.readFileSync(IMAGE_POST_FILENAME, "utf8"), {
      virtualConsole: quietConsole,
    }).window.document;
    const image = imageDoc.querySelector("picture img[src^='/img/']:not(.avatar)");
    assert.ok(image, "Expected at least one optimized local image");
    assert.match(image.getAttribute("width"), /^\d+$/);
    assert.match(image.getAttribute("height"), /^\d+$/);
    assert.equal(image.getAttribute("loading"), "lazy");
    assert.equal(image.getAttribute("decoding"), "async");

    const sources = [...image.closest("picture").querySelectorAll("source")];
    assert.ok(sources.some((source) => source.type === "image/webp"));
    assert.ok(sources.some((source) => source.type === "image/jpeg"));
  });

  it("advertises published translations and never drafts", () => {
    // Derive this post's published translation languages from the source of
    // truth (sibling .<lang>.md frontmatter), so the assertion follows the
    // actual publication state instead of hardcoding it.
    const langs = require("../_data/langs.json");
    const published = langs.slice(1).filter((lang) => {
      const file = path.resolve(__dirname, "..", `posts/tian/git-flow.${lang}.md`);
      if (!fs.existsSync(file)) return false;
      const fm = fs
        .readFileSync(file, "utf8")
        .match(/^---\r?\n([\s\S]*?)\r?\n---/);
      return fm && !/^draft:\s*(?:true|["']true["'])\s*$/m.test(fm[1]);
    });

    const hreflangs = [
      ...doc.querySelectorAll("link[rel='alternate'][hreflang]"),
    ].map((link) => link.getAttribute("hreflang"));

    if (published.length === 0) {
      assert.equal(hreflangs.length, 0);
      assert.equal(doc.querySelector("#lang-suggest"), null);
      return;
    }
    // Source + each published translation + x-default; nothing else — a draft
    // or missing language must never leak into the alternates.
    const allowed = ["zh-TW", "x-default", ...published];
    assert.equal(hreflangs.length, published.length + 2);
    allowed.forEach((lang) => assert.ok(hreflangs.includes(lang), `missing hreflang ${lang}`));
    hreflangs.forEach((lang) => assert.ok(allowed.includes(lang), `unexpected hreflang ${lang}`));

    const banner = doc.querySelector("#lang-suggest");
    assert.ok(banner, "Expected a language suggestion for a translated post");
    assert.equal(banner.hidden, true, "Client-side language matching reveals the banner");
    assert.equal(banner.getAttribute("aria-live"), "polite");
    assert.ok(banner.querySelector(".lang-suggest__icon[aria-hidden='true']"));
    assert.ok(banner.querySelector(".lang-suggest__content"));
    assert.ok(banner.querySelector("button.lang-suggest__dismiss[aria-label]"));
    const bannerStrings = JSON.parse(banner.getAttribute("data-strings"));
    assert.deepEqual(bannerStrings.en, {
      available: "This page is available in English",
      read: "Read in English",
      dismiss: "Dismiss",
    });
  });
});
