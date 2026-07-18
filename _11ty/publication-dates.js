"use strict";

const DATE_ONLY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Return true only for a real calendar date written as YYYY-MM-DD. */
function isDateOnly(value) {
  if (typeof value !== "string") return false;
  const match = value.match(DATE_ONLY_RE);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(0);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCFullYear(year, month - 1, day);

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function dateValue(value, field) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return new Date(value.getTime());
  }
  if (isDateOnly(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(0);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCFullYear(year, month - 1, day);
    return date;
  }
  throw new Error(`${field} must be a valid YYYY-MM-DD date`);
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

/**
 * Version publication date: translations may override the source work's date
 * with `publishedAt`; legacy/source posts keep Eleventy's parsed `page.date`.
 */
function effectivePublishedDate(pageDate, publishedAt) {
  return hasValue(publishedAt)
    ? dateValue(publishedAt, "publishedAt")
    : dateValue(pageDate, "date");
}

/** Content updates are explicit and otherwise fall back to publication. */
function effectiveModifiedDate(pageDate, publishedAt, updatedAt) {
  return hasValue(updatedAt)
    ? dateValue(updatedAt, "updatedAt")
    : effectivePublishedDate(pageDate, publishedAt);
}

/** Resolve an Eleventy collection item's version publication date. */
function postPublishedDate(post) {
  if (!post) throw new Error("post is required");
  const data = post.data || {};
  return effectivePublishedDate(post.date, data.publishedAt);
}

module.exports = {
  isDateOnly,
  effectivePublishedDate,
  effectiveModifiedDate,
  postPublishedDate,
};
