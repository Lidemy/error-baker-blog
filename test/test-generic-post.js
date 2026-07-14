"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const metadata = require("../_data/metadata.json");

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
    doc = new JSDOM(fs.readFileSync(POST_FILENAME, "utf8")).window.document;
  });

  it("has correct title, language, canonical, and social metadata", () => {
    assert.equal(doc.documentElement.lang, "zh-TW");
    assert.match(doc.title, /^我所理解的 GitFlow/);
    assert.equal(doc.querySelector("link[rel='canonical']").href, POST_URL);
    assert.equal(doc.querySelector("meta[property='og:url']").content, POST_URL);
    assert.ok(doc.querySelector("meta[name='description']").content.length > 0);
  });

  it("has inlined CSS and the fingerprinted client bundle", () => {
    assert.match(doc.querySelector("style").textContent, /header nav/);
    const bundle = doc.querySelector("script[src^='/js/min.js?hash=']");
    assert.ok(bundle, "Expected fingerprinted /js/min.js client bundle");
  });

  it("has an accessible share control and correct publication date", () => {
    const share = doc.querySelector("share-widget button");
    assert.ok(share);
    assert.ok(share.getAttribute("aria-label"));
    assert.equal(share.getAttribute("href"), POST_URL);

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
    const imagePost = new JSDOM(fs.readFileSync(IMAGE_POST_FILENAME, "utf8"))
      .window.document;
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
    const imageDoc = new JSDOM(
      fs.readFileSync(IMAGE_POST_FILENAME, "utf8")
    ).window.document;
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
  });
});
