/**
 * Draft gate for machine-translated (or any) posts.
 *
 * Translations produced by `/translate-post` are written with `draft: true`
 * until a human reviews them. Drafts stay visible in local dev (so the author
 * can preview them with `eleventy --serve`) but are excluded from the
 * production build — no page is emitted and they don't appear in any collection
 * (homepage, feeds, sitemap, language switcher).
 *
 * `isdevelopment` is provided by _data/isdevelopment.js (true only under
 * `eleventy --serve`). This follows Eleventy's official drafts recipe:
 * returning `data.permalink` leaves non-draft pages on their default permalink.
 */
module.exports = {
  permalink: (data) => {
    if (data.draft && !data.isdevelopment) {
      return false;
    }
    if (!localizedShellIsActive(data)) {
      return false;
    }
    // The localized shells are paginated templates whose front-matter
    // permalink is itself a template ("/{{ alang }}/about/"). Eleventy 0.12
    // does NOT re-render a permalink returned from computed data, so passing
    // `data.permalink` through verbatim collapses every active shell page onto
    // one empty output path (DuplicatePermalinkOutputError). Build the concrete
    // URL from the pagination alias instead.
    const shellPermalink = localizedShellPermalink(data);
    if (shellPermalink) {
      return shellPermalink;
    }
    return data.permalink;
  },
  eleventyExcludeFromCollections: (data) => {
    if (data.draft && !data.isdevelopment) {
      return true;
    }
    if (!localizedShellIsActive(data)) {
      return true;
    }
    return data.eleventyExcludeFromCollections || false;
  },
};

/**
 * Concrete permalink for a localized shell page, derived from its pagination
 * alias. Must stay in sync with the shells' front-matter permalink templates.
 * Returns null for non-shell pages (and for shells whose alias is not yet
 * available), letting the caller fall back to `data.permalink`.
 */
function localizedShellPermalink(data) {
  const inputPath = (data.page && data.page.inputPath) || "";
  if (/home-i18n\.njk$/.test(inputPath) && data.hlang) {
    return `/${data.hlang}/`;
  }
  if (/about-i18n\.njk$/.test(inputPath) && data.alang) {
    return `/${data.alang}/about/`;
  }
  if (/feed\/feed-i18n\.njk$/.test(inputPath) && data.flang) {
    return `/${data.flang}/feed/feed.xml`;
  }
  if (/feed\/json-i18n\.njk$/.test(inputPath) && data.flang) {
    return `/${data.flang}/feed/feed.json`;
  }
  if (
    /author-langs\.njk$/.test(inputPath) &&
    data.ap &&
    data.ap.lang &&
    data.ap.author
  ) {
    return `/${data.ap.lang}/posts/${data.ap.author}/`;
  }
  return null;
}

/**
 * A localized shell page (home/About/feeds/author) is active only when its
 * language has a visible translated post.
 *
 * The active-language set comes from the `activeLangs` GLOBAL DATA, not the
 * `siteLangsWithPublishedPosts` collection: this gate runs while `permalink`
 * is computed, and Eleventy 0.12 defers any computed entry that reads
 * `data.collections.*` to a second round — after paginated URLs are already
 * fixed — which would collapse the shells onto one empty path. Global data is
 * available in the first round. Both derive from the same predicate
 * (see _11ty/activeLanguages.js and the collection in .eleventy.js).
 */
function localizedShellIsActive(data) {
  const inputPath = data.page && data.page.inputPath;
  const localizedShell =
    /(?:home-i18n|about-i18n|feed\/(?:feed|json)-i18n|author-langs)\.njk$/.test(
      inputPath || ""
    );
  if (!localizedShell) return true;

  const lang = data.hlang || data.alang || data.flang || (data.ap && data.ap.lang);
  const active = data.activeLangs || ["zh-TW"];
  return Boolean(lang && active.includes(lang));
}
