"use strict";

const assert = require("assert").strict;
const { buildAuthorStats } = require("../_11ty/authorStats");

const authors = {
  tian: { name: "Tian", avatarUrl: "/img/tian.png" },
  benben: { name: "Benben", avatarUrl: "/img/benben.png" },
};

function post(author, title, date) {
  return { data: { author, title }, date: new Date(date) };
}

const posts = [
  post("tian", "GitFlow as I Understand It", "2021-10-28"),
  post("tian", "Second Tian Post", "2022-01-10"),
  post("benben", "Benben on reduce", "2023-05-01"),
];

describe("buildAuthorStats reader-discussion signals", () => {
  it("omits comment fields when no comment data is supplied", () => {
    const stats = buildAuthorStats(posts, authors);
    stats.forEach((s) => {
      assert.strictEqual(s.comments, undefined);
      assert.strictEqual(s.mostDiscussed, undefined);
    });
  });

  it("sums comments per author and flags the single most-discussed", () => {
    const comments = {
      "GitFlow as I Understand It": 3,
      "Second Tian Post": 1,
      "Benben on reduce": 6,
    };
    const stats = buildAuthorStats(posts, authors, comments);
    const tian = stats.find((s) => s.key === "tian");
    const benben = stats.find((s) => s.key === "benben");

    assert.strictEqual(tian.comments, 4); // 3 + 1
    assert.strictEqual(benben.comments, 6);
    assert.strictEqual(benben.mostDiscussed, true);
    assert.strictEqual(tian.mostDiscussed, false);
  });

  it("does not disturb the post-count ranking", () => {
    // benben has the most comments but tian has more posts → tian still #1.
    const comments = { "Benben on reduce": 99 };
    const stats = buildAuthorStats(posts, authors, comments);
    assert.strictEqual(stats[0].key, "tian");
    assert.strictEqual(stats[0].rank, 1);
  });

  it("awards no most-discussed badge on a tie", () => {
    const comments = {
      "GitFlow as I Understand It": 2,
      "Benben on reduce": 2,
    };
    const stats = buildAuthorStats(posts, authors, comments);
    assert.ok(stats.every((s) => s.mostDiscussed === false));
  });

  it("awards no badge when every post has zero comments", () => {
    const stats = buildAuthorStats(posts, authors, {});
    stats.forEach((s) => {
      assert.strictEqual(s.comments, 0);
      assert.strictEqual(s.mostDiscussed, false);
    });
  });
});
