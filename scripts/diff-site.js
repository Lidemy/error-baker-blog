#!/usr/bin/env node
"use strict";

/**
 * diff-site.js — 黃金輸出比對（golden-output diff）
 *
 * 比對兩個已建置的 `_site` 目錄，回答「這次改動是否影響 SEO」。
 *
 * 用法：
 *   node scripts/diff-site.js <dirA> <dirB> [--json]
 *
 * 比對內容：
 *   1. 所有 .html 檔的 URL 集合 → 新增／消失頁面
 *   2. sitemap.xml 的 <loc> 集合、feed/feed.xml 的 <id> 集合
 *   3. 每個共同頁面的 SEO 敏感節點：
 *      <title>、meta[name=description]、link[rel=canonical]、
 *      link[rel=alternate][hreflang]、meta[property^=og:]、
 *      meta[name^=twitter:]、meta[name=robots]、JSON-LD、<html lang>
 *
 * 離開碼：0 = 完全相同，1 = 有差異。
 *
 * 設計備註：一次只在記憶體中處理一個頁面的 DOM（8GB RAM、平行 agent），
 * 解析後只保留輕量的「簽章」物件，DOM 立即釋放。
 */

const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

// 靜音的 virtual console：站台 CSS 用了 jsdom 解析不了的新語法時，
// 預設會對每一頁噴出 "Could not parse CSS stylesheet" 到 stderr
// （300+ 頁 × 多段 style 會灌出數十 MB）。我們只讀 SEO 節點，不需要
// CSSOM，直接丟棄所有 jsdom 內部錯誤輸出。
const silentConsole = new VirtualConsole();
silentConsole.on("jsdomError", () => {});

// ---------------------------------------------------------------------------
// 正規化（normalizer）
//
// 目的：把「同一份內容、不同次建置」造成的非語意雜訊消掉，只保留真正的
// SEO 語意差異。雜訊來源以「main 連建兩次再 diff」的方式實證發現：
//
//   - 資產快取破壞參數 `?hash=xxxxxxxx`（rollup/eleventy 對 min.js、favicon
//     等加的內容雜湊；同內容 → 同雜湊，但為了穩健仍一律剝除）。
//   - 空白差異（模板換行／縮排在不同建置間可能微幅不同）。
//   - 時間戳：sitemap 的 <lastmod>、feed 的 <updated>/<published> 採
//     RFC3339 / W3C datetime；本專案的日期多為內容衍生（文章 frontmatter），
//     但 <lastmod> 會讀檔案 mtime，CI 上 merge-base 與 head 兩次 checkout 的
//     mtime 不同 → 會製造假差異，因此一律遮蔽為固定佔位符。
// ---------------------------------------------------------------------------

// `?hash=deadbeef` 或 `?v=deadbeef` 之類的快取破壞查詢字串。
const HASH_QUERY_RE = /\?(?:hash|v)=[0-9a-f]+/gi;

// ISO-8601 / RFC3339 / W3C datetime 時間戳（sitemap lastmod、feed updated…）。
// 例：2026-05-16T00:00:00Z、2026-05-16T00:00:00+08:00、2026-05-16
const TIMESTAMP_RE =
  /\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?)?/g;

function stripHash(value) {
  if (value == null) return value;
  return String(value).replace(HASH_QUERY_RE, "");
}

function collapseWs(value) {
  if (value == null) return value;
  return String(value).replace(/\s+/g, " ").trim();
}

function maskTimestamps(value) {
  if (value == null) return value;
  return String(value).replace(TIMESTAMP_RE, "<ts>");
}

// URL 類欄位（href/canonical/og:url…）：剝雜湊 + 收斂空白。
function normUrl(value) {
  return collapseWs(stripHash(value));
}

// 文字類欄位（title/description…）：收斂空白。
function normText(value) {
  return collapseWs(value);
}

// ---------------------------------------------------------------------------
// 目錄掃描
// ---------------------------------------------------------------------------

function walk(dir, predicate) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    let entries;
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true });
    } catch (e) {
      continue;
    }
    for (const ent of entries) {
      const full = path.join(cur, ent.name);
      if (ent.isDirectory()) {
        stack.push(full);
      } else if (ent.isFile() && predicate(full)) {
        out.push(full);
      }
    }
  }
  return out;
}

// 把檔案路徑轉成站台 URL（index.html → 目錄斜線）。
function toUrlKey(root, file) {
  let rel = path.relative(root, file).split(path.sep).join("/");
  if (rel.endsWith("/index.html")) {
    rel = rel.slice(0, -"index.html".length);
  } else if (rel === "index.html") {
    rel = "";
  }
  return "/" + rel;
}

function htmlUrlMap(root) {
  const map = new Map();
  for (const file of walk(root, (f) => f.endsWith(".html"))) {
    map.set(toUrlKey(root, file), file);
  }
  return map;
}

// ---------------------------------------------------------------------------
// 每頁 SEO 簽章擷取（一次一個 DOM）
// ---------------------------------------------------------------------------

function extractSignature(file) {
  const html = fs.readFileSync(file, "utf8");
  const dom = new JSDOM(html, { virtualConsole: silentConsole });
  const doc = dom.window.document;

  const sig = {
    htmlLang: normText(doc.documentElement.getAttribute("lang")),
    title: normText(doc.querySelector("title") && doc.querySelector("title").textContent),
    description: null,
    canonical: null,
    robots: null,
    hreflang: [], // "hreflang=xx -> href"
    og: [], // "og:xxx = yyy"
    twitter: [], // "twitter:xxx = yyy"
    jsonld: [], // canonical JSON strings
  };

  const desc = doc.querySelector('meta[name="description"]');
  if (desc) sig.description = normText(desc.getAttribute("content"));

  const canonical = doc.querySelector('link[rel="canonical"]');
  if (canonical) sig.canonical = normUrl(canonical.getAttribute("href"));

  const robots = doc.querySelector('meta[name="robots"]');
  if (robots) sig.robots = normText(robots.getAttribute("content"));

  doc.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => {
    const hl = normText(el.getAttribute("hreflang"));
    const href = normUrl(el.getAttribute("href"));
    sig.hreflang.push(`${hl} -> ${href}`);
  });
  sig.hreflang.sort();

  doc.querySelectorAll("meta[property]").forEach((el) => {
    const prop = el.getAttribute("property") || "";
    if (prop.startsWith("og:")) {
      sig.og.push(`${prop} = ${normUrl(el.getAttribute("content"))}`);
    }
  });
  sig.og.sort();

  doc.querySelectorAll("meta[name]").forEach((el) => {
    const name = el.getAttribute("name") || "";
    if (name.startsWith("twitter:")) {
      sig.twitter.push(`${name} = ${normUrl(el.getAttribute("content"))}`);
    }
  });
  sig.twitter.sort();

  doc.querySelectorAll('script[type="application/ld+json"]').forEach((el) => {
    sig.jsonld.push(canonicalJsonLd(el.textContent));
  });
  sig.jsonld.sort();

  // 主動釋放：關閉 window，交由 GC 回收 DOM。
  dom.window.close();
  return sig;
}

// JSON-LD 正規化：解析後遞迴排序鍵值 + 遮蔽時間戳 + 剝雜湊，序列化。
// 解析失敗時退回純文字正規化。
function canonicalJsonLd(text) {
  const cleaned = maskTimestamps(stripHash(text || ""));
  try {
    const obj = JSON.parse(cleaned);
    return JSON.stringify(sortKeys(obj));
  } catch (e) {
    return collapseWs(cleaned);
  }
}

function sortKeys(value) {
  if (Array.isArray(value)) return value.map(sortKeys);
  if (value && typeof value === "object") {
    const out = {};
    for (const key of Object.keys(value).sort()) {
      out[key] = sortKeys(value[key]);
    }
    return out;
  }
  if (typeof value === "string") return maskTimestamps(stripHash(value));
  return value;
}

// ---------------------------------------------------------------------------
// sitemap / feed 擷取
// ---------------------------------------------------------------------------

function readTagSet(file, tag) {
  const set = new Set();
  let xml;
  try {
    xml = fs.readFileSync(file, "utf8");
  } catch (e) {
    return null; // 檔案不存在
  }
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, "gi");
  let m;
  while ((m = re.exec(xml)) !== null) {
    set.add(normUrl(m[1]));
  }
  return set;
}

function sitemapLocs(root) {
  return readTagSet(path.join(root, "sitemap.xml"), "loc");
}

function feedIds(root) {
  return readTagSet(path.join(root, "feed", "feed.xml"), "id");
}

// ---------------------------------------------------------------------------
// 比對
// ---------------------------------------------------------------------------

function diffSets(a, b) {
  // a, b: Set | null。回傳 {added, removed} 或 null（雙方皆不存在）。
  if (!a && !b) return null;
  const setA = a || new Set();
  const setB = b || new Set();
  const added = [...setB].filter((x) => !setA.has(x)).sort();
  const removed = [...setA].filter((x) => !setB.has(x)).sort();
  return { added, removed };
}

function diffArray(a, b) {
  const setA = new Set(a);
  const setB = new Set(b);
  const added = b.filter((x) => !setA.has(x));
  const removed = a.filter((x) => !setB.has(x));
  return { added, removed };
}

const SCALAR_FIELDS = [
  ["htmlLang", "html lang"],
  ["title", "<title>"],
  ["description", "meta description"],
  ["canonical", "canonical"],
  ["robots", "meta robots"],
];

const LIST_FIELDS = [
  ["hreflang", "hreflang alternates"],
  ["og", "Open Graph (og:*)"],
  ["twitter", "Twitter Card (twitter:*)"],
  ["jsonld", "JSON-LD"],
];

function diffPage(sigA, sigB) {
  const changes = [];
  for (const [key, label] of SCALAR_FIELDS) {
    if (sigA[key] !== sigB[key]) {
      changes.push({ field: label, type: "scalar", before: sigA[key], after: sigB[key] });
    }
  }
  for (const [key, label] of LIST_FIELDS) {
    const { added, removed } = diffArray(sigA[key], sigB[key]);
    if (added.length || removed.length) {
      changes.push({ field: label, type: "list", added, removed });
    }
  }
  return changes;
}

function buildReport(dirA, dirB) {
  const mapA = htmlUrlMap(dirA);
  const mapB = htmlUrlMap(dirB);

  const urlsA = new Set(mapA.keys());
  const urlsB = new Set(mapB.keys());
  const addedPages = [...urlsB].filter((u) => !urlsA.has(u)).sort();
  const removedPages = [...urlsA].filter((u) => !urlsB.has(u)).sort();
  const common = [...urlsA].filter((u) => urlsB.has(u)).sort();

  const pageChanges = [];
  for (const url of common) {
    const sigA = extractSignature(mapA.get(url));
    const sigB = extractSignature(mapB.get(url));
    const changes = diffPage(sigA, sigB);
    if (changes.length) pageChanges.push({ url, changes });
  }

  const sitemap = diffSets(sitemapLocs(dirA), sitemapLocs(dirB));
  const feed = diffSets(feedIds(dirA), feedIds(dirB));

  return { dirA, dirB, addedPages, removedPages, pageChanges, sitemap, feed };
}

function hasDifferences(report) {
  if (report.addedPages.length || report.removedPages.length) return true;
  if (report.pageChanges.length) return true;
  if (report.sitemap && (report.sitemap.added.length || report.sitemap.removed.length)) return true;
  if (report.feed && (report.feed.added.length || report.feed.removed.length)) return true;
  return false;
}

// ---------------------------------------------------------------------------
// zh-TW 文字報告
// ---------------------------------------------------------------------------

function shortVal(v) {
  if (v === null || v === undefined) return "（無）";
  const s = String(v);
  return s.length > 160 ? s.slice(0, 157) + "…" : s;
}

function renderReport(report) {
  const lines = [];
  const push = (s) => lines.push(s);

  if (!hasDifferences(report)) {
    push("黃金輸出比對：兩份 _site 的 SEO 相關輸出完全相同，無差異。");
    return lines.join("\n");
  }

  push("# 黃金輸出比對報告（SEO 影響）");
  push("");

  // 新增頁面
  push(`## 新增頁面（${report.addedPages.length}）`);
  if (report.addedPages.length) {
    report.addedPages.forEach((u) => push(`- + ${u}`));
  } else {
    push("- （無）");
  }
  push("");

  // 消失頁面
  push(`## 消失頁面（${report.removedPages.length}）`);
  if (report.removedPages.length) {
    report.removedPages.forEach((u) => push(`- - ${u}`));
  } else {
    push("- （無）");
  }
  push("");

  // 每頁 SEO 元素變更
  push(`## 每頁 SEO 元素變更（${report.pageChanges.length} 頁）`);
  if (!report.pageChanges.length) {
    push("- （無）");
  } else {
    for (const pc of report.pageChanges) {
      push(`### ${pc.url}`);
      for (const c of pc.changes) {
        if (c.type === "scalar") {
          push(`- **${c.field}**`);
          push(`  - 前：${shortVal(c.before)}`);
          push(`  - 後：${shortVal(c.after)}`);
        } else {
          push(`- **${c.field}**`);
          c.removed.forEach((x) => push(`  - − ${shortVal(x)}`));
          c.added.forEach((x) => push(`  - ＋ ${shortVal(x)}`));
        }
      }
      push("");
    }
  }

  // sitemap
  if (report.sitemap && (report.sitemap.added.length || report.sitemap.removed.length)) {
    push(`## sitemap.xml 網址變更`);
    report.sitemap.removed.forEach((u) => push(`- − ${u}`));
    report.sitemap.added.forEach((u) => push(`- ＋ ${u}`));
    push("");
  }

  // feed
  if (report.feed && (report.feed.added.length || report.feed.removed.length)) {
    push(`## feed/feed.xml 項目（id）變更`);
    report.feed.removed.forEach((u) => push(`- − ${u}`));
    report.feed.added.forEach((u) => push(`- ＋ ${u}`));
    push("");
  }

  return lines.join("\n").replace(/\n+$/, "") + "\n";
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function main(argv) {
  const args = argv.slice(2);
  const asJson = args.includes("--json");
  const positional = args.filter((a) => !a.startsWith("--"));

  if (positional.length !== 2) {
    process.stderr.write(
      "用法：node scripts/diff-site.js <dirA> <dirB> [--json]\n"
    );
    return 2;
  }

  const [dirA, dirB] = positional;
  for (const d of [dirA, dirB]) {
    if (!fs.existsSync(d) || !fs.statSync(d).isDirectory()) {
      process.stderr.write(`錯誤：找不到目錄 ${d}\n`);
      return 2;
    }
  }

  const report = buildReport(dirA, dirB);
  const differ = hasDifferences(report);

  if (asJson) {
    process.stdout.write(JSON.stringify({ ...report, hasDifferences: differ }, null, 2) + "\n");
  } else {
    process.stdout.write(renderReport(report) + "\n");
  }

  return differ ? 1 : 0;
}

if (require.main === module) {
  process.exit(main(process.argv));
}

module.exports = {
  buildReport,
  renderReport,
  hasDifferences,
  extractSignature,
  normUrl,
  normText,
  maskTimestamps,
  canonicalJsonLd,
};
