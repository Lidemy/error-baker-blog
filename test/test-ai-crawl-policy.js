"use strict";

const assert = require("assert").strict;
const { buildAiCrawlRules } = require("../_11ty/aiCrawlPolicy");

const SITE_LANGS = ["zh-TW", "en", "ja", "zh-CN"];
const DEFAULT_LANG = "zh-TW";

function post(author, url, aiCrawl) {
  const data = { author };
  if (typeof aiCrawl === "boolean") data.aiCrawl = aiCrawl;
  return { url, data };
}

describe("AI crawler opt-in policy", () => {
  it("defaults every author to disallowed, across every non-default locale", () => {
    const authors = { xiang: {}, tian: { aiCrawl: true } };
    const rules = buildAiCrawlRules([], authors, SITE_LANGS, DEFAULT_LANG);

    assert.ok(rules.disallowPaths.includes("/posts/xiang/"));
    assert.ok(rules.disallowPaths.includes("/en/posts/xiang/"));
    assert.ok(rules.disallowPaths.includes("/ja/posts/xiang/"));
    assert.ok(rules.disallowPaths.includes("/zh-CN/posts/xiang/"));
    assert.ok(!rules.disallowPaths.includes("/posts/tian/"));
  });

  it("never emits a default-language-suffixed path", () => {
    const authors = { xiang: {} };
    const rules = buildAiCrawlRules([], authors, SITE_LANGS, DEFAULT_LANG);

    assert.ok(!rules.disallowPaths.includes("/zh-TW/posts/xiang/"));
  });

  it("lets one article opt in under an author who defaults to deny", () => {
    const authors = { xiang: {} };
    const posts = [post("xiang", "/posts/xiang/console-log/", true)];
    const rules = buildAiCrawlRules(posts, authors, SITE_LANGS, DEFAULT_LANG);

    assert.deepEqual(rules.allowOverridePaths, ["/posts/xiang/console-log/"]);
    assert.equal(rules.disallowOverridePaths.length, 0);
  });

  it("lets one article opt out under an author who defaults to allow", () => {
    const authors = { tian: { aiCrawl: true } };
    const posts = [post("tian", "/posts/tian/git-flow/", false)];
    const rules = buildAiCrawlRules(posts, authors, SITE_LANGS, DEFAULT_LANG);

    assert.deepEqual(rules.disallowOverridePaths, ["/posts/tian/git-flow/"]);
    assert.equal(rules.allowOverridePaths.length, 0);
  });

  it("ignores posts without an explicit override either way", () => {
    const authors = { tian: { aiCrawl: true }, xiang: {} };
    const posts = [
      post("tian", "/posts/tian/git-flow/"),
      post("xiang", "/posts/xiang/console-log/"),
    ];
    const rules = buildAiCrawlRules(posts, authors, SITE_LANGS, DEFAULT_LANG);

    assert.equal(rules.allowOverridePaths.length, 0);
    assert.equal(rules.disallowOverridePaths.length, 0);
  });

  it("handles an empty author map without throwing", () => {
    const rules = buildAiCrawlRules([], {}, SITE_LANGS, DEFAULT_LANG);
    assert.deepEqual(rules, {
      disallowPaths: [],
      allowOverridePaths: [],
      disallowOverridePaths: [],
    });
  });
});
