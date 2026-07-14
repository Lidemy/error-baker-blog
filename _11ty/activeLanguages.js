/**
 * Languages that have at least one visible translated post, derived by
 * scanning posts/ frontmatter directly (same predicate as the
 * `siteLangsWithPublishedPosts` collection in .eleventy.js).
 *
 * Why not read the collection? eleventyComputed.js needs this answer while
 * computing `permalink`, and Eleventy 0.12 defers any computed entry that
 * touches `data.collections` to a second resolution round — after paginated
 * pages have already fixed their URLs — which collapses every localized shell
 * page onto an empty output path (DuplicatePermalinkOutputError). A plain
 * data-file scan resolves in the first round.
 */
"use strict";

const fs = require("fs");
const path = require("path");

const LANGS = require("../_data/langs.json");
const DEFAULT_LANG = LANGS[0];

function walk(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

/**
 * @param {boolean} includeDrafts count draft translations as visible (dev)
 * @param {string} [postsDir] override for tests
 * @returns {string[]} active language codes in langs.json display order
 */
module.exports = function activeLanguages(
  includeDrafts,
  postsDir = path.join(__dirname, "..", "posts")
) {
  const active = new Set([DEFAULT_LANG]);
  for (const file of walk(postsDir)) {
    if (!file.endsWith(".md")) continue;
    const raw = fs.readFileSync(file, "utf8");
    const frontmatter = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) continue;
    const langMatch = frontmatter[1].match(/^lang:\s*["']?([A-Za-z-]+)["']?\s*$/m);
    if (!langMatch) continue;
    const lang = langMatch[1];
    if (lang === DEFAULT_LANG || !LANGS.includes(lang)) continue;
    // Match the draft scalar contract used by isDraft in .eleventy.js.
    const isDraft = /^draft:\s*(?:true|["']true["'])\s*$/m.test(frontmatter[1]);
    if (isDraft && !includeDrafts) continue;
    active.add(lang);
  }
  return LANGS.filter((lang) => active.has(lang));
};
