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
    return data.permalink;
  },
  eleventyExcludeFromCollections: (data) => {
    if (data.draft && !data.isdevelopment) {
      return true;
    }
    return data.eleventyExcludeFromCollections || false;
  },
};
