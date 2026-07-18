"use strict";

/**
 * Contract tests for utterances comment-thread binding.
 *
 * History: the embed once used issue-term="title", so when the i18n work
 * added a "｜<site name>" suffix to post <title>s every legacy thread was
 * silently orphaned. The binding key is now the source post's path —
 * legacy threads pinned by issue number via _data/commentThreads.json, new
 * threads carrying the path as their issue term — and these tests fail the
 * build if any template/permalink/title change decouples it again.
 */

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { threadPath } = require("../_11ty/discussions");

const SITE = path.resolve(__dirname, "..", "_site");
const THREADS = require("../_data/commentThreads.json");

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

// Every emitted page that embeds utterances, as { pagePath, embeds } where
// embeds are the parsed client.js script tags.
function utterancesPages() {
  return walk(SITE)
    .filter((file) => file.endsWith("index.html"))
    .map((file) => {
      const html = fs.readFileSync(file, "utf8");
      if (!html.includes("utteranc.es/client.js")) return null;
      const doc = new JSDOM(html).window.document;
      const embeds = [...doc.querySelectorAll('script[src*="utteranc.es"]')];
      const pagePath =
        "/" + path.relative(SITE, path.dirname(file)).split(path.sep).join("/") + "/";
      return { pagePath, embeds };
    })
    .filter(Boolean);
}

function embedFor(pagePath) {
  const file = path.join(SITE, ...pagePath.split("/").filter(Boolean), "index.html");
  assert.ok(fs.existsSync(file), `Missing build output: ${file}`);
  const doc = new JSDOM(fs.readFileSync(file, "utf8")).window.document;
  const embeds = doc.querySelectorAll('script[src*="utteranc.es"]');
  assert.equal(embeds.length, 1, `${pagePath} must have exactly one utterances embed`);
  return embeds[0];
}

describe("commentThreads.json (legacy thread map)", () => {
  it("maps well-formed source-post paths to unique issue numbers", () => {
    const numbers = Object.values(THREADS);
    assert.ok(numbers.length > 0);
    for (const [key, number] of Object.entries(THREADS)) {
      assert.match(key, /^\/posts\/[^/]+\/.+\/$/, `bad path key: ${key}`);
      assert.ok(Number.isInteger(number) && number > 0, `bad issue number for ${key}`);
    }
    assert.equal(new Set(numbers).size, numbers.length, "duplicate issue numbers");
  });

  it("only maps paths whose page is actually emitted", () => {
    for (const key of Object.keys(THREADS)) {
      const file = path.join(SITE, ...key.split("/").filter(Boolean), "index.html");
      assert.ok(fs.existsSync(file), `${key} is mapped but not built`);
    }
  });
});

describe("utterances embed binding", function () {
  // These scans build a JSDOM for every emitted page that embeds utterances,
  // so they scale with the number of posts. The 2s mocha default is too tight
  // under CI load and flakes intermittently (e.g. same commit passing on push
  // but timing out on pull_request) — give the suite real headroom.
  this.timeout(15000);
  it("pins every legacy-mapped post to its issue number", () => {
    for (const [key, number] of Object.entries(THREADS)) {
      const embed = embedFor(key);
      assert.equal(
        embed.getAttribute("issue-number"),
        String(number),
        `${key} must bind issue #${number}`
      );
      assert.equal(embed.getAttribute("issue-term"), null);
    }
  });

  it("gives unmapped source posts their own path as the issue term", () => {
    const embed = embedFor("/posts/tian/git-flow/");
    assert.equal(embed.getAttribute("issue-term"), "/posts/tian/git-flow/");
    assert.equal(embed.getAttribute("issue-number"), null);
  });

  it("binds every language version of a post to the source thread", () => {
    const source = embedFor("/posts/tian/git-flow/");
    for (const lang of ["en", "ja", "zh-CN"]) {
      const translated = embedFor(`/${lang}/posts/tian/git-flow/`);
      assert.equal(
        translated.getAttribute("issue-term"),
        source.getAttribute("issue-term"),
        `${lang} version must share the source thread`
      );
    }
  });

  it("keys every embed by a source path, never by the page title", () => {
    const pages = utterancesPages();
    assert.ok(pages.length > 0, "no utterances embeds found in _site");
    for (const { pagePath, embeds } of pages) {
      assert.equal(embeds.length, 1, `${pagePath} must have exactly one embed`);
      const term = embeds[0].getAttribute("issue-term");
      const number = embeds[0].getAttribute("issue-number");
      assert.ok(term || number, `${pagePath} embed has no binding`);
      if (term) {
        // Source path shape: no language prefix, no site name, no title text.
        assert.match(
          term,
          /^\/posts\/[^/]+\/.+\/$/,
          `${pagePath} must key comments by the source post path, got: ${term}`
        );
      }
    }
  });
});

describe("discussions.threadPath", () => {
  it("resolves legacy threads by issue number", () => {
    const [key, number] = Object.entries(THREADS)[0];
    assert.equal(threadPath({ number, title: "任意舊標題" }), key);
  });

  it("resolves new threads by their path-shaped title", () => {
    assert.equal(
      threadPath({ number: 99999, title: "/posts/tian/git-flow/" }),
      "/posts/tian/git-flow/"
    );
  });

  it("ignores issues that are not comment threads", () => {
    assert.equal(threadPath({ number: 99999, title: "手機版進度條" }), null);
    assert.equal(threadPath({ number: 99999, title: "" }), null);
  });
});
