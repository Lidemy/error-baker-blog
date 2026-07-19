const CJK_RE = /[\u3040-\u30ff\u3400-\u9fff\uf900-\ufaff]/;
const WORD_RE = /[\p{L}\p{N}+#.]+/gu;
const articleFieldsCache = new WeakMap();
const authorFieldsCache = new WeakMap();

export function normalizeText(value) {
  return String(value || "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}+#.]+/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function words(value) {
  return normalizeText(value).match(WORD_RE) || [];
}

function bigrams(value) {
  const compact = normalizeText(value).replace(/\s+/g, "");
  if (compact.length < 2) return compact ? [compact] : [];
  const out = [];
  for (let index = 0; index < compact.length - 1; index += 1) {
    out.push(compact.slice(index, index + 2));
  }
  return out;
}

function diceCoefficient(left, right) {
  const a = bigrams(left);
  const b = bigrams(right);
  if (!a.length || !b.length) return 0;
  const remaining = [...b];
  let overlap = 0;
  for (const pair of a) {
    const index = remaining.indexOf(pair);
    if (index === -1) continue;
    overlap += 1;
    remaining.splice(index, 1);
  }
  return (2 * overlap) / (a.length + b.length);
}

export function damerauLevenshtein(left, right, maxDistance = Infinity) {
  const a = normalizeText(left);
  const b = normalizeText(right);
  if (Math.abs(a.length - b.length) > maxDistance) return maxDistance + 1;
  if (!a) return b.length;
  if (!b) return a.length;

  let previousPrevious = null;
  let previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  for (let row = 1; row <= a.length; row += 1) {
    const current = [row];
    let rowMinimum = current[0];
    for (let column = 1; column <= b.length; column += 1) {
      const substitution = previous[column - 1] +
        (a[row - 1] === b[column - 1] ? 0 : 1);
      let distance = Math.min(
        previous[column] + 1,
        current[column - 1] + 1,
        substitution
      );
      if (
        previousPrevious &&
        row > 1 &&
        column > 1 &&
        a[row - 1] === b[column - 2] &&
        a[row - 2] === b[column - 1]
      ) {
        distance = Math.min(distance, previousPrevious[column - 2] + 1);
      }
      current[column] = distance;
      rowMinimum = Math.min(rowMinimum, distance);
    }
    if (rowMinimum > maxDistance) return maxDistance + 1;
    previousPrevious = previous;
    previous = current;
  }
  return previous[b.length];
}

function tokenQuality(field, token, fuzzy) {
  if (!field || !token) return 0;
  if (field === token) return 1;
  if (field.startsWith(token)) return 0.94;
  if (field.includes(token)) return 0.86;
  if (!fuzzy) return 0;

  if (CJK_RE.test(token)) {
    const dice = diceCoefficient(field, token);
    return dice >= 0.5 ? Math.min(0.78, 0.42 + dice * 0.36) : 0;
  }

  if (token.length < 4) return 0;
  const maxDistance = token.length >= 8 ? 2 : 1;
  let best = 0;
  for (const candidate of words(field)) {
    if (Math.abs(candidate.length - token.length) > maxDistance) continue;
    const distance = damerauLevenshtein(candidate, token, maxDistance);
    if (distance <= maxDistance) {
      best = Math.max(best, 0.78 - distance * 0.1);
    }
  }
  return best;
}

function fieldQuality(field, normalizedQuery, fuzzy = true) {
  if (!field || !normalizedQuery) return 0;
  if (field === normalizedQuery) return 1;
  if (field.startsWith(normalizedQuery)) return 0.96;
  if (field.includes(normalizedQuery)) return 0.9;

  const queryTokens = words(normalizedQuery);
  if (!queryTokens.length) return 0;
  const qualities = queryTokens.map((token) => tokenQuality(field, token, fuzzy));
  if (qualities.some((quality) => quality < 0.58)) return 0;
  return qualities.reduce((sum, quality) => sum + quality, 0) / qualities.length;
}

function weightedScore(fields, query) {
  const normalizedQuery = normalizeText(query);
  const matches = fields
    .map((field) => ({
      name: field.name,
      score: field.weight * fieldQuality(field.value, normalizedQuery, field.fuzzy),
    }))
    .filter((match) => match.score > 0)
    .sort((left, right) => right.score - left.score);
  if (!matches.length) return { score: 0, matchedField: "" };
  const score = matches[0].score +
    matches.slice(1, 4).reduce((sum, match) => sum + match.score * 0.08, 0);
  return { score, matchedField: matches[0].name };
}

function normalizedValue(value) {
  return normalizeText(Array.isArray(value) ? value.join(" ") : value);
}

function articleFields(article, tagAliases) {
  let fields = articleFieldsCache.get(article);
  if (fields) return fields;
  const aliasText = (article.tags || [])
    .map((tag) => (tagAliases || {})[tag])
    .filter(Boolean)
    .join(" ");
  fields = [
    { name: "title", value: normalizedValue(article.title), weight: 120, fuzzy: true },
    { name: "tag", value: normalizedValue([...(article.tags || []), aliasText]), weight: 96, fuzzy: true },
    { name: "heading", value: normalizedValue(article.headings), weight: 78, fuzzy: true },
    { name: "author", value: normalizedValue([article.author.name, article.author.key]), weight: 70, fuzzy: true },
    { name: "description", value: normalizedValue(article.description), weight: 55, fuzzy: true },
    { name: "slug", value: normalizedValue(article.slug), weight: 42, fuzzy: true },
    { name: "year", value: normalizedValue(article.year), weight: 30, fuzzy: false },
    { name: "content", value: normalizedValue(article.body), weight: 18, fuzzy: false },
  ];
  articleFieldsCache.set(article, fields);
  return fields;
}

function authorFields(author, currentLang) {
  let byLanguage = authorFieldsCache.get(author);
  if (!byLanguage) {
    byLanguage = new Map();
    authorFieldsCache.set(author, byLanguage);
  }
  if (byLanguage.has(currentLang)) return byLanguage.get(currentLang);
  const currentBio = author.bios[currentLang] || author.bios["zh-TW"] || "";
  const fields = [
    { name: "author", value: normalizedValue(author.name), weight: 116, fuzzy: true },
    { name: "author", value: normalizedValue(author.id), weight: 100, fuzzy: true },
    { name: "tag", value: normalizedValue(author.topics), weight: 68, fuzzy: true },
    { name: "description", value: normalizedValue(currentBio), weight: 58, fuzzy: true },
    { name: "description", value: normalizedValue(Object.values(author.bios).join(" ")), weight: 40, fuzzy: true },
  ];
  byLanguage.set(currentLang, fields);
  return fields;
}

export function scoreArticle(article, query, currentLang, tagAliases) {
  const match = weightedScore(articleFields(article, tagAliases), query);
  if (match.score > 0 && article.lang === currentLang) match.score += 12;
  return match;
}

export function scoreAuthor(author, query, currentLang) {
  return weightedScore(authorFields(author, currentLang), query);
}

function articleOrder(left, right, currentLang) {
  return right.score - left.score ||
    Number(right.item.lang === currentLang) - Number(left.item.lang === currentLang) ||
    right.item.published.localeCompare(left.item.published) ||
    left.item.id.localeCompare(right.item.id);
}

export function searchIndex(index, query, options = {}) {
  const currentLang = options.lang || "zh-TW";
  const limit = options.limit || 12;
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) {
    return { articles: [], otherArticles: [], authors: [], total: 0 };
  }

  const byWork = new Map();
  for (const article of index.articles || []) {
    const match = scoreArticle(article, normalizedQuery, currentLang, index.tagAliases);
    if (match.score < 12) continue;
    const result = { item: article, ...match };
    const previous = byWork.get(article.translationKey);
    if (!previous || articleOrder(result, previous, currentLang) < 0) {
      byWork.set(article.translationKey, result);
    }
  }
  const rankedArticles = [...byWork.values()]
    .sort((left, right) => articleOrder(left, right, currentLang));
  const articles = rankedArticles
    .filter((result) => result.item.lang === currentLang)
    .slice(0, limit);
  const otherArticles = rankedArticles
    .filter((result) => result.item.lang !== currentLang)
    .slice(0, Math.max(4, Math.floor(limit / 2)));

  const authors = (index.authors || [])
    .map((author) => ({ item: author, ...scoreAuthor(author, normalizedQuery, currentLang) }))
    .filter((result) => result.score >= 20)
    .sort((left, right) => right.score - left.score || left.item.name.localeCompare(right.item.name))
    .slice(0, 5);

  return {
    articles,
    otherArticles,
    authors,
    total: articles.length + otherArticles.length + authors.length,
  };
}

export function makeSnippet(article, query, maxLength = 170) {
  const candidates = [article.description, ...(article.headings || []), article.body]
    .filter(Boolean);
  const normalizedQuery = normalizeText(query);
  let source = candidates[0] || "";
  let index = -1;
  for (const candidate of candidates) {
    const candidateIndex = normalizeText(candidate).indexOf(normalizedQuery);
    if (candidateIndex >= 0) {
      source = candidate;
      index = candidateIndex;
      break;
    }
  }
  if (source.length <= maxLength) return source;
  const start = Math.max(0, index < 0 ? 0 : index - Math.floor(maxLength * 0.35));
  const end = Math.min(source.length, start + maxLength);
  return `${start > 0 ? "…" : ""}${source.slice(start, end).trim()}${end < source.length ? "…" : ""}`;
}
