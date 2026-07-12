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

/**
 * Copyright (c) 2018 Zach Leatherman
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

const { DateTime } = require("luxon");
const { promisify } = require("util");
const fs = require("fs");
const hasha = require("hasha");
const readFile = promisify(fs.readFile);
const stat = promisify(fs.stat);
const execFile = promisify(require("child_process").execFile);
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const localImages = require("./third_party/eleventy-plugin-local-images/.eleventy.js");
const CleanCSS = require("clean-css");
const { buildAuthorStats } = require("./_11ty/authorStats");
const GA_ID = require("./_data/metadata.json").googleAnalyticsId;

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);

  // NOTE: we don't need this plugin for now
  // eleventyConfig.addPlugin(localImages, {
  //   distPath: "_site",
  //   assetPath: "/img/remote",
  //   selector:
  //     "img,amp-img,amp-video,meta[property='og:image'],meta[name='twitter:image'],amp-story",
  //   verbose: false,
  // });

  eleventyConfig.addPlugin(require("./_11ty/summary.js"));
  eleventyConfig.addPlugin(require("./_11ty/link-target.js"));
  eleventyConfig.addPlugin(require("./_11ty/img-dim.js"));
  eleventyConfig.addPlugin(require("./_11ty/json-ld.js"));
  eleventyConfig.addPlugin(require("./_11ty/optimize-html.js"));
  // NOTE: disable CSP because we don't need it
  // eleventyConfig.addPlugin(require("./_11ty/apply-csp.js"));
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias("post", "layouts/post.njk");
  eleventyConfig.addNunjucksAsyncFilter("addHash", function (
    absolutePath,
    callback
  ) {
    readFile(`_site${absolutePath}`, {
      encoding: "utf-8",
    })
      .then((content) => {
        return hasha.async(content);
      })
      .then((hash) => {
        callback(null, `${absolutePath}?hash=${hash.substr(0, 10)}`);
      })
      .catch((error) => callback(error));
  });

  async function lastModifiedDate(filename) {
    try {
      const { stdout } = await execFile("git", [
        "log",
        "-1",
        "--format=%cd",
        filename,
      ]);
      return new Date(stdout);
    } catch (e) {
      console.error(e.message);
      // Fallback to stat if git isn't working.
      const stats = await stat(filename);
      return stats.mtime; // Date
    }
  }
  // Cache the lastModifiedDate call because shelling out to git is expensive.
  // This means the lastModifiedDate will never change per single eleventy invocation.
  const lastModifiedDateCache = new Map();
  eleventyConfig.addNunjucksAsyncFilter("lastModifiedDate", function (
    filename,
    callback
  ) {
    const call = (result) => {
      result.then((date) => callback(null, date));
      result.catch((error) => callback(error));
    };
    const cached = lastModifiedDateCache.get(filename);
    if (cached) {
      return call(cached);
    }
    const promise = lastModifiedDate(filename);
    lastModifiedDateCache.set(filename, promise);
    call(promise);
  });

  eleventyConfig.addFilter("encodeURIComponent", function (str) {
    return encodeURIComponent(str);
  });

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("sitemapDateTimeString", (dateObj) => {
    const dt = DateTime.fromJSDate(dateObj, { zone: "utc" });
    if (!dt.isValid) {
      return "";
    }
    return dt.toISO();
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  /* ---------------------------------------------------------------------------
   * i18n / multilingual support
   *
   * Posts live as `posts/<author>/<slug>.md` (zh-TW source) with translations
   * alongside as `posts/<author>/<slug>.<lang>.md`. Each translation declares
   * `lang` and a shared `translationKey` in its frontmatter. These helpers let
   * templates (a) keep each language's listings separate and (b) link the
   * versions of one article together for the language switcher + hreflang.
   * ------------------------------------------------------------------------- */
  const SITE_LANGS = ["zh-TW", "en", "ja", "zh-CN"]; // source first; display order
  const DEFAULT_LANG = "zh-TW";

  const postLang = (item) => (item.data && item.data.lang) || DEFAULT_LANG;
  const postTranslationKey = (item) => {
    if (item.data && item.data.translationKey) return item.data.translationKey;
    // Fallback: derive `<author>/<slug>` from the input path, dropping any
    // `.<lang>` suffix so an original and its translations share one key.
    const match = item.inputPath.match(/posts\/(.+?)(?:\.[A-Za-z-]+)?\.md$/);
    return match ? match[1] : item.inputPath;
  };

  // Keep only the posts written in `lang` (defaults to zh-TW). Used by listing
  // pages and feeds so translations don't leak into the Chinese homepage/RSS.
  eleventyConfig.addFilter("filterByLang", function (posts, lang) {
    const target = lang || DEFAULT_LANG;
    return (posts || []).filter((item) => postLang(item) === target);
  });

  // Look up the URL of the `lang` version within a translations entry (the
  // [{lang, url, title}] array). Returns null if that language isn't available.
  // (A filter, not an in-template loop, because Nunjucks `set` inside a `for`
  // doesn't escape the loop scope.)
  eleventyConfig.addFilter("urlForLang", function (translations, lang) {
    if (!translations) return null;
    const hit = translations.find((v) => v.lang === lang);
    return hit ? hit.url : null;
  });

  // Link an author to their page in the current language when that page was
  // actually generated. Otherwise fall back to the always-available zh-TW
  // author page instead of emitting a broken localized URL.
  eleventyConfig.addFilter("authorUrlForLang", function (authorPages, lang, author) {
    const target = lang || DEFAULT_LANG;
    const hasLocalizedPage =
      target !== DEFAULT_LANG &&
      (authorPages || []).some(
        (page) => page.lang === target && page.author === author
      );
    return hasLocalizedPage
      ? `/${target}/posts/${author}/`
      : `/posts/${author}/`;
  });

  // The home pages exist for every language at deterministic URLs
  // (zh-TW → /, others → /<lang>/). Build their translation set directly rather
  // than via the `translations` collection — paginated pages aren't reliably
  // visible to a collection consumed from another paginated template.
  eleventyConfig.addFilter("homeVersions", function (langsArr) {
    return (langsArr || []).map((code) => ({
      lang: code,
      url: code === DEFAULT_LANG ? "/" : `/${code}/`,
    }));
  });

  // zh-TW-only posts — the source language listing (homepage, archive, feeds).
  eleventyConfig.addCollection("postsZhTW", function (collectionApi) {
    return collectionApi
      .getFilteredByTag("posts")
      .filter((item) => postLang(item) === DEFAULT_LANG);
  });

  // Authors ranked by number of (zh-TW source) posts — for the /about/
  // leaderboard and per-author profile. Each record is enriched by
  // _11ty/authorStats.js with level/tier, achievements and a contribution
  // calendar. Ties on post count are broken by most recent activity (not name).
  eleventyConfig.addCollection("authorsByPostCount", function (collectionApi) {
    const authors = require("./_data/metadata.json").authors;
    const posts = collectionApi
      .getFilteredByTag("posts")
      .filter((item) => postLang(item) === DEFAULT_LANG);
    return buildAuthorStats(posts, authors);
  });

  // Look up one author's enriched stats record by key (for author pages).
  eleventyConfig.addFilter("authorStat", function (stats, key) {
    return (stats || []).find((s) => s.key === key) || null;
  });

  // (lang, author) pairs that have at least one visible translated post — used
  // to generate per-language author pages /<lang>/posts/<author>/ (zh-TW author
  // pages are the manual posts/<author>/index.njk files). Computed data is
  // applied after custom collections, so mirror the production draft gate here
  // to avoid treating a non-emitted draft author page as available.
  eleventyConfig.addCollection("authorLangPages", function (collectionApi) {
    const seen = {};
    for (const item of collectionApi.getFilteredByTag("posts")) {
      if (item.data.draft && !item.data.isdevelopment) continue;
      const lang = postLang(item);
      if (lang === DEFAULT_LANG) continue;
      const author = item.data.author;
      if (!author) continue;
      seen[lang + "|" + author] = { lang, author };
    }
    return Object.values(seen);
  });

  // Map of translationKey -> [{ lang, url, title }], display-ordered by
  // SITE_LANGS. Templates read collections.translations[translationKey].
  // Spans ALL pages that declare a `translationKey` (posts AND the per-language
  // home pages), so the site-wide switcher links home↔home and article↔article.
  eleventyConfig.addCollection("translations", function (collectionApi) {
    const map = {};
    for (const item of collectionApi.getAll()) {
      if (!item.data || !item.data.translationKey) continue;
      const key = item.data.translationKey;
      (map[key] = map[key] || []).push({
        lang: postLang(item),
        url: item.url,
        title: item.data.title,
      });
    }
    for (const key of Object.keys(map)) {
      map[key].sort(
        (a, b) => SITE_LANGS.indexOf(a.lang) - SITE_LANGS.indexOf(b.lang)
      );
    }
    return map;
  });

  eleventyConfig.addCollection("tagList", require("./_11ty/getTagList"));

  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("css");
  // We need to copy cached.js only if GA is used
  eleventyConfig.addPassthroughCopy(GA_ID ? "js" : "js/*[!cached].*");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("_headers");

  // We need to rebuild upon JS change to update the CSP.
  eleventyConfig.addWatchTarget("./js/");
  // We need to rebuild on CSS change to inline it.
  eleventyConfig.addWatchTarget("./css/");
  // Unfortunately this means .eleventyignore needs to be maintained redundantly.
  // But without this the JS build artefacts doesn't trigger a build.
  eleventyConfig.setUseGitIgnore(false);

  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#",
    permalinkBefore: true
  });
  eleventyConfig.setLibrary("md", markdownLibrary);

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("_site/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
  });

  return {
    templateFormats: ["md", "njk", "html", "liquid"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.io/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`
    // pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // These are all optional, defaults are shown:
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      // Warning hardcoded throughout repo. Find and replace is your friend :)
      output: "_site",
    },
  };
};
