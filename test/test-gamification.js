"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { buildAuthorStats } = require("../_11ty/authorStats.js");

const ABOUT_FILENAME = path.resolve(__dirname, "..", "_site", "about", "index.html");
const EN_ABOUT_FILENAME = path.resolve(__dirname, "..", "_site", "en", "about", "index.html");
const AUTHOR_FILENAME = path.resolve(__dirname, "..", "_site", "posts", "tian", "index.html");
const HOME_FILENAME = path.resolve(__dirname, "..", "_site", "index.html");
const POST_FILENAME = path.resolve(
  __dirname,
  "..",
  "_site",
  "posts",
  "tian",
  "git-flow",
  "index.html"
);

const TIERS = ["iron", "bronze", "silver", "gold", "diamond"];

function post(author, isoDate, url) {
  return { url, data: { author }, date: new Date(`${isoDate}T00:00:00Z`) };
}

function repeat(author, isoDate, count) {
  return Array.from({ length: count }, () => post(author, isoDate));
}

describe("author gamification stats", () => {
  const authors = Object.fromEntries(
    ["a", "b", "c", "d", "e"].map((key) => [key, { name: key.toUpperCase(), avatarUrl: "" }])
  );

  it("maps post counts onto the documented level thresholds", () => {
    const posts = [
      ...repeat("a", "2024-01-01", 1),
      ...repeat("b", "2024-01-01", 3),
      ...repeat("c", "2024-01-01", 6),
      ...repeat("d", "2024-01-01", 10),
      ...repeat("e", "2024-01-01", 15),
    ];
    const byKey = Object.fromEntries(
      buildAuthorStats(posts, authors).map((s) => [s.key, s])
    );
    assert.deepEqual(
      ["a", "b", "c", "d", "e"].map((k) => [byKey[k].level, byKey[k].tier]),
      [1, 2, 3, 4, 5].map((level) => [level, TIERS[level - 1]])
    );
  });

  it("ranks by post count, breaks ties by most recent activity", () => {
    const posts = [
      ...repeat("a", "2020-05-01", 2),
      post("b", "2020-01-01"),
      post("b", "2021-06-01"),
      ...repeat("c", "2019-01-01", 4),
    ];
    const stats = buildAuthorStats(posts, authors);
    assert.deepEqual(stats.map((s) => s.key), ["c", "b", "a"]);
    assert.deepEqual(stats.map((s) => s.rank), [1, 2, 3]);
    assert.deepEqual(stats.map((s) => s.medal), ["🥇", "🥈", "🥉"]);
    assert.equal(stats[0].pct, 100);
    assert.equal(stats[1].pct, 50);
    assert.equal(stats[1].latestDate, "2021-06-01");
  });

  it("leaves authors without posts off the leaderboard and unmedaled ranks empty", () => {
    const posts = [
      ...repeat("a", "2024-01-01", 4),
      ...repeat("b", "2024-02-01", 3),
      ...repeat("c", "2024-03-01", 2),
      post("d", "2024-04-01"),
    ];
    const stats = buildAuthorStats(posts, authors);
    assert.equal(stats.length, 4);
    assert.ok(!stats.some((s) => s.key === "e"));
    assert.equal(stats[3].medal, "");
  });

  it("buckets the contribution calendar by quarter, newest first, levels 0-4", () => {
    const posts = [
      post("a", "2023-01-10"),
      post("a", "2023-02-20"),
      post("a", "2023-08-05"),
    ];
    const { cells } = buildAuthorStats(posts, authors)[0].calendar;
    assert.deepEqual(
      cells.map((c) => [c.year, c.quarter, c.count, c.level]),
      [
        [2023, 3, 1, 1],
        [2023, 2, 0, 0],
        [2023, 1, 2, 2],
      ]
    );
    const heavy = buildAuthorStats(repeat("a", "2023-01-10", 5), authors)[0];
    assert.equal(heavy.calendar.cells[0].level, 4);
  });

  it("sums reader comments per author and flags a single most-discussed leader", () => {
    const posts = [
      post("a", "2024-01-01", "/posts/a/t1/"),
      post("a", "2024-02-01", "/posts/a/t2/"),
      post("b", "2024-03-01", "/posts/b/t3/"),
    ];
    const stats = buildAuthorStats(posts, authors, { "/posts/a/t1/": 4, "/posts/a/t2/": 3, "/posts/b/t3/": 5 });
    const byKey = Object.fromEntries(stats.map((s) => [s.key, s]));
    assert.equal(byKey.a.comments, 7);
    assert.equal(byKey.b.comments, 5);
    assert.equal(byKey.a.mostDiscussed, true);
    assert.equal(byKey.b.mostDiscussed, false);
  });

  it("awards no most-discussed badge on a tie or without comment data", () => {
    const posts = [post("a", "2024-01-01", "/posts/a/t1/"), post("b", "2024-02-01", "/posts/b/t2/")];
    const tied = buildAuthorStats(posts, authors, { "/posts/a/t1/": 5, "/posts/b/t2/": 5 });
    assert.ok(tied.every((s) => s.mostDiscussed === false));
    const withoutData = buildAuthorStats(posts, authors);
    assert.ok(withoutData.every((s) => !("comments" in s) && !("mostDiscussed" in s)));
  });
});

describe("gamification build output", () => {
  let about;

  before(() => {
    assert.ok(fs.existsSync(ABOUT_FILENAME), `Missing build output: ${ABOUT_FILENAME}`);
    about = new JSDOM(fs.readFileSync(ABOUT_FILENAME, "utf8")).window.document;
  });

  it("renders the leaderboard with rank, level badge, and proportional bars", () => {
    const rows = [...about.querySelectorAll("ul.gx-leaderboard li.gx-row")];
    assert.ok(rows.length > 0, "Expected at least one leaderboard row");
    for (const row of rows) {
      assert.ok(row.querySelector(".gx-rank"));
      const badge = row.querySelector(".gx-level");
      assert.ok(badge);
      assert.match(badge.className, /gx-tier-(iron|bronze|silver|gold|diamond)/);
      assert.match(badge.textContent, /^Lv\.[1-5]$/);
      assert.match(row.querySelector(".gx-bar__fill").getAttribute("style"), /width:\s*\d+%/);
    }
    assert.match(
      rows[0].querySelector(".gx-bar__fill").getAttribute("style"),
      /width:\s*100%/
    );
  });

  it("renders the localized leaderboard on translated about pages", () => {
    const enAbout = new JSDOM(fs.readFileSync(EN_ABOUT_FILENAME, "utf8")).window.document;
    assert.ok(enAbout.querySelector("ul.gx-leaderboard li.gx-row"));
  });

  it("renders the quarterly contribution calendar on author pages", () => {
    const author = new JSDOM(fs.readFileSync(AUTHOR_FILENAME, "utf8")).window.document;
    const cells = [...author.querySelectorAll(".gx-cal .gx-cell[data-level]")];
    assert.ok(cells.length > 0, "Expected contribution calendar cells");
    for (const cell of cells) {
      assert.match(cell.getAttribute("data-level"), /^[0-4]$/);
    }
  });

  it("loads gamification.css only on about and author-listing pages", () => {
    const selector = "link[href^='/css/gamification.css']";
    const authorDoc = new JSDOM(fs.readFileSync(AUTHOR_FILENAME, "utf8")).window.document;
    assert.ok(about.querySelector(selector));
    assert.ok(authorDoc.querySelector(selector));
    for (const file of [HOME_FILENAME, POST_FILENAME]) {
      const doc = new JSDOM(fs.readFileSync(file, "utf8")).window.document;
      assert.equal(doc.querySelector(selector), null, `Unexpected gamification.css in ${file}`);
    }
  });
});
