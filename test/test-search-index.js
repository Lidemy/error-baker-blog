"use strict";

const assert = require("assert").strict;
const {
  buildSearchIndex,
  buildSearchIndexJson,
} = require("../_11ty/search-index.js");

const metadata = {
  authors: {
    baker: {
      name: "Baker Chen",
      avatarUrl: "/img/baker.png",
      intro: "烘焙前端技術麵包。",
      intro_en: "Bakes frontend loaves.",
    },
    hidden: { name: "Hidden Baker" },
  },
};
const languages = ["zh-TW", "en"];

function post({
  inputPath,
  url,
  lang = "zh-TW",
  draft,
  rawDraft,
  title,
  tags = ["Frontend"],
  date = "2026-07-19",
}) {
  const draftLine = rawDraft === undefined ? "" : `draft: ${rawDraft}\n`;
  return {
    inputPath,
    url,
    date: new Date(`${date}T00:00:00.000Z`),
    rawInput: `---\ntitle: ${title}\n${draftLine}---\n## Search heading\nBody with \`SearchToken\` and [a link](https://example.com).\n`,
    data: {
      author: inputPath.includes("hidden") ? "hidden" : "baker",
      draft,
      lang,
      tags: ["posts", ...tags],
      title,
    },
  };
}

describe("site search index", () => {
  const visibleZh = post({
    inputPath: "./posts/baker/frontend.md",
    url: "/posts/baker/frontend/",
    title: "前端麵包",
  });
  const visibleEn = post({
    inputPath: "./posts/baker/frontend.en.md",
    url: "/en/posts/baker/frontend/",
    lang: "en",
    title: "Frontend loaf",
  });

  it("hard-excludes parsed, raw-frontmatter, and non-emitted drafts", () => {
    const posts = [
      visibleZh,
      post({
        inputPath: "./posts/hidden/parsed.md",
        url: "/posts/hidden/parsed/",
        draft: true,
        title: "Parsed draft",
      }),
      post({
        inputPath: "./posts/hidden/string-draft.md",
        url: "/posts/hidden/string-draft/",
        draft: "true",
        title: "String draft",
      }),
      post({
        inputPath: "./posts/hidden/commented.md",
        url: "/posts/hidden/commented/",
        rawDraft: "true # awaiting review",
        title: "Raw draft",
      }),
      post({
        inputPath: "./posts/hidden/no-output.md",
        url: false,
        title: "No output",
      }),
    ];

    const index = buildSearchIndex(posts, metadata, languages);
    assert.deepEqual(index.articles.map((article) => article.title), ["前端麵包"]);
    assert.deepEqual(index.authors.map((author) => author.id), ["baker"]);
  });

  it("emits a versioned article/author schema with searchable Markdown fields", () => {
    const index = buildSearchIndex([visibleZh, visibleEn], metadata, languages);
    assert.equal(index.version, 1);
    assert.deepEqual(index.languages, languages);
    assert.equal(index.articles.length, 2);

    const article = index.articles.find((item) => item.lang === "zh-TW");
    const articleFields = [
      "author",
      "body",
      "description",
      "headings",
      "id",
      "lang",
      "published",
      "slug",
      "tags",
      "title",
      "translationKey",
      "url",
      "year",
    ];
    articleFields.forEach((field) => {
      assert.ok(Object.hasOwn(article, field), `Missing article field: ${field}`);
    });
    assert.equal(article.translationKey, "baker/frontend");
    assert.equal(article.id, "baker/frontend|zh-TW");
    assert.deepEqual(article.tags, ["Frontend"]);
    assert.deepEqual(article.headings, ["Search heading"]);
    assert.match(article.body, /SearchToken/);
    assert.doesNotMatch(article.body, /https:\/\/example\.com/);
    assert.equal(article.published, "2026-07-19");
    assert.equal(article.year, "2026");

    assert.equal(index.authors.length, 1);
    const author = index.authors[0];
    const authorFields = [
      "avatar",
      "bios",
      "id",
      "name",
      "postCount",
      "topics",
      "urls",
    ];
    authorFields.forEach((field) => {
      assert.ok(Object.hasOwn(author, field), `Missing author field: ${field}`);
    });
    assert.equal(author.postCount, 1, "Translations count as one logical loaf");
    assert.deepEqual(author.urls, {
      "zh-TW": "/posts/baker/",
      en: "/en/posts/baker/",
    });
  });

  it("serializes markup-significant text safely for a JSON response", () => {
    const hostile = post({
      inputPath: "./posts/baker/safe.md",
      url: "/posts/baker/safe/",
      title: "Safe <script> & search",
    });
    const json = buildSearchIndexJson([hostile], metadata, languages);
    assert.doesNotMatch(json, /[<>&]/);
    assert.equal(JSON.parse(json).articles[0].title, "Safe <script> & search");
  });
});
