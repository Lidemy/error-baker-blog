"use strict";

const assert = require("assert").strict;
const i18n = require("../_data/i18n.json");

const DEFAULT_LANG = "zh-TW";
const REQUIRED_SEARCH_KEYS = [
  "open",
  "title",
  "label",
  "placeholder",
  "close",
  "clear",
  "loading",
  "idleTitle",
  "idleBody",
  "minChars",
  "articlesHeading",
  "authorsHeading",
  "otherLanguagesHeading",
  "fallbackNotice",
  "noResultsTitle",
  "noResultsBody",
  "errorTitle",
  "errorBody",
  "retry",
  "resultCount",
  "authorPostCount",
  "matchTitle",
  "matchTag",
  "matchAuthor",
  "matchHeading",
  "matchDescription",
  "matchContent",
  "matchSlug",
  "matchYear",
];

function leafPaths(value, prefix = "") {
  return Object.entries(value).flatMap(([key, child]) => {
    const current = prefix ? `${prefix}.${key}` : key;
    if (child && typeof child === "object" && !Array.isArray(child)) {
      return leafPaths(child, current);
    }
    return [current];
  });
}

function valueAtPath(value, leafPath) {
  return leafPath.split(".").reduce((current, key) => current[key], value);
}

describe("localized bakery UI copy", () => {
  it("keeps the complete nested translation shape consistent in every locale", () => {
    const expected = leafPaths(i18n[DEFAULT_LANG]).sort();
    for (const [lang, strings] of Object.entries(i18n)) {
      assert.deepEqual(
        leafPaths(strings).sort(),
        expected,
        `${lang} must expose the same nested i18n leaves as ${DEFAULT_LANG}`
      );
      for (const leafPath of expected) {
        const value = valueAtPath(strings, leafPath);
        assert.equal(typeof value, "string", `${lang}.${leafPath} must be a string`);
        assert.ok(value.trim(), `${lang}.${leafPath} must not be empty`);
      }
    }
  });

  it("defines every search state and match explanation in every locale", () => {
    for (const [lang, strings] of Object.entries(i18n)) {
      assert.ok(strings.search && typeof strings.search === "object");
      for (const key of REQUIRED_SEARCH_KEYS) {
        assert.equal(typeof strings.search[key], "string", `${lang}.search.${key}`);
        assert.ok(strings.search[key].trim(), `${lang}.search.${key} must not be empty`);
      }
      assert.match(strings.search.noResultsTitle, /\{query\}/, `${lang} query token`);
      assert.match(strings.search.resultCount, /\{count\}/, `${lang} result token`);
      assert.match(strings.search.authorPostCount, /\{count\}/, `${lang} author count token`);
    }
  });

  it("uses the bakery role contract in the default-language reader journey", () => {
    const strings = i18n[DEFAULT_LANG];
    assert.match(strings.publishedBy, /烘焙師/);
    assert.match(strings.shareArticle, /麵包/);
    assert.match(strings.js.readDone, /吃完/);
    assert.match(strings.search.title, /麵包/);
    assert.match(strings.search.authorsHeading, /烘焙師/);
  });
});
