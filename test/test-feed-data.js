"use strict";

const assert = require("assert").strict;
const {
  feedPublishedDate,
  feedModifiedDate,
  sortFeedPosts,
  feedUpdatedDate,
} = require("../_11ty/feed-data");

function post(url, date, data = {}) {
  return { url, date: new Date(`${date}T00:00:00.000Z`), data };
}

describe("feed publication data", () => {
  it("uses version publication and update dates with source-compatible fallbacks", () => {
    const source = post("/source/", "2021-10-28");
    const translation = post("/en/translation/", "2021-10-28", {
      publishedAt: "2026-07-13",
      updatedAt: "2026-07-15",
    });

    assert.equal(feedPublishedDate(source).toISOString(), "2021-10-28T00:00:00.000Z");
    assert.equal(feedModifiedDate(source).toISOString(), "2021-10-28T00:00:00.000Z");
    assert.equal(
      feedPublishedDate(translation).toISOString(),
      "2026-07-13T00:00:00.000Z"
    );
    assert.equal(
      feedModifiedDate(translation).toISOString(),
      "2026-07-15T00:00:00.000Z"
    );
  });

  it("sorts newest version activity first and limits without mutating the collection", () => {
    const items = [
      post("/older/", "2024-01-01"),
      post("/same-b/", "2021-01-01", { publishedAt: "2026-07-13" }),
      post("/same-a/", "2020-01-01", { publishedAt: "2026-07-13" }),
      post("/recently-updated/", "2020-01-01", { updatedAt: "2026-07-14" }),
    ];

    assert.deepEqual(
      sortFeedPosts(items, 3).map((item) => item.url),
      ["/recently-updated/", "/same-a/", "/same-b/"]
    );
    assert.deepEqual(
      items.map((item) => item.url),
      ["/older/", "/same-b/", "/same-a/", "/recently-updated/"]
    );
    assert.throws(() => sortFeedPosts(items, 0), /positive integer/);
  });

  it("uses the newest explicit modification for the feed timestamp", () => {
    const items = [
      post("/new/", "2026-07-13"),
      post("/updated/", "2024-01-01", { updatedAt: "2026-07-15" }),
    ];
    assert.equal(feedUpdatedDate(items).toISOString(), "2026-07-15T00:00:00.000Z");
    assert.equal(
      feedUpdatedDate([post("/historical/", "1960-01-01")]).toISOString(),
      "1960-01-01T00:00:00.000Z"
    );
  });

  it("rejects empty feeds and invalid version dates", () => {
    assert.throws(() => feedUpdatedDate([]), /without published posts/);
    assert.throws(
      () => feedPublishedDate(post("/bad/", "2021-01-01", { publishedAt: "bad" })),
      /publishedAt must be a valid YYYY-MM-DD date/
    );
  });
});
