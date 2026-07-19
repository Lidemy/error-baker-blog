"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const { JSDOM, VirtualConsole } = require("jsdom");
const taxonomy = require("../_data/tagTaxonomy.json");
const { auditPosts } = require("../scripts/check-tags");
const {
  buildLegacyTagRedirects,
  buildTopicMap,
  compileTaxonomy,
  sameTags,
  topicUrlFor,
  validateTagRecord,
} = require("../_11ty/tag-taxonomy");

function record(tags, line = `tags: [${tags.join(", ")}]`) {
  return {
    path: "posts/test/example.md",
    tags,
    raw: `---\ntitle: Example\n${line}\nauthor: test\n---\nBody\n`,
  };
}

function syntheticPosts(count, authorCount) {
  return Array.from({ length: count }, (_, index) => ({
    url: `/posts/test/${index}/`,
    data: {
      author: `author-${index % authorCount}`,
      tags: ["React", "posts"],
    },
  }));
}

describe("tag taxonomy", () => {
  it("has a valid, complete registry with stable explicit slugs", () => {
    const registry = compileTaxonomy(taxonomy);
    assert.equal(registry.topics.length, 92);
    assert.equal(topicUrlFor("Frontend", taxonomy), "/tags/frontend/");
    assert.equal(topicUrlFor("Node.js", taxonomy), "/tags/node-js/");
    assert.equal(topicUrlFor("Git", taxonomy, "ja"), "/ja/tags/git/");
  });

  it("requires a canonical one-line array containing one to five unique tags", () => {
    assert.deepEqual(validateTagRecord(record(["React", "CSS"]), taxonomy), []);

    const blockStyle = validateTagRecord(
      record(["React", "CSS"], "tags:\n  - React\n  - CSS"),
      taxonomy
    );
    assert.ok(blockStyle.some((issue) => issue.code === "tags-format"));

    const tooMany = validateTagRecord(
      record(["React", "CSS", "HTML", "JavaScript", "Vue", "Frontend"]),
      taxonomy
    );
    assert.ok(tooMany.some((issue) => issue.code === "tags-count"));

    const duplicate = validateTagRecord(record(["React", "React"]), taxonomy);
    assert.ok(duplicate.some((issue) => issue.code === "tag-duplicate"));
  });

  it("reports aliases and retired values without silently rewriting content", () => {
    const alias = validateTagRecord(record(["Front-end"]), taxonomy);
    assert.equal(alias[0].code, "tag-noncanonical");
    assert.equal(alias[0].expected, "Frontend");

    const retired = validateTagRecord(record(["article"]), taxonomy);
    assert.equal(retired[0].code, "tag-retired");
    assert.equal(retired[0].expected, null);
  });

  it("defines only verified pre-canonicalization URL redirects", () => {
    const redirects = buildLegacyTagRedirects(taxonomy);
    assert.equal(redirects.length, 24);
    assert.deepEqual(
      redirects.find((redirect) => redirect.from === "/tags/front-end/"),
      { from: "/tags/front-end/", to: "/tags/frontend/", status: 301 }
    );
    assert.deepEqual(
      redirects.find((redirect) => redirect.from === "/tags/next.js/"),
      { from: "/tags/next.js/", to: "/tags/next-js/", status: 301 }
    );

    const sources = redirects.map((redirect) => redirect.from);
    assert.equal(new Set(sources).size, redirects.length);
    assert.equal(sources.includes("/tags/article/"), false);
    assert.equal(sources.includes("/tags/ast/"), false);
    assert.equal(sources.some((source) => /^\/(?:en|ja|zh-CN)\//.test(source)), false);

    const canonicalUrls = new Set(
      compileTaxonomy(taxonomy).topics.map((topic) => `/tags/${topic.slug}/`)
    );
    assert.equal(
      redirects.every(
        (redirect) => redirect.status === 301 && canonicalUrls.has(redirect.to)
      ),
      true
    );
  });

  it("uses both post and distinct-author thresholds for category candidates", () => {
    assert.equal(buildTopicMap(syntheticPosts(7, 3), taxonomy)[0].isCategoryCandidate, false);
    assert.equal(buildTopicMap(syntheticPosts(8, 2), taxonomy)[0].isCategoryCandidate, false);
    assert.equal(buildTopicMap(syntheticPosts(8, 3), taxonomy)[0].isCategoryCandidate, true);
  });

  it("compares source and translation tags exactly, including order", () => {
    assert.equal(sameTags(["Git", "Git Flow"], ["Git", "Git Flow"]), true);
    assert.equal(sameTags(["Git", "Git Flow"], ["Git Flow", "Git"]), false);
  });

  it("keeps the checked-in corpus canonical and fully registered", () => {
    const report = auditPosts("posts");
    assert.deepEqual(report.issues, []);
    assert.deepEqual(report.unusedTopics, []);
    assert.equal(report.sourcePosts.length, 82);
    assert.deepEqual(
      report.topicMap
        .filter((topic) => topic.isCategoryCandidate)
        .map((topic) => [topic.canonical, topic.postCount, topic.authorCount]),
      [
        ["Frontend", 23, 4],
        ["JavaScript", 20, 7],
        ["Backend", 17, 6],
      ]
    );
  });
});

describe("built topic pages", () => {
  function documentFor(file) {
    return new JSDOM(fs.readFileSync(file, "utf8"), {
      // jsdom 15 reports modern CSS syntax (for example color-mix()) as a
      // stylesheet parse warning even though the HTML DOM is valid.
      virtualConsole: new VirtualConsole(),
    }).window.document;
  }

  it("publishes permanent redirects for the verified legacy tag URLs", () => {
    const lines = fs
      .readFileSync("_site/_redirects", "utf8")
      .split(/\r?\n/)
      .filter(Boolean);
    assert.equal(lines.length, 24);
    assert.ok(lines.includes("/tags/front-end/ /tags/frontend/ 301!"));
    assert.ok(lines.includes("/tags/next.js/ /tags/next-js/ 301!"));
    assert.equal(lines.some((line) => line.startsWith("/tags/article/ ")), false);
    assert.equal(lines.some((line) => line.startsWith("/tags/ast/ ")), false);
    assert.equal(lines.some((line) => /^\/(?:en|ja|zh-CN)\//.test(line)), false);
  });

  it("renders the source topic map without expanding article lists", () => {
    const document = documentFor("_site/tags/index.html");
    assert.equal(document.querySelectorAll(".topic-card").length, 92);
    // Enthroned categories (taxonomy `category: true`) lead in their own
    // group; with all current candidates enthroned no candidate badge remains.
    assert.equal(document.querySelectorAll(".topic-card--category").length, 3);
    assert.equal(document.querySelectorAll(".topic-card--candidate").length, 0);
    assert.equal(document.querySelectorAll(".topic-map__section-heading").length, 2);
    // Every card carries an ember bake stage; the busiest topics reach 4.
    assert.equal(document.querySelectorAll("[class*='topic-card--bake-']").length, 92);
    assert.ok(document.querySelectorAll(".topic-card--bake-4").length >= 3);
    // Query-string filter: scope + input + per-card haystacks + empty state,
    // so /tags/?flavor=… stays a shareable, pre-filtered URL.
    const scope = document.querySelector("[data-filter-scope='flavor']");
    assert.ok(scope, "missing filter scope");
    assert.ok(scope.querySelector("[data-filter-input]"));
    assert.equal(scope.querySelectorAll("[data-filter]").length, 92);
    assert.ok(scope.querySelector("[data-filter-empty][hidden]"));
    const goCard = [...scope.querySelectorAll("[data-filter]")].find((card) =>
      card.getAttribute("data-filter").includes("golang")
    );
    assert.ok(goCard, "aliases must be part of the filter haystack");
    assert.equal(document.querySelector("#post-list"), null);
    assert.equal(document.querySelector(".archive-row"), null);
    assert.ok(document.querySelector('a[href="/tags/frontend/"]'));
  });

  it("uses canonical detail slugs and preserves source article lists", () => {
    const document = documentFor("_site/tags/frontend/index.html");
    assert.equal(document.querySelectorAll(".archive-row").length, 23);
    assert.ok(document.querySelector('a[href="/tags/"]'));
    assert.ok(fs.existsSync("_site/tags/node-js/index.html"));
  });

  it("localizes topic chrome while keeping labels canonical and posts locale-only", () => {
    for (const lang of ["en", "ja", "zh-CN"]) {
      const map = documentFor(`_site/${lang}/tags/index.html`);
      assert.equal(map.documentElement.lang, lang);
      assert.equal(map.querySelectorAll(".topic-card").length, 24);
      assert.ok(map.querySelector('a[href="/' + lang + '/tags/git/"]'));
      assert.ok(map.querySelector('nav a[href="/' + lang + '/tags/"]'));

      const detail = documentFor(`_site/${lang}/tags/git/index.html`);
      const articleLinks = [...detail.querySelectorAll(".archive-title")].map(
        (link) => link.getAttribute("href")
      );
      assert.deepEqual(articleLinks, [`/${lang}/posts/tian/git-flow/`]);
      assert.equal(detail.querySelector("h1").textContent.includes("Git"), true);
    }
  });
});
