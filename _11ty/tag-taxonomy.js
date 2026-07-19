"use strict";

const DEFAULT_LANG = "zh-TW";
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LEGACY_SLUG_RE = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/;

function normalizeLookupValue(value) {
  return String(value || "")
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("en-US");
}

function compileTaxonomy(taxonomy) {
  const errors = [];
  const topics = [];
  const byCanonical = new Map();
  const byLookup = new Map();
  const bySlug = new Map();
  const retired = new Map();
  const policy = (taxonomy && taxonomy.policy) || {};

  if (!taxonomy || taxonomy.schemaVersion !== 1) {
    errors.push("schemaVersion must be 1");
  }
  if (!taxonomy || !taxonomy.topics || Array.isArray(taxonomy.topics)) {
    errors.push("topics must be an object keyed by canonical tag label");
  }

  for (const field of [
    "minTagsPerPost",
    "maxTagsPerPost",
    "categoryMinPosts",
    "categoryMinAuthors",
  ]) {
    if (!Number.isInteger(policy[field]) || policy[field] < 1) {
      errors.push(`policy.${field} must be a positive integer`);
    }
  }
  if (
    Number.isInteger(policy.minTagsPerPost) &&
    Number.isInteger(policy.maxTagsPerPost) &&
    policy.minTagsPerPost > policy.maxTagsPerPost
  ) {
    errors.push("policy.minTagsPerPost cannot exceed maxTagsPerPost");
  }

  const topicEntries = Object.entries((taxonomy && taxonomy.topics) || {});
  for (const [canonical, definition] of topicEntries) {
    if (!canonical || canonical.trim() !== canonical) {
      errors.push(`invalid canonical tag label ${JSON.stringify(canonical)}`);
      continue;
    }
    const slug = definition && definition.slug;
    if (!SLUG_RE.test(slug || "")) {
      errors.push(`${canonical}: slug must match ${SLUG_RE}`);
      continue;
    }
    if (byCanonical.has(canonical)) {
      errors.push(`duplicate canonical tag ${canonical}`);
      continue;
    }
    if (bySlug.has(slug)) {
      errors.push(`${canonical}: slug ${slug} is already used by ${bySlug.get(slug)}`);
      continue;
    }
    const aliases = definition.aliases || [];
    if (!Array.isArray(aliases) || aliases.some((alias) => typeof alias !== "string")) {
      errors.push(`${canonical}: aliases must be an array of strings`);
      continue;
    }
    const legacySlugs = definition.legacySlugs || [];
    if (
      !Array.isArray(legacySlugs) ||
      legacySlugs.some((legacySlug) => typeof legacySlug !== "string")
    ) {
      errors.push(`${canonical}: legacySlugs must be an array of strings`);
      continue;
    }
    if (
      definition.category !== undefined &&
      definition.category !== true
    ) {
      errors.push(
        `${canonical}: category must be true when present (enthronement is explicit)`
      );
      continue;
    }
    const topic = {
      id: slug,
      canonical,
      slug,
      // Enthroned categories are a human editorial decision recorded in the
      // taxonomy; thresholds only nominate candidates (see check-tags).
      category: definition.category === true,
      aliases: aliases.slice(),
      legacySlugs: legacySlugs.slice(),
    };
    topics.push(topic);
    byCanonical.set(canonical, topic);
    bySlug.set(slug, canonical);
  }

  const byLegacySlug = new Map();
  for (const topic of topics) {
    for (const legacySlug of topic.legacySlugs) {
      if (!LEGACY_SLUG_RE.test(legacySlug)) {
        errors.push(
          `${topic.canonical}: legacy slug ${JSON.stringify(
            legacySlug
          )} must match ${LEGACY_SLUG_RE}`
        );
        continue;
      }
      if (legacySlug === topic.slug) {
        errors.push(
          `${topic.canonical}: legacy slug ${legacySlug} is already its canonical slug`
        );
        continue;
      }
      if (bySlug.has(legacySlug)) {
        errors.push(
          `${topic.canonical}: legacy slug ${legacySlug} conflicts with the canonical slug for ${bySlug.get(
            legacySlug
          )}`
        );
        continue;
      }
      if (byLegacySlug.has(legacySlug)) {
        errors.push(
          `${topic.canonical}: legacy slug ${legacySlug} is already used by ${byLegacySlug.get(
            legacySlug
          )}`
        );
        continue;
      }
      byLegacySlug.set(legacySlug, topic.canonical);
    }
  }

  const registerLookup = (value, canonical, source) => {
    const key = normalizeLookupValue(value);
    if (!key) {
      errors.push(`${canonical}: ${source} cannot be empty`);
      return;
    }
    const previous = byLookup.get(key);
    if (previous && previous !== canonical) {
      errors.push(
        `${canonical}: ${source} ${JSON.stringify(value)} conflicts with ${previous}`
      );
      return;
    }
    byLookup.set(key, canonical);
  };

  for (const topic of topics) {
    registerLookup(topic.canonical, topic.canonical, "canonical label");
  }
  for (const topic of topics) {
    for (const alias of topic.aliases) {
      registerLookup(alias, topic.canonical, "alias");
    }
  }

  for (const [value, definition] of Object.entries(
    (taxonomy && taxonomy.retired) || {}
  )) {
    const key = normalizeLookupValue(value);
    if (!key) {
      errors.push("retired tag value cannot be empty");
      continue;
    }
    if (byLookup.has(key)) {
      errors.push(`retired tag ${value} conflicts with active tag ${byLookup.get(key)}`);
      continue;
    }
    retired.set(key, {
      value,
      replacement:
        definition && typeof definition.replacement === "string"
          ? definition.replacement
          : null,
      reason: (definition && definition.reason) || "This tag is retired.",
    });
  }

  // Umbrella topics are broad categories a post may legitimately carry, but a
  // post tagged with ONLY umbrellas still awaits a human-assigned leaf topic.
  // Declaring them here keeps the leaf-topic backlog a derived report instead
  // of a hand-maintained list.
  const umbrellaTopics = policy.umbrellaTopics || [];
  if (!Array.isArray(umbrellaTopics)) {
    errors.push("policy.umbrellaTopics must be an array of canonical labels");
  } else {
    for (const canonical of umbrellaTopics) {
      if (!byCanonical.has(canonical)) {
        errors.push(
          `policy.umbrellaTopics: ${JSON.stringify(canonical)} is not a registered topic`
        );
      }
    }
  }

  if (errors.length > 0) {
    const error = new Error(`Invalid tag taxonomy:\n- ${errors.join("\n- ")}`);
    error.issues = errors;
    throw error;
  }

  return {
    policy,
    topics,
    byCanonical,
    byLookup,
    byLegacySlug,
    retired,
    umbrellaTopics,
    categories: topics
      .filter((topic) => topic.category)
      .map((topic) => topic.canonical),
  };
}

function buildLegacyTagRedirects(taxonomy) {
  const registry = compileTaxonomy(taxonomy);
  return registry.topics
    .flatMap((topic) =>
      topic.legacySlugs.map((legacySlug) => ({
        from: `/tags/${legacySlug}/`,
        to: `/tags/${topic.slug}/`,
        status: 301,
      }))
    )
    .sort((left, right) => left.from.localeCompare(right.from, "en"));
}

function extractFrontmatter(raw) {
  const match = String(raw || "").match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : null;
}

function singleLineTagsIssue(raw) {
  const frontmatter = extractFrontmatter(raw);
  if (frontmatter === null) {
    return "missing YAML frontmatter";
  }
  const tagLines = frontmatter
    .split(/\r?\n/)
    .filter((line) => /^tags\s*:/.test(line));
  if (tagLines.length !== 1 || !/^tags\s*:\s*\[[^\]]*\]\s*$/.test(tagLines[0])) {
    return "tags must use one top-level flow-array line, for example tags: [React, CSS]";
  }
  return null;
}

function validateTagRecord(record, taxonomy) {
  const registry = compileTaxonomy(taxonomy);
  const issues = [];
  const path = record.path || record.inputPath || "<unknown>";
  const lineIssue = singleLineTagsIssue(record.raw);
  if (lineIssue) {
    issues.push({ code: "tags-format", path, message: lineIssue });
  }

  const tags = record.tags;
  if (!Array.isArray(tags)) {
    issues.push({ code: "tags-type", path, message: "tags must parse as an array" });
    return issues;
  }
  if (
    tags.length < registry.policy.minTagsPerPost ||
    tags.length > registry.policy.maxTagsPerPost
  ) {
    issues.push({
      code: "tags-count",
      path,
      message: `tags must contain ${registry.policy.minTagsPerPost}–${registry.policy.maxTagsPerPost} values; found ${tags.length}`,
    });
  }

  const seen = new Set();
  for (const tag of tags) {
    if (typeof tag !== "string" || !tag.trim()) {
      issues.push({
        code: "tag-type",
        path,
        message: `tag ${JSON.stringify(tag)} must be a non-empty string`,
      });
      continue;
    }
    const active = registry.byCanonical.get(tag);
    if (!active) {
      const lookup = normalizeLookupValue(tag);
      const expected = registry.byLookup.get(lookup);
      const retired = registry.retired.get(lookup);
      if (expected) {
        issues.push({
          code: "tag-noncanonical",
          path,
          tag,
          expected,
          message: `${JSON.stringify(tag)} is not canonical; use ${JSON.stringify(expected)}`,
        });
      } else if (retired) {
        issues.push({
          code: "tag-retired",
          path,
          tag,
          expected: retired.replacement,
          message: `${JSON.stringify(tag)} is retired. ${retired.reason}`,
        });
      } else {
        issues.push({
          code: "tag-unknown",
          path,
          tag,
          message: `${JSON.stringify(tag)} is not registered in tagTaxonomy.json`,
        });
      }
      continue;
    }
    if (seen.has(tag)) {
      issues.push({
        code: "tag-duplicate",
        path,
        tag,
        message: `${JSON.stringify(tag)} appears more than once`,
      });
    }
    seen.add(tag);
  }
  return issues;
}

function topicUrlFor(canonical, taxonomy, lang = DEFAULT_LANG) {
  const topic = compileTaxonomy(taxonomy).byCanonical.get(canonical);
  if (!topic) return null;
  const prefix = lang && lang !== DEFAULT_LANG ? `/${lang}` : "";
  return `${prefix}/tags/${topic.slug}/`;
}

function buildTopicMap(posts, taxonomy, options = {}) {
  const registry = compileTaxonomy(taxonomy);
  const lang = options.lang || DEFAULT_LANG;
  const inheritedCandidates = options.candidateIds || null;
  const stats = new Map();

  for (const post of posts || []) {
    const data = post.data || {};
    const uniqueTags = new Set(
      (Array.isArray(data.tags) ? data.tags : []).filter((tag) =>
        registry.byCanonical.has(tag)
      )
    );
    for (const canonical of uniqueTags) {
      if (!stats.has(canonical)) {
        stats.set(canonical, { posts: [], authors: new Set() });
      }
      const stat = stats.get(canonical);
      stat.posts.push(post);
      if (data.author) stat.authors.add(data.author);
    }
  }

  return [...stats.entries()]
    .map(([canonical, stat]) => {
      const topic = registry.byCanonical.get(canonical);
      const directCandidate =
        stat.posts.length >= registry.policy.categoryMinPosts &&
        stat.authors.size >= registry.policy.categoryMinAuthors;
      return {
        id: topic.id,
        canonical,
        slug: topic.slug,
        aliases: topic.aliases.slice(),
        lang,
        url: topicUrlFor(canonical, taxonomy, lang),
        posts: stat.posts.slice(),
        postCount: stat.posts.length,
        authors: [...stat.authors].sort(),
        authorCount: stat.authors.size,
        isCategory: topic.category,
        isCategoryCandidate: inheritedCandidates
          ? inheritedCandidates.has(topic.id)
          : directCandidate,
      };
    })
    .sort(
      (a, b) =>
        Number(b.isCategory) - Number(a.isCategory) ||
        Number(b.isCategoryCandidate) - Number(a.isCategoryCandidate) ||
        b.postCount - a.postCount ||
        a.canonical.localeCompare(b.canonical, "en")
    );
}

function topicVersions(topicPages, topicId) {
  return (topicPages || [])
    .filter((page) => page.id === topicId)
    .map((page) => ({ lang: page.lang, url: page.url, title: page.canonical }));
}

function tagIndexVersions(langs) {
  return (langs || []).map((lang) => ({
    lang,
    url: lang === DEFAULT_LANG ? "/tags/" : `/${lang}/tags/`,
  }));
}

function sameTags(left, right) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((tag, index) => tag === right[index])
  );
}

module.exports = {
  DEFAULT_LANG,
  normalizeLookupValue,
  compileTaxonomy,
  extractFrontmatter,
  singleLineTagsIssue,
  validateTagRecord,
  buildLegacyTagRedirects,
  buildTopicMap,
  topicUrlFor,
  topicVersions,
  tagIndexVersions,
  sameTags,
};
