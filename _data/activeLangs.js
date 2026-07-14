/**
 * Global data: languages whose localized shells (home/About/feeds/author
 * pages) may be emitted. Draft translations count only in dev, mirroring the
 * `siteLangsWithPublishedPosts` collection. Exposed as plain data (not a
 * collection) so eleventyComputed's permalink gate resolves in Eleventy
 * 0.12's first computed-data round — see _11ty/activeLanguages.js.
 */
"use strict";

const activeLanguages = require("../_11ty/activeLanguages.js");
const isdevelopment = require("./isdevelopment.js");

module.exports = () => activeLanguages(isdevelopment());
