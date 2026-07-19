#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const taxonomy = require("../_data/tagTaxonomy.json");
const langs = require("../_data/langs.json");
const {
  DEFAULT_LANG,
  buildTopicMap,
  compileTaxonomy,
  extractFrontmatter,
  sameTags,
  validateTagRecord,
} = require("../_11ty/tag-taxonomy");

function walk(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function parsePost(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  const frontmatter = extractFrontmatter(raw);
  if (frontmatter === null) {
    return { path: filePath, raw, data: null, parseIssue: "missing YAML frontmatter" };
  }
  try {
    return {
      path: filePath.split(path.sep).join("/"),
      raw,
      data: yaml.safeLoad(frontmatter) || {},
      parseIssue: null,
    };
  } catch (error) {
    return {
      path: filePath,
      raw,
      data: null,
      parseIssue: `invalid YAML frontmatter: ${error.message}`,
    };
  }
}

function sourcePathFor(post) {
  const lang = post.data && post.data.lang;
  if (!lang || lang === DEFAULT_LANG) return post.path;
  if (!langs.includes(lang)) return null;
  const suffix = `.${lang}.md`;
  return post.path.endsWith(suffix)
    ? `${post.path.slice(0, -suffix.length)}.md`
    : null;
}

function auditPosts(postsDirectory = "posts") {
  const taxonomyRegistry = compileTaxonomy(taxonomy);
  const posts = walk(postsDirectory)
    .filter((filePath) => filePath.endsWith(".md"))
    .sort()
    .map(parsePost);
  const issues = [];

  for (const post of posts) {
    if (post.parseIssue) {
      issues.push({ code: "frontmatter", path: post.path, message: post.parseIssue });
      continue;
    }
    issues.push(
      ...validateTagRecord(
        { path: post.path, raw: post.raw, tags: post.data.tags },
        taxonomy
      )
    );
  }

  const byPath = new Map(posts.map((post) => [post.path, post]));
  for (const translation of posts.filter(
    (post) => post.data && post.data.lang && post.data.lang !== DEFAULT_LANG
  )) {
    const sourcePath = sourcePathFor(translation);
    const source = sourcePath && byPath.get(sourcePath);
    if (!source || !source.data) {
      issues.push({
        code: "translation-source",
        path: translation.path,
        message: "translated post has no matching source post",
      });
      continue;
    }
    if (!sameTags(source.data.tags, translation.data.tags)) {
      issues.push({
        code: "translation-tags",
        path: translation.path,
        message: `tags must exactly match ${source.path}: ${JSON.stringify(
          source.data.tags
        )}`,
      });
    }
  }

  const sourcePosts = posts.filter(
    (post) =>
      post.data &&
      (!post.data.lang || post.data.lang === DEFAULT_LANG) &&
      post.data.draft !== true &&
      post.data.draft !== "true"
  );
  const topicMap = buildTopicMap(
    sourcePosts.map((post) => ({
      inputPath: post.path,
      url: `/${post.path.replace(/\.md$/, "/")}`,
      data: post.data,
    })),
    taxonomy
  );
  const usedCanonical = new Set(topicMap.map((topic) => topic.canonical));
  const unusedTopics = taxonomyRegistry.topics
    .map((topic) => topic.canonical)
    .filter((canonical) => !usedCanonical.has(canonical));

  return { issues, posts, sourcePosts, topicMap, unusedTopics };
}

function formatIssue(issue) {
  return `  ${issue.path}\n    [${issue.code}] ${issue.message}`;
}

function main() {
  let report;
  try {
    report = auditPosts(path.join(process.cwd(), "posts"));
  } catch (error) {
    console.error(`\n✖ Tag taxonomy is invalid\n\n${error.message}\n`);
    process.exit(1);
  }

  if (report.issues.length > 0) {
    console.error(`\n✖ Tag checks failed (${report.issues.length})\n`);
    console.error(report.issues.map(formatIssue).join("\n"));
    console.error("");
    process.exit(1);
  }

  const assignments = report.sourcePosts.reduce(
    (sum, post) => sum + post.data.tags.length,
    0
  );
  console.log(
    `✓ Tag checks passed: ${report.sourcePosts.length} source posts, ` +
      `${report.topicMap.length} topics, ${assignments} assignments`
  );
  const candidates = report.topicMap.filter((topic) => topic.isCategoryCandidate);
  if (candidates.length > 0) {
    console.log("  Category candidates (advisory only):");
    for (const topic of candidates) {
      console.log(
        `  - ${topic.canonical}: ${topic.postCount} posts / ${topic.authorCount} authors`
      );
    }
  }
  if (report.unusedTopics.length > 0) {
    console.log(`  Unused registered topics: ${report.unusedTopics.join(", ")}`);
  }
}

if (require.main === module) main();

module.exports = {
  auditPosts,
  parsePost,
  sourcePathFor,
};
