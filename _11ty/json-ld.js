/**
 * Copyright (c) 2020 Google Inc
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

const { JSDOM } = require("jsdom");
const { isDateOnly } = require("./publication-dates");

function isHttpUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function articleIssues(article) {
  const issues = [];
  const images = Array.isArray(article.image) ? article.image : [];

  if (!article.headline) issues.push("headline is required");
  if (!isHttpUrl(article.url)) issues.push("url must be absolute HTTP(S)");
  if (!isHttpUrl(article.mainEntityOfPage)) {
    issues.push("mainEntityOfPage must be absolute HTTP(S)");
  }
  if (images.length !== 1 || !isHttpUrl(images[0])) {
    issues.push("image must contain exactly one absolute HTTP(S) URL");
  }
  if (!article.author || !article.author.name || !isHttpUrl(article.author.url)) {
    issues.push("author name and absolute URL are required");
  }
  if (
    !article.publisher ||
    !article.publisher.name ||
    !isHttpUrl(article.publisher.url)
  ) {
    issues.push("publisher name and absolute URL are required");
  }
  if (
    !article.publisher ||
    !article.publisher.logo ||
    !isHttpUrl(article.publisher.logo.url)
  ) {
    issues.push("publisher logo must have an absolute HTTP(S) URL");
  }
  if (!isDateOnly(article.datePublished)) {
    issues.push("datePublished must be a valid YYYY-MM-DD date");
  }
  if (!isDateOnly(article.dateModified)) {
    issues.push("dateModified must be a valid YYYY-MM-DD date");
  }
  if (
    isDateOnly(article.datePublished) &&
    isDateOnly(article.dateModified) &&
    article.dateModified < article.datePublished
  ) {
    issues.push("dateModified cannot be before datePublished");
  }
  if (Object.prototype.hasOwnProperty.call(article, "genre")) {
    issues.push("placeholder genre must not be emitted");
  }

  return issues;
}

/** Validate every JSON-LD block without mutating the generated HTML. */
const validateJsonLd = (rawContent, outputPath) => {
  if (!outputPath || !outputPath.endsWith(".html")) return rawContent;
  if (!rawContent.includes("application/ld+json")) return rawContent;

  const dom = new JSDOM(rawContent);
  const blocks = [
    ...dom.window.document.querySelectorAll("script[type='application/ld+json']"),
  ];

  blocks.forEach((block, index) => {
    let value;
    try {
      value = JSON.parse(block.textContent);
    } catch (error) {
      throw new Error(
        `Invalid JSON-LD in ${outputPath} (block ${index + 1}): ${error.message}`
      );
    }

    const types = Array.isArray(value && value["@type"])
      ? value["@type"]
      : [value && value["@type"]];
    if (types.includes("Article")) {
      const issues = articleIssues(value);
      if (issues.length > 0) {
        throw new Error(
          `Invalid Article JSON-LD in ${outputPath} (block ${index + 1}): ${issues.join(
            "; "
          )}`
        );
      }
    }
  });

  return rawContent;
};

module.exports = {
  initArguments: {},
  validateJsonLd,
  articleIssues,
  configFunction: async (eleventyConfig, pluginOptions = {}) => {
    eleventyConfig.addTransform("jsonLd", validateJsonLd);
  },
};
