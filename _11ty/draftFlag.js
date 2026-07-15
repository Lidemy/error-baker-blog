/**
 * Single draft predicate for raw frontmatter text.
 *
 * The build (.eleventy.js collections, activeLanguages.js) and the
 * translation guard must agree with Eleventy's YAML parser on what counts
 * as a draft, or a value like `draft: true # TODO` gets a page gate of
 * "draft" but a collection gate of "published" and leaks broken URLs into
 * sitemap/feed/hreflang. Delegate to the guard's frontmatterBoolean so
 * there is exactly one implementation to keep aligned with YAML.
 */
"use strict";

const { frontmatterBoolean } = require("../scripts/check-translations.js");

module.exports = function isDraftFrontmatter(frontmatterText) {
  return frontmatterBoolean(frontmatterText || "", "draft") === true;
};
