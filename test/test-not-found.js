"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();
const activeLanguages = require("../_11ty/activeLanguages.js");
const i18n = require("../_data/i18n.json");
const languages = require("../_data/langs.json");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SITE_ROOT = path.join(PROJECT_ROOT, "_site");

function outputForLanguage(lang) {
  return lang === languages[0]
    ? path.join(SITE_ROOT, "404.html")
    : path.join(SITE_ROOT, lang, "404.html");
}

function parseHtmlWithoutStyles(filename) {
  const html = fs
    .readFileSync(filename, "utf8")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  return new JSDOM(html, { virtualConsole: quietConsole }).window.document;
}

function redirectField(block, field) {
  const match = block.match(
    new RegExp(`^\\s*${field}\\s*=\\s*(?:"([^"]*)"|(\\d+)|(true|false))\\s*$`, "m")
  );
  if (!match) return undefined;
  if (match[1] !== undefined) return match[1];
  if (match[2] !== undefined) return Number(match[2]);
  return match[3] === "true";
}

function netlifyRedirects(source) {
  return source
    .split(/^\[\[redirects\]\]\s*$/m)
    .slice(1)
    .map((part) => part.split(/^\[\[/m)[0])
    .map((block) => ({
      from: redirectField(block, "from"),
      to: redirectField(block, "to"),
      status: redirectField(block, "status"),
      force: redirectField(block, "force"),
    }));
}

describe("localized not-found documents", () => {
  it("renders root and active-locale 404 outputs with matching i18n copy", () => {
    const active = activeLanguages(false);
    for (const lang of active) {
      const filename = outputForLanguage(lang);
      assert.ok(fs.existsSync(filename), `Missing ${lang} 404 output: ${filename}`);

      const doc = parseHtmlWithoutStyles(filename);
      const strings = i18n[lang];
      const notFound = doc.querySelector(".not-found");
      assert.ok(notFound, `${lang} 404 must render the localized not-found body`);
      const body = [...notFound.children].find(
        (element) => element.tagName === "P" && !element.classList.contains("not-found__mark")
      );
      const home = notFound.querySelector("a");

      assert.equal(doc.documentElement.lang, lang);
      assert.equal(doc.title, strings.notFoundTitle);
      assert.equal(body.textContent.trim(), strings.notFoundBody);
      assert.equal(home.textContent.trim(), strings.notFoundHome);
      assert.equal(
        home.getAttribute("href"),
        lang === languages[0] ? "/" : `/${lang}/`
      );
    }
  });

  it("keeps every locale fallback on a real HTTP 404 response", () => {
    const source = fs.readFileSync(path.join(PROJECT_ROOT, "netlify.toml"), "utf8");
    const redirects = netlifyRedirects(source);

    for (const lang of languages.slice(1)) {
      const fallback = redirects.find((redirect) => redirect.from === `/${lang}/*`);
      assert.ok(fallback, `Missing Netlify fallback for ${lang}`);
      assert.equal(fallback.to, `/${lang}/404.html`);
      assert.equal(fallback.status, 404, `${lang} fallback must preserve not-found status`);
    }
  });

  it("excludes every not-found document from the sitemap", () => {
    const filename = path.join(SITE_ROOT, "sitemap.xml");
    assert.ok(fs.existsSync(filename), `Missing build output: ${filename}`);
    const sitemap = fs.readFileSync(filename, "utf8");
    assert.doesNotMatch(sitemap, /<loc>[^<]*\/404\.html<\/loc>/);
  });
});
