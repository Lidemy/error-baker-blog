"use strict";

const assert = require("assert").strict;
const fs = require("fs");
const path = require("path");
const nunjucks = require("nunjucks");
const { JSDOM, VirtualConsole } = require("jsdom");
// jsdom 15 reports modern CSS syntax (for example color-mix()) as parse
// warnings; route them into a muted VirtualConsole to keep test output clean.
const quietConsole = new VirtualConsole();
const rssPlugin = require("@11ty/eleventy-plugin-rss");
const metadata = require("../_data/metadata.json");
const i18n = require("../_data/i18n.json");
const langs = require("../_data/langs.json");
const {
  feedPublishedDate,
  feedModifiedDate,
  feedUpdatedDate,
} = require("../_11ty/feed-data");

const PROJECT_ROOT = path.resolve(__dirname, "..");
const SITE_ROOT = path.join(PROJECT_ROOT, "_site");
const RFC3339 = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

function absoluteHttpUrl(value, label) {
  let parsed;
  assert.doesNotThrow(() => {
    parsed = new URL(value);
  }, `${label} must be an absolute URL: ${value}`);
  assert.ok(
    parsed.protocol === "http:" || parsed.protocol === "https:",
    `${label} must use HTTP(S): ${value}`
  );
}

function assertRfc3339(value, label) {
  assert.match(value, RFC3339, `${label} must be an RFC 3339 UTC timestamp`);
  assert.ok(Number.isFinite(Date.parse(value)), `${label} must be parseable`);
}

function assertAbsoluteContentUrls(html, label) {
  const doc = new JSDOM(`<body>${html}</body>`, { virtualConsole: quietConsole }).window.document;
  for (const element of doc.querySelectorAll("[href],[src],[poster],[srcset]")) {
    for (const attribute of ["href", "src", "poster"]) {
      if (!element.hasAttribute(attribute)) continue;
      const value = element.getAttribute(attribute);
      let parsed;
      assert.doesNotThrow(() => {
        parsed = new URL(value);
      }, `${label} has a relative ${attribute}: ${value}`);
      assert.ok(
        ["http:", "https:", "mailto:", "tel:", "data:"].includes(parsed.protocol),
        `${label} has an unsupported ${attribute}: ${value}`
      );
    }

    if (element.hasAttribute("srcset")) {
      for (const candidate of element.getAttribute("srcset").split(",")) {
        const value = candidate.trim().split(/\s+/, 1)[0];
        absoluteHttpUrl(value, `${label} srcset`);
      }
    }
  }
}

function outputForUrl(urlString) {
  const pathname = decodeURIComponent(new URL(urlString).pathname);
  return path.join(SITE_ROOT, pathname, "index.html");
}

function pathsForLang(lang) {
  const prefix = lang === "zh-TW" ? "" : lang;
  return {
    atom: path.join(SITE_ROOT, prefix, "feed", "feed.xml"),
    json: path.join(SITE_ROOT, prefix, "feed", "feed.json"),
    home: path.join(SITE_ROOT, prefix, "index.html"),
    atomUrl:
      lang === "zh-TW"
        ? `${metadata.url}/feed/feed.xml`
        : `${metadata.url}/${lang}/feed/feed.xml`,
    jsonUrl:
      lang === "zh-TW"
        ? `${metadata.url}/feed/feed.json`
        : `${metadata.url}/${lang}/feed/feed.json`,
    homeUrl: lang === "zh-TW" ? `${metadata.url}/` : `${metadata.url}/${lang}/`,
  };
}

function validateFeedPair(lang, files) {
  const atomRaw = fs.readFileSync(files.atom, "utf8");
  assert.equal(atomRaw[0], "<", `${files.atom} must start with its XML declaration`);
  const atom = new JSDOM(atomRaw, { contentType: "text/xml" }).window.document;
  const json = JSON.parse(fs.readFileSync(files.json, "utf8"));
  const entries = [...atom.querySelectorAll("entry")];

  assert.equal(atom.documentElement.localName, "feed");
  assert.equal(atom.documentElement.namespaceURI, "http://www.w3.org/2005/Atom");
  assert.equal(atom.documentElement.getAttribute("xml:lang"), lang);
  assert.equal(atom.querySelector("feed > title").textContent, i18n[lang].siteName);
  assert.equal(atom.querySelector("link[rel='self']").getAttribute("href"), files.atomUrl);
  assert.equal(
    atom.querySelector("link[rel='alternate']").getAttribute("href"),
    files.homeUrl
  );
  assert.equal(atom.querySelectorAll("email").length, 0, "Do not emit an empty email");

  assert.equal(json.version, "https://jsonfeed.org/version/1.1");
  assert.equal(json.title, i18n[lang].siteName);
  assert.equal(json.language, lang);
  assert.equal(json.feed_url, files.jsonUrl);
  assert.equal(json.home_page_url, files.homeUrl);
  absoluteHttpUrl(json.icon, "feed icon URL");
  assert.ok(Array.isArray(json.authors) && json.authors.length > 0);
  for (const author of json.authors) absoluteHttpUrl(author.url, "feed author URL");

  assert.ok(entries.length > 0, `${lang} Atom feed must contain entries`);
  assert.equal(entries.length, json.items.length);
  assert.ok(entries.length <= metadata.feed.limit);

  const atomIds = entries.map((entry) => entry.querySelector("id").textContent);
  const jsonIds = json.items.map((item) => item.id);
  assert.deepEqual(atomIds, jsonIds, "Atom and JSON Feed order must match");
  assert.equal(new Set(atomIds).size, atomIds.length, "Feed IDs must be unique");

  const expectedPrefix =
    lang === "zh-TW" ? `${metadata.url}/posts/` : `${metadata.url}/${lang}/posts/`;
  const modifiedTimes = [];
  entries.forEach((entry, index) => {
    const item = json.items[index];
    const id = atomIds[index];
    assert.ok(id.startsWith(expectedPrefix), `${id} leaked into the ${lang} feed`);
    absoluteHttpUrl(id, "entry ID");
    assert.ok(fs.existsSync(outputForUrl(id)), `Feed links missing output: ${id}`);

    const atomPublished = entry.querySelector("published").textContent;
    const atomModified = entry.querySelector("updated").textContent;
    assert.equal(item.url, id);
    assert.equal(item.language, lang);
    assert.equal(item.date_published, atomPublished);
    assert.equal(item.date_modified, atomModified);
    assertRfc3339(atomPublished, `${id} published`);
    assertRfc3339(atomModified, `${id} updated`);
    assert.ok(Date.parse(atomModified) >= Date.parse(atomPublished));
    modifiedTimes.push(Date.parse(atomModified));

    for (const author of item.authors || []) {
      absoluteHttpUrl(author.url, `${id} author URL`);
    }
    if (item.image) absoluteHttpUrl(item.image, `${id} image URL`);
    assertAbsoluteContentUrls(
      entry.querySelector("content").textContent,
      `${id} Atom content`
    );
    assertAbsoluteContentUrls(item.content_html, `${id} JSON content`);
  });

  for (let index = 1; index < modifiedTimes.length; index += 1) {
    assert.ok(modifiedTimes[index - 1] >= modifiedTimes[index]);
  }
  const newestModified = Math.max(...modifiedTimes);
  const atomUpdated = atom.querySelector("feed > updated").textContent;
  assertRfc3339(atomUpdated, `${lang} feed updated`);
  assert.equal(Date.parse(atomUpdated), newestModified);
}

function createFeedEnvironment() {
  const env = new nunjucks.Environment(
    new nunjucks.FileSystemLoader(path.join(PROJECT_ROOT, "_includes")),
    { autoescape: true }
  );
  env.addFilter("url", (value) => value);
  env.addFilter("absoluteUrl", rssPlugin.absoluteUrl);
  env.addFilter("dateToRfc3339", rssPlugin.dateToRfc3339);
  env.addFilter("dump", JSON.stringify);
  env.addFilter("feedPublishedDate", feedPublishedDate);
  env.addFilter("feedModifiedDate", feedModifiedDate);
  env.addFilter("feedUpdatedDate", feedUpdatedDate);
  env.addFilter(
    "authorUrlForLang",
    (_pages, lang, author) => `/${lang}/posts/${author}/`
  );
  env.addFilter(
    "htmlToAbsoluteUrls",
    (html, base, callback) => {
      rssPlugin.convertHtmlToAbsoluteUrls(html, base).then(
        (value) => callback(null, value),
        (error) => callback(error)
      );
    },
    true
  );
  return env;
}

function render(env, template, context) {
  return new Promise((resolve, reject) => {
    env.render(template, context, (error, output) => {
      if (error) reject(error);
      else resolve(output);
    });
  });
}

describe("syndication feed output", () => {
  it("emits matching, valid, language-isolated Atom and JSON feeds", () => {
    let validated = 0;
    for (const lang of langs) {
      const files = pathsForLang(lang);
      if (!fs.existsSync(files.atom)) continue;
      assert.ok(fs.existsSync(files.json), `${lang} is missing its JSON Feed`);
      validateFeedPair(lang, files);
      validated += 1;
    }
    assert.ok(validated >= 1, "The source-language feeds must always exist");
  });

  it("advertises both feed formats for each generated language home", () => {
    for (const lang of langs) {
      const files = pathsForLang(lang);
      if (!fs.existsSync(files.home)) continue;
      const doc = new JSDOM(fs.readFileSync(files.home, "utf8"), { virtualConsole: quietConsole }).window.document;
      const atom = doc.querySelectorAll(
        "link[rel='alternate'][type='application/atom+xml']"
      );
      const json = doc.querySelectorAll(
        "link[rel='alternate'][type='application/feed+json']"
      );
      assert.equal(atom.length, 1);
      assert.equal(json.length, 1);
      assert.equal(
        new URL(atom[0].getAttribute("href"), metadata.url).href,
        files.atomUrl
      );
      assert.equal(
        new URL(json[0].getAttribute("href"), metadata.url).href,
        files.jsonUrl
      );
    }
  });

  it("declares deploy-time MIME types for both root and localized feeds", () => {
    const headers = fs.readFileSync(path.join(SITE_ROOT, "_headers"), "utf8");
    assert.match(headers, /\/feed\/feed\.xml[\s\S]*application\/atom\+xml/);
    assert.match(headers, /\/:lang\/feed\/feed\.xml[\s\S]*application\/atom\+xml/);
    assert.match(headers, /\/feed\/feed\.json[\s\S]*application\/feed\+json/);
    assert.match(headers, /\/:lang\/feed\/feed\.json[\s\S]*application\/feed\+json/);
  });

  it("renders a localized old-work/new-version fixture without escaped URLs", async () => {
    const env = createFeedEnvironment();
    const fixture = {
      url: "/en/posts/sixwings/beginner's-guide/",
      date: new Date("2021-08-07T00:00:00.000Z"),
      data: {
        title: 'Rock & "Roll"',
        author: "sixwings",
        publishedAt: "2026-07-13",
        updatedAt: "2026-07-14",
      },
      templateContent: '<p><a href="/docs/">Docs</a><img src="./hero.png"></p>',
    };
    const base = {
      feedLang: "en",
      feedPosts: [fixture],
      feedTitle: "Site & Feed",
      feedDescription: "English description",
      feedHomeUrl: "https://example.test/en/",
      feedId: "https://example.test/en/",
      metadata: {
        url: "https://example.test",
        publisher: { name: "Publisher", logo: "/logo.png" },
        authors: { sixwings: { name: "Six & Wings" } },
      },
      collections: { authorLangPages: [] },
      googleanalytics: "",
    };

    const atomRaw = await render(env, "feeds/atom.njk", {
      ...base,
      feedSelfUrl: "https://example.test/en/feed/feed.xml",
    });
    const jsonRaw = await render(env, "feeds/json.njk", {
      ...base,
      feedSelfUrl: "https://example.test/en/feed/feed.json",
    });
    const atom = new JSDOM(atomRaw, { contentType: "text/xml" }).window.document;
    const json = JSON.parse(jsonRaw);
    const expectedUrl = "https://example.test/en/posts/sixwings/beginner's-guide/";

    assert.equal(atom.documentElement.getAttribute("xml:lang"), "en");
    assert.equal(atom.querySelector("entry > id").textContent, expectedUrl);
    assert.equal(atom.querySelector("entry > title").textContent, 'Rock & "Roll"');
    assert.equal(atom.querySelector("published").textContent, "2026-07-13T00:00:00Z");
    assert.equal(atom.querySelector("entry > updated").textContent, "2026-07-14T00:00:00Z");
    assert.doesNotMatch(atomRaw, /&amp;#39;/);
    assertAbsoluteContentUrls(atom.querySelector("content").textContent, "fixture Atom");

    assert.equal(json.language, "en");
    assert.equal(json.items[0].id, expectedUrl);
    assert.equal(json.items[0].title, 'Rock & "Roll"');
    assert.equal(json.items[0].date_published, "2026-07-13T00:00:00Z");
    assert.equal(json.items[0].date_modified, "2026-07-14T00:00:00Z");
    assertAbsoluteContentUrls(json.items[0].content_html, "fixture JSON");
  });
});
