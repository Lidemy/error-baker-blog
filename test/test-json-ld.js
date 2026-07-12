"use strict";

const assert = require("assert").strict;
const { validateJsonLd } = require("../_11ty/json-ld");

function article(overrides = {}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Example article",
    inLanguage: "en",
    image: ["https://example.test/article.png"],
    author: {
      "@type": "Person",
      name: "Example Author",
      url: "https://example.test/authors/example/",
    },
    publisher: {
      "@type": "Organization",
      name: "Example Publisher",
      url: "https://example.test",
      logo: {
        "@type": "ImageObject",
        url: "https://example.test/logo.png",
      },
    },
    url: "https://example.test/posts/example/",
    mainEntityOfPage: "https://example.test/posts/example/",
    datePublished: "2026-07-13",
    dateModified: "2026-07-13",
    ...overrides,
  };
}

function block(value) {
  return `<script type="application/ld+json">${JSON.stringify(value)}</script>`;
}

describe("JSON-LD output validator", () => {
  it("returns valid final HTML byte-for-byte without rewriting images", () => {
    const html = `<!doctype html><main><img src="/decorative.png"></main>${block(
      article()
    )}`;
    assert.equal(validateJsonLd(html, "_site/posts/example/index.html"), html);
  });

  it("validates every JSON-LD block and reports the output path", () => {
    const html = `${block({ "@type": "BreadcrumbList" })}<script type="application/ld+json">{broken</script>`;
    assert.throws(
      () => validateJsonLd(html, "_site/posts/broken/index.html"),
      /Invalid JSON-LD in _site\/posts\/broken\/index\.html \(block 2\)/
    );
  });

  it("rejects invalid Article URLs, images, dates, or placeholder genre", () => {
    const html = block(
      article({
        image: ["/relative.png", "https://example.test/extra.png"],
        dateModified: "2026-07-12",
        genre: "Insert a schema.org genre",
      })
    );
    assert.throws(
      () => validateJsonLd(html, "_site/posts/invalid/index.html"),
      /image must contain exactly one absolute.*dateModified cannot be before.*genre must not be emitted/
    );
  });

  it("ignores non-HTML output and pages without structured data", () => {
    assert.equal(validateJsonLd("feed", "_site/feed/feed.xml"), "feed");
    const html = "<!doctype html><p>No structured data</p>";
    assert.equal(validateJsonLd(html, "_site/about/index.html"), html);
  });
});
