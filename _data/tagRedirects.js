"use strict";

const taxonomy = require("./tagTaxonomy.json");
const { buildLegacyTagRedirects } = require("../_11ty/tag-taxonomy");

module.exports = buildLegacyTagRedirects(taxonomy);
