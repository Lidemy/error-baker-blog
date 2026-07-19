"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();
const metadata = require("../_data/metadata.json");
const i18n = require("../_data/i18n.json");

const SITE_ROOT = path.resolve(__dirname, "..", "_site");
const FILENAME = path.join(SITE_ROOT, "index.html");

describe("homepage build output", () => {
  let doc;

  before(() => {
    assert.ok(fs.existsSync(FILENAME), `Missing build output: ${FILENAME}`);
    doc = new JSDOM(fs.readFileSync(FILENAME, "utf8"), { virtualConsole: quietConsole }).window.document;
  });

  it("has localized document metadata and a self canonical", () => {
    assert.equal(doc.documentElement.lang, "zh-TW");
    assert.equal(
      doc.querySelector("link[rel='canonical']").href,
      `${metadata.url}/`
    );
    assert.ok(doc.querySelector("meta[name='description']").content.length > 0);
  });

  it("has working primary navigation", () => {
    const hrefs = [...doc.querySelectorAll("header nav a")].map((link) =>
      link.getAttribute("href")
    );
    assert.ok(hrefs.includes("/archive/"));
    assert.ok(hrefs.includes("/tags/"));
    assert.ok(hrefs.includes("/about/"));
  });

  it("keeps mobile header actions in search, theme, menu order", () => {
    const nav = doc.getElementById("nav");
    const actionIds = [...nav.children]
      .map((element) => element.id)
      .filter((id) => [
        "search-toggle",
        "color-scheme-toggle",
        "nav-toggle",
      ].includes(id));

    assert.deepEqual(actionIds, [
      "search-toggle",
      "color-scheme-toggle",
      "nav-toggle",
    ]);
    assert.equal(
      doc.getElementById("search-toggle").nextElementSibling.id,
      "color-scheme-toggle"
    );
    assert.equal(
      doc.getElementById("color-scheme-toggle").nextElementSibling.id,
      "nav-toggle"
    );
  });

  it("localizes the search, theme, and menu action names", () => {
    const strings = i18n["zh-TW"];
    const primaryNav = doc.querySelector("header nav");
    const search = doc.getElementById("search-toggle");
    const theme = doc.getElementById("color-scheme-toggle");
    const menu = doc.getElementById("nav-toggle");

    assert.equal(primaryNav.getAttribute("aria-label"), strings.primaryNavigation);
    assert.equal(search.getAttribute("aria-label"), strings.search.open);
    assert.equal(search.getAttribute("aria-controls"), "site-search");
    assert.equal(search.getAttribute("aria-haspopup"), "dialog");
    assert.equal(theme.getAttribute("aria-label"), strings.switchToDarkTheme);
    assert.equal(theme.dataset.labelToDark, strings.switchToDarkTheme);
    assert.equal(theme.dataset.labelToLight, strings.switchToLightTheme);
    assert.equal(menu.getAttribute("aria-label"), strings.openMenu);
    assert.equal(menu.dataset.labelOpen, strings.openMenu);
    assert.equal(menu.dataset.labelClose, strings.closeMenu);
  });

  it("uses each emitted page locale for the theme and menu labels", () => {
    for (const [lang, strings] of Object.entries(i18n)) {
      if (lang === "zh-TW") continue;
      const filename = path.join(SITE_ROOT, lang, "index.html");
      if (!fs.existsSync(filename)) continue;

      const html = fs
        .readFileSync(filename, "utf8")
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
      const localized = new JSDOM(html, { virtualConsole: quietConsole }).window.document;
      assert.equal(localized.documentElement.lang, lang);
      assert.equal(
        localized.getElementById("color-scheme-toggle").getAttribute("aria-label"),
        strings.switchToDarkTheme
      );
      assert.equal(
        localized.getElementById("nav-toggle").getAttribute("aria-label"),
        strings.openMenu
      );
      assert.equal(
        localized.getElementById("nav-toggle").dataset.labelClose,
        strings.closeMenu
      );
    }
  });

  it("lists real posts whose generated pages exist", () => {
    const links = [...doc.querySelectorAll(".posts .post-title a")];
    assert.ok(links.length > 0, "Expected at least one post on the homepage");

    for (const link of links) {
      const pathname = new URL(link.href, metadata.url).pathname;
      const output = path.join(SITE_ROOT, pathname, "index.html");
      assert.ok(fs.existsSync(output), `Homepage links to missing output: ${pathname}`);
    }
  });
});
