"use strict";

/**
 * Reading time for a rendered article body.
 *
 * The corpus is bilingual inside a single post — Chinese prose with English
 * technical terms — so a single words-per-minute figure would be wrong for
 * every article. CJK is counted per character and Latin per word, at the two
 * rates below, and the two estimates are added.
 *
 * Rates are deliberately conservative reading speeds for technical material
 * (silent reading research puts Chinese around 400–500 characters/min and
 * English technical prose around 200–250 words/min). Code inside <pre> is
 * counted like the rest: skipping it entirely made code-heavy tutorials read
 * as three-minute posts.
 */
const CJK_PER_MINUTE = 400;
const WORDS_PER_MINUTE = 220;

// Han, kana, and Hangul. Each such character is one "word" of reading work.
const CJK_PATTERN =
  "[\\u3040-\\u30ff\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff\\uac00-\\ud7af]";

function plainText(html) {
  return String(html == null ? "" : html)
    .replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&(?:[a-z]+|#\d+|#x[0-9a-f]+);/gi, " ");
}

/**
 * @param {string} html rendered article HTML (Eleventy's `content`)
 * @returns {number} whole minutes, never below 1
 */
function readingMinutes(html) {
  const text = plainText(html);
  const cjk = (text.match(new RegExp(CJK_PATTERN, "g")) || []).length;
  const latin = (
    text.replace(new RegExp(CJK_PATTERN, "g"), " ").match(/[\w'’-]+/g) || []
  ).length;
  const minutes = Math.ceil(cjk / CJK_PER_MINUTE + latin / WORDS_PER_MINUTE);
  return Math.max(1, minutes);
}

module.exports = { readingMinutes, CJK_PER_MINUTE, WORDS_PER_MINUTE };
