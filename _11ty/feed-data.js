"use strict";

const {
  effectiveModifiedDate,
  postPublishedDate,
} = require("./publication-dates");

function dataFor(post) {
  return (post && post.data) || {};
}

/** Return the first public date of this language version. */
function feedPublishedDate(post) {
  return postPublishedDate(post);
}

/** Return the last explicit content-update date of this language version. */
function feedModifiedDate(post) {
  if (!post) throw new Error("feed post is required");
  const data = dataFor(post);
  return effectiveModifiedDate(post.date, data.publishedAt, data.updatedAt);
}

/** Newest version activity first, without mutating Eleventy's collection. */
function sortFeedPosts(posts, limit) {
  const sorted = [...(posts || [])].sort((left, right) => {
    const modifiedDifference =
      feedModifiedDate(right).getTime() - feedModifiedDate(left).getTime();
    if (modifiedDifference !== 0) return modifiedDifference;

    const publishedDifference =
      feedPublishedDate(right).getTime() - feedPublishedDate(left).getTime();
    if (publishedDifference !== 0) return publishedDifference;

    const leftKey = String(left.url || left.inputPath || "");
    const rightKey = String(right.url || right.inputPath || "");
    return leftKey.localeCompare(rightKey);
  });

  if (limit === undefined || limit === null) return sorted;
  if (!Number.isInteger(limit) || limit <= 0) {
    throw new Error("feed limit must be a positive integer");
  }
  return sorted.slice(0, limit);
}

/** Atom requires one feed-level updated value; use the newest item update. */
function feedUpdatedDate(posts) {
  const items = posts || [];
  if (items.length === 0) {
    throw new Error("cannot render a feed without published posts");
  }

  return items.slice(1).reduce((newest, post) => {
    const modified = feedModifiedDate(post);
    return modified > newest ? modified : newest;
  }, feedModifiedDate(items[0]));
}

module.exports = {
  feedPublishedDate,
  feedModifiedDate,
  sortFeedPosts,
  feedUpdatedDate,
};
