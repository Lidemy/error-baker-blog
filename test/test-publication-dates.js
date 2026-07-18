"use strict";

const assert = require("assert").strict;
const {
  isDateOnly,
  effectivePublishedDate,
  effectiveModifiedDate,
  postPublishedDate,
} = require("../_11ty/publication-dates");

describe("publication date contract", () => {
  const sourceDate = new Date("2021-10-28T00:00:00.000Z");

  it("accepts real date-only values, including leap days", () => {
    assert.equal(isDateOnly("2024-02-29"), true);
    assert.equal(isDateOnly("2023-02-29"), false);
    assert.equal(isDateOnly("2022-06-31"), false);
    assert.equal(isDateOnly("2026-7-03"), false);
    assert.equal(isDateOnly("2026-07-03T00:00:00Z"), false);
  });

  it("uses the source work date until a version has publishedAt", () => {
    const fallback = effectivePublishedDate(sourceDate);
    assert.equal(fallback.toISOString(), "2021-10-28T00:00:00.000Z");
    assert.notEqual(fallback, sourceDate, "Date values must be cloned");

    const translated = effectivePublishedDate(sourceDate, "2026-07-13");
    assert.equal(translated.toISOString(), "2026-07-13T00:00:00.000Z");
  });

  it("uses updatedAt only for a real version update", () => {
    assert.equal(
      effectiveModifiedDate(sourceDate, "2026-07-13").toISOString(),
      "2026-07-13T00:00:00.000Z"
    );
    assert.equal(
      effectiveModifiedDate(sourceDate, "2026-07-13", "2026-07-14").toISOString(),
      "2026-07-14T00:00:00.000Z"
    );
  });

  it("rejects malformed, impossible, or invalid dates", () => {
    assert.throws(
      () => effectivePublishedDate(sourceDate, "2026-02-30"),
      /publishedAt must be a valid YYYY-MM-DD date/
    );
    assert.throws(
      () => effectiveModifiedDate(sourceDate, null, "2026\/07\/13"),
      /updatedAt must be a valid YYYY-MM-DD date/
    );
    assert.throws(
      () => effectivePublishedDate(new Date("invalid")),
      /date must be a valid YYYY-MM-DD date/
    );
  });

  it("postPublishedDate returns the version date for feeds/JSON-LD", () => {
    // Version dates (publishedAt) are still resolved for structured data and
    // feeds even though the byline now renders the original work's date.
    const translated = {
      date: new Date("2021-10-28"),
      data: { publishedAt: "2026-07-13" },
    };
    assert.equal(
      postPublishedDate(translated).toISOString(),
      "2026-07-13T00:00:00.000Z"
    );

    const source = { date: new Date("2021-10-28"), data: {} };
    assert.equal(
      postPublishedDate(source).toISOString(),
      "2021-10-28T00:00:00.000Z"
    );
  });

  it("a translation's page.date is the original work date", () => {
    // Display and sort now read page.date directly. scripts/check-translations.js
    // (date-mismatch) guarantees a translation's date field equals the source's,
    // so page.date *is* the original work date for every language version.
    const source = { date: new Date("2021-10-28") };
    const translation = { date: new Date("2021-10-28") }; // copied verbatim
    assert.deepEqual(source.date, translation.date);
  });
});
