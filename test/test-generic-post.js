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
    assert.equal(article.author.name, "Tian");
  });

  it("adds dimensions and responsive sources to local raster images", () => {
    const image = doc.querySelector("picture img[src^='/img/']");
    assert.ok(image, "Expected at least one optimized local image");
    assert.match(image.getAttribute("width"), /^\d+$/);
    assert.match(image.getAttribute("height"), /^\d+$/);
    assert.equal(image.getAttribute("loading"), "lazy");
    assert.equal(image.getAttribute("decoding"), "async");

    const sources = [...image.closest("picture").querySelectorAll("source")];
    assert.ok(sources.some((source) => source.type === "image/webp"));
    assert.ok(sources.some((source) => source.type === "image/jpeg"));
  });

  it("does not advertise draft translations", () => {
    assert.equal(doc.querySelectorAll("link[rel='alternate'][hreflang]").length, 0);
  });
});
