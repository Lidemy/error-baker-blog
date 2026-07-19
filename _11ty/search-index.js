"use strict";

const fs = require("fs");
const path = require("path");
const isDraftFrontmatter = require("./draftFlag");
const { postPublishedDate } = require("./publication-dates");
const DEFAULT_TAG_TAXONOMY = require("../_data/tagTaxonomy.json");

const DEFAULT_LANG = "zh-TW";
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

function decodeEntities(value) {
  const named = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: '"',
  };
  return String(value || "")
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16))
    )
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&([a-z]+);/gi, (match, name) => named[name.toLowerCase()] || match);
}

function normalizeWhitespace(value) {
  return decodeEntities(value)
    .replace(/\u00a0/g, " ")
    .replace(/[\t\r\n ]+/g, " ")
    .trim();
}

// Keep this normalization aligned with src/search-core.mjs. Aliases are
// search-only data, so storing their normalized form once makes the shared
// catalogue smaller and avoids shipping case/punctuation duplicates.
function normalizeSearchValue(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}+#.]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

/**
 * Build one compact canonical → aliases catalogue for the whole index.
 *
 * Aliases are deliberately not copied onto every article: result rendering
 * continues to receive canonical `tags`, while the scorer can consult this
 * shared lookup. Only topics present in published indexed articles are sent.
 */
function buildTagAliases(articles, taxonomy = DEFAULT_TAG_TAXONOMY) {
  const usedTags = new Set(
    (articles || []).flatMap((article) =>
      Array.isArray(article.tags) ? article.tags : []
    )
  );
  const entries = [];
  for (const [canonical, definition] of Object.entries(
    (taxonomy && taxonomy.topics) || {}
  )) {
    if (!usedTags.has(canonical)) continue;
    const seen = new Set([normalizeSearchValue(canonical)]);
    const aliases = [];
    for (const alias of (definition && definition.aliases) || []) {
      const normalized = normalizeSearchValue(alias);
      if (!normalized || seen.has(normalized)) continue;
      seen.add(normalized);
      aliases.push(normalized);
    }
    if (aliases.length) entries.push([canonical, aliases.join(" ")]);
  }
  return Object.fromEntries(entries);
}

function cleanInlineMarkdown(value) {
  return normalizeWhitespace(
    String(value || "")
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<https?:\/\/[^>]+>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/`{1,3}([^`]+)`{1,3}/g, "$1")
      .replace(/[*_~]/g, "")
      .replace(/^\s*>+\s?/gm, "")
  );
}

function markdownToSearchText(markdown) {
  return normalizeWhitespace(
    String(markdown || "")
      .replace(FRONTMATTER_RE, "")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/\{[%{][\s\S]*?[%}]\}/g, " ")
      .replace(/^\s*```[^\n]*$/gm, " ")
      .replace(/^\s*~~~[^\n]*$/gm, " ")
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/<https?:\/\/[^>]+>/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/^\s{0,3}#{1,6}\s+/gm, "")
      .replace(/^\s*>+\s?/gm, "")
      .replace(/^\s*[-+*]\s+/gm, "")
      .replace(/^\s*\d+[.)]\s+/gm, "")
      .replace(/`{1,3}([^`]+)`{1,3}/g, "$1")
      .replace(/[*_~]/g, "")
  );
}

function markdownHeadings(markdown) {
  const headings = [];
  const body = String(markdown || "").replace(FRONTMATTER_RE, "");
  for (const match of body.matchAll(/^\s{0,3}#{2,6}\s+(.+?)\s*#*\s*$/gm)) {
    const heading = cleanInlineMarkdown(match[1]);
    if (heading && !headings.includes(heading)) headings.push(heading);
  }
  for (const match of body.matchAll(/<h[2-6][^>]*>([\s\S]*?)<\/h[2-6]>/gi)) {
    const heading = cleanInlineMarkdown(match[1]);
    if (heading && !headings.includes(heading)) headings.push(heading);
  }
  return headings;
}

function readSource(item) {
  if (typeof item.rawInput === "string") return item.rawInput;
  if (!item.inputPath) return "";
  return fs.readFileSync(item.inputPath, "utf8");
}

function translationKey(item, langs) {
  if (item.data && item.data.translationKey) return item.data.translationKey;
  const known = (langs || [DEFAULT_LANG]).join("|");
  const normalized = String(item.inputPath || "").replace(/\\/g, "/");
  const match = normalized.match(
    new RegExp(`posts/(.+?)(?:\\.(?:${known}))?\\.md$`)
  );
  return match ? match[1] : normalized;
}

function articleRecord(item, metadata, langs) {
  const data = item.data || {};
  const raw = readSource(item);
  const frontmatter = (raw.match(FRONTMATTER_RE) || [])[1] || "";
  if (
    data.draft === true ||
    data.draft === "true" ||
    isDraftFrontmatter(frontmatter) ||
    !item.url
  ) {
    return null;
  }

  const lang = data.lang || DEFAULT_LANG;
  const authorKey = data.author || "";
  const author = (metadata.authors && metadata.authors[authorKey]) || {};
  const body = markdownToSearchText(raw);
  const tags = [...new Set((data.tags || []).filter((tag) => tag !== "posts"))];
  let published;
  try {
    published = postPublishedDate(item).toISOString().slice(0, 10);
  } catch (error) {
    published = "";
  }
  const key = translationKey(item, langs);
  const description = normalizeWhitespace(data.description || body.slice(0, 240));

  return {
    id: `${key}|${lang}`,
    translationKey: key,
    title: normalizeWhitespace(data.title || path.basename(key)),
    url: item.url,
    lang,
    author: {
      key: authorKey,
      name: normalizeWhitespace(author.name || authorKey),
    },
    tags,
    published,
    year: published ? published.slice(0, 4) : "",
    slug: normalizeWhitespace(path.basename(key).replace(/[-_]+/g, " ")),
    description,
    headings: markdownHeadings(raw),
    body,
  };
}

function localizedBio(author, lang) {
  return normalizeWhitespace(author[`intro_${lang}`] || author.intro || "");
}

function authorRecords(articles, metadata, langs) {
  const grouped = new Map();
  for (const article of articles) {
    const key = article.author.key;
    if (!key) continue;
    if (!grouped.has(key)) {
      grouped.set(key, {
        versions: new Map(),
        works: new Set(),
        tagCounts: new Map(),
      });
    }
    const group = grouped.get(key);
    group.versions.set(
      article.lang,
      article.lang === DEFAULT_LANG
        ? `/posts/${key}/`
        : `/${article.lang}/posts/${key}/`
    );
    // Translations are editions of the same loaf, not extra contributions.
    // Count each logical work once when deriving a baker's top topics.
    if (!group.works.has(article.translationKey)) {
      group.works.add(article.translationKey);
      article.tags.forEach((tag) =>
        group.tagCounts.set(tag, (group.tagCounts.get(tag) || 0) + 1)
      );
    }
  }

  return [...grouped.entries()]
    .map(([key, group]) => {
      const author = (metadata.authors && metadata.authors[key]) || {};
      const bios = {};
      for (const lang of langs || [DEFAULT_LANG]) {
        const bio = localizedBio(author, lang);
        if (bio) bios[lang] = bio;
      }
      return {
        id: key,
        name: normalizeWhitespace(author.name || key),
        avatar: author.avatarUrl || "",
        bios,
        urls: Object.fromEntries(group.versions),
        postCount: group.works.size,
        topics: [...group.tagCounts]
          .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
          .slice(0, 6)
          .map(([tag]) => tag),
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name));
}

function buildSearchIndex(
  posts,
  metadata,
  langs,
  taxonomy = DEFAULT_TAG_TAXONOMY
) {
  const articles = (posts || [])
    .map((item) => articleRecord(item, metadata || {}, langs))
    .filter(Boolean)
    .sort((left, right) =>
      right.published.localeCompare(left.published) || left.url.localeCompare(right.url)
    );

  return {
    version: 1,
    languages: langs || [DEFAULT_LANG],
    tagAliases: buildTagAliases(articles, taxonomy),
    articles,
    authors: authorRecords(articles, metadata || {}, langs),
  };
}

function buildSearchIndexJson(posts, metadata, langs, taxonomy) {
  return JSON.stringify(buildSearchIndex(posts, metadata, langs, taxonomy))
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}

module.exports = {
  buildSearchIndex,
  buildSearchIndexJson,
  buildTagAliases,
  cleanInlineMarkdown,
  markdownHeadings,
  markdownToSearchText,
  normalizeSearchValue,
  normalizeWhitespace,
};
