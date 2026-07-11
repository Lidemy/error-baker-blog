/**
 * Build-time gamification stats for authors.
 *
 * Consumes the zh-TW source posts (one per article) and the authors map from
 * _data/metadata.json, and returns an array of enriched author records used by
 * the /about/ leaderboard and the per-author profile (level, achievements,
 * GitHub-style contribution calendar). Pure & dependency-light (luxon only) so
 * it can be unit-reasoned and reused from collections.
 */
const { DateTime } = require("luxon");

const utc = (d) => DateTime.fromJSDate(d, { zone: "utc" }).startOf("day");
const iso = (dt) => dt.toFormat("yyyy-LL-dd");

// Post-count → level/tier. Tier drives the badge colour; level is the Lv.N.
function levelInfo(count) {
  if (count >= 15) return { level: 5, tier: "diamond" };
  if (count >= 10) return { level: 4, tier: "gold" };
  if (count >= 6) return { level: 3, tier: "silver" };
  if (count >= 3) return { level: 2, tier: "bronze" };
  return { level: 1, tier: "iron" };
}

// Intensity bucket (0–4) for a day's post count, GitHub-style.
function calLevel(count) {
  if (!count) return 0;
  if (count >= 4) return 4;
  return count; // 1..3
}

// Condensed contribution bar: one cell per quarter across the author's active
// range, newest first (so the latest activity is shown first without scrolling).
// A day-level grid spanning years is too wide; quarter buckets keep the cadence
// readable in ~20 cells for a 5-year history.
function buildCalendar(dates) {
  if (!dates.length) return null;
  const counts = {}; // 'yyyy-q' -> post count
  dates.forEach((d) => {
    const dt = utc(d);
    const q = Math.ceil(dt.month / 3);
    counts[dt.year + "-" + q] = (counts[dt.year + "-" + q] || 0) + 1;
  });
  const sorted = [...dates].sort((a, b) => a - b);
  const start = utc(sorted[0]);
  const end = utc(sorted[sorted.length - 1]);
  const endIdx = end.year * 4 + (Math.ceil(end.month / 3) - 1);
  const cells = [];
  for (let idx = start.year * 4 + (Math.ceil(start.month / 3) - 1); idx <= endIdx; idx++) {
    const year = Math.floor(idx / 4);
    const quarter = (idx % 4) + 1;
    const count = counts[year + "-" + quarter] || 0;
    cells.push({ year, quarter, count, level: calLevel(count) });
  }
  cells.reverse(); // newest first
  return { cells };
}

/**
 * @param {Array} posts  Eleventy items (already filtered to zh-TW source posts).
 * @param {Object} authors  metadata.json `authors` map (key -> {name, avatarUrl}).
 * @returns {Array} enriched author records, sorted (count desc, latest desc),
 *                  each with a `rank` (1-based) and `medal` for the top 3.
 */
function buildAuthorStats(posts, authors) {
  const acc = {}; // key -> { count, dates[] }
  for (const item of posts) {
    const key = item.data && item.data.author;
    if (!key) continue;
    const a = (acc[key] = acc[key] || { count: 0, dates: [] });
    a.count += 1;
    a.dates.push(item.date);
  }

  const stats = Object.keys(authors)
    .map((key) => {
      const a = acc[key];
      if (!a || a.count === 0) return null;
      const sorted = [...a.dates].sort((x, y) => x - y);
      const stat = {
        key,
        name: authors[key].name,
        avatarUrl: authors[key].avatarUrl,
        count: a.count,
        firstDate: iso(utc(sorted[0])),
        latestDate: iso(utc(sorted[sorted.length - 1])),
        latestTs: utc(sorted[sorted.length - 1]).toMillis(),
      };
      Object.assign(stat, levelInfo(stat.count));
      stat.calendar = buildCalendar(a.dates);
      return stat;
    })
    .filter(Boolean)
    // Same post count → most recently active author ranks higher.
    .sort((a, b) => b.count - a.count || b.latestTs - a.latestTs);

  const max = stats.length ? stats[0].count : 0;
  const medals = { 1: "🥇", 2: "🥈", 3: "🥉" };
  stats.forEach((s, i) => {
    s.rank = i + 1;
    s.medal = medals[s.rank] || "";
    s.pct = max ? Math.round((s.count / max) * 100) : 0;
  });
  return stats;
}

module.exports = { buildAuthorStats };
