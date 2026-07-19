"use strict";

const assert = require("assert").strict;

function article(overrides = {}) {
  return {
    id: "work|zh-TW",
    translationKey: "work",
    title: "JavaScript patterns",
    url: "/posts/baker/work/",
    lang: "zh-TW",
    author: { key: "baker", name: "Baker Chen" },
    tags: ["Frontend"],
    published: "2026-07-19",
    year: "2026",
    slug: "javascript patterns",
    description: "A practical guide",
    headings: ["Module design"],
    body: "Long-form article content",
    ...overrides,
  };
}

describe("client search ranking", () => {
  let searchIndex;
  let damerauLevenshtein;

  before(async () => {
    ({ searchIndex, damerauLevenshtein } = await import("../src/search-core.mjs"));
  });

  it("handles a Latin transposition as one fuzzy edit", () => {
    assert.equal(damerauLevenshtein("javascript", "javascrpit", 2), 1);
    const result = searchIndex(
      { articles: [article()], authors: [] },
      "javascrpit",
      { lang: "zh-TW" }
    );
    assert.equal(result.articles.length, 1);
    assert.equal(result.articles[0].matchedField, "title");
  });

  it("handles a missing CJK character through bigram similarity", () => {
    const result = searchIndex(
      {
        articles: [article({ title: "反應式程式設計" })],
        authors: [],
      },
      "反應程式設計",
      { lang: "zh-TW" }
    );
    assert.equal(result.articles.length, 1);
    assert.equal(result.articles[0].matchedField, "title");
  });

  it("prioritizes the current locale and deduplicates translated works", () => {
    const zh = article();
    const en = article({
      id: "work|en",
      lang: "en",
      url: "/en/posts/baker/work/",
    });
    const result = searchIndex(
      { articles: [en, zh], authors: [] },
      "JavaScript",
      { lang: "zh-TW" }
    );

    assert.equal(result.articles.length, 1);
    assert.equal(result.articles[0].item.lang, "zh-TW");
    assert.equal(result.otherArticles.length, 0);
    assert.equal(result.total, 1);
  });

  it("still returns another-language version when only it matches", () => {
    const zh = article({ title: "模組設計", slug: "module design" });
    const en = article({
      id: "work|en",
      lang: "en",
      title: "JavaScript patterns",
      url: "/en/posts/baker/work/",
    });
    const result = searchIndex(
      { articles: [zh, en], authors: [] },
      "JavaScript",
      { lang: "zh-TW" }
    );

    assert.equal(result.articles.length, 0);
    assert.equal(result.otherArticles.length, 1);
    assert.equal(result.otherArticles[0].item.lang, "en");
  });

  it("matches taxonomy aliases against canonical tags", () => {
    const go = article({
      title: "併發模式",
      slug: "concurrency patterns",
      tags: ["Go"],
      description: "",
      headings: [],
      body: "",
    });
    const js = article({
      id: "work-js|zh-TW",
      translationKey: "work-js",
      title: "模組設計",
      slug: "module design",
      tags: ["JavaScript"],
      description: "",
      headings: [],
      body: "",
    });
    const index = {
      articles: [go, js],
      authors: [],
      tagAliases: { Go: "golang", JavaScript: "js" },
    };

    const byGolang = searchIndex(index, "golang", { lang: "zh-TW" });
    assert.equal(byGolang.articles.length, 1);
    assert.equal(byGolang.articles[0].item.tags[0], "Go");
    assert.equal(byGolang.articles[0].matchedField, "tag");

    const byJs = searchIndex(index, "js", { lang: "zh-TW" });
    assert.equal(byJs.articles.length, 1);
    assert.equal(byJs.articles[0].item.tags[0], "JavaScript");
    assert.equal(byJs.articles[0].matchedField, "tag");
  });

  it("searches authors by name and topic", () => {
    const index = {
      articles: [],
      authors: [{
        id: "baker",
        name: "Baker Chen",
        bios: { "zh-TW": "烘焙技術文章" },
        topics: ["Frontend", "JavaScript"],
      }],
    };

    const byName = searchIndex(index, "Bkaer", { lang: "zh-TW" });
    const byTopic = searchIndex(index, "Frontend", { lang: "zh-TW" });
    assert.equal(byName.authors[0].item.id, "baker");
    assert.equal(byName.authors[0].matchedField, "author");
    assert.equal(byTopic.authors[0].item.id, "baker");
    assert.equal(byTopic.authors[0].matchedField, "tag");
  });
});
