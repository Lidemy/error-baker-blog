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
    // permalink is itself a template ("/{{ alang }}/about/"). Eleventy 3.x
    // re-renders a permalink template returned from computed data, so passing
    // `data.permalink` through verbatim resolves each shell's own front-matter
    // permalink per pagination page. (Eleventy 0.12 did NOT re-render it, which
    // forced an explicit `localizedShellPermalink()` helper here — removed in
    // the 3.x cleanup; see git history if it ever needs to come back.)
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
    /(?:home-i18n|about-i18n|404-i18n|feed\/(?:feed|json)-i18n|author-langs)\.njk$/.test(
      inputPath || ""
    );
  if (!localizedShell) return true;

  const lang =
    data.hlang ||
    data.alang ||
    data.notFoundLang ||
    data.flang ||
    (data.ap && data.ap.lang);
  const active = data.activeLangs || ["zh-TW"];
  return Boolean(lang && active.includes(lang));
}
