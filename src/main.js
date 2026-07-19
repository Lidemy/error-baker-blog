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
import { initSiteSearch } from "./search-ui.mjs";
import { normalizeText } from "./search-core.mjs";

const exposed = {};

// ── Umami 北極星事件 ────────────────────────────────────────────────────
// The Umami script is injected by base.njk only when metadata.umami.websiteId
// is set, and readers may block it. Every call MUST go through this guard so
// analytics being absent can never throw or change page behaviour.
function track(name, data) {
  try {
    if (window.umami && typeof window.umami.track === "function") {
      window.umami.track(name, data);
    }
  } catch (e) {}
}

// Generic query-string-synced list filter. A container opts in with
// data-filter-scope="<param>"; its items carry data-filter haystacks and an
// input carries data-filter-input. The current query lives in the URL
// (?<param>=…, replaceState) so a filtered view is copy-paste shareable, and
// any page can reuse the mechanism by adding the attributes.
function initDataFilter() {
  document.querySelectorAll("[data-filter-scope]").forEach(function (scope) {
    var input = scope.querySelector("[data-filter-input]");
    if (!input) return;
    var param = scope.getAttribute("data-filter-scope") || "q";
    var items = [].slice.call(scope.querySelectorAll("[data-filter]"));
    var groups = [].slice.call(scope.querySelectorAll("[data-filter-group]"));
    var empty = scope.querySelector("[data-filter-empty]");

    function apply(raw) {
      var query = normalizeText(raw);
      var shown = 0;
      items.forEach(function (item) {
        var hit =
          !query ||
          normalizeText(item.getAttribute("data-filter")).indexOf(query) !== -1;
        item.hidden = !hit;
        if (hit) shown += 1;
      });
      groups.forEach(function (group) {
        group.hidden = !group.querySelector("[data-filter]:not([hidden])");
      });
      if (empty) empty.hidden = !(query && shown === 0);
    }

    function syncUrl(raw) {
      var url = new URL(location.href);
      if (raw) {
        url.searchParams.set(param, raw);
      } else {
        url.searchParams.delete(param);
      }
      history.replaceState(null, "", url);
    }

    input.addEventListener("input", function () {
      apply(input.value);
      syncUrl(input.value.trim());
    });

    var initial = new URL(location.href).searchParams.get(param);
    if (initial) {
      input.value = initial;
      apply(initial);
    }
  });
}

function initInteractive() {
  initSiteSearch();
  initDataFilter();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initInteractive, { once: true });
} else {
  initInteractive();
}

// Page-language UI strings, injected by base.njk on <dialog id="message">
// (same pattern as the lang-suggest banner's data-strings).
var uiStrings = {};
try {
  uiStrings = JSON.parse(
    document.getElementById("message").getAttribute("data-ui") || "{}"
  );
} catch (e) {}
function ui(key, fallback) {
  return uiStrings[key] || fallback;
}
// Share-link hygiene: strip only known tracking params. Functional params
// (e.g. the data-filter's ?flavor=…) must survive so filtered views stay
// shareable — a blanket `search = ""` here used to wipe them 1s after load.
if (location.search) {
  var TRACKING_PARAMS = /^(utm_|gclid$|fbclid$|ref$)/;
  setTimeout(() => {
    var url = new URL(location.href);
    var dropped = false;
    [...url.searchParams.keys()].forEach(function (key) {
      if (TRACKING_PARAMS.test(key)) {
        url.searchParams.delete(key);
        dropped = true;
      }
    });
    if (dropped) {
      history.replaceState(null, null, url);
    }
  }, 1000)
}

function legacyCopyShareUrl(url) {
  var field = document.createElement("textarea");
  field.value = url;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  var copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {}
  field.remove();
  if (copied) {
    message(ui("linkCopied", "麵包連結已複製"));
  } else {
    window.prompt(ui("copyPrompt", "Copy this link"), url);
  }
}

function copyShareUrl(url) {
  if (!navigator.clipboard) {
    legacyCopyShareUrl(url);
    return;
  }
  navigator.clipboard.writeText(url).then(
    function () {
      message(ui("linkCopied", "麵包連結已複製"));
    },
    function () {
      legacyCopyShareUrl(url);
    }
  );
}

function share(anchor) {
  track("share");
  var url = anchor.getAttribute("data-share-url");
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: url,
    }).catch(function (error) {
      // Closing the native share sheet is an intentional no-op. For actual
      // platform failures, preserve a useful copy fallback.
      if (!error || error.name !== "AbortError") {
        copyShareUrl(url);
      }
    });
  } else {
    copyShareUrl(url);
  }
}
expose("share", share);

function message(msg) {
  var dialog = document.getElementById("message");
  dialog.textContent = msg;
  dialog.setAttribute("open", "");
  setTimeout(function () {
    dialog.removeAttribute("open");
  }, 3000);
}

function prefetch(e) {
  if (e.target.tagName != "A") {
    return;
  }
  if (e.target.origin != location.origin) {
    return;
  }
  /**
   * Return the given url with no fragment
   * @param {string} url potentially containing a fragment
   * @return {string} url without fragment
   */
  const removeUrlFragment = (url) => url.split("#")[0];
  if (removeUrlFragment(window.location.href) === removeUrlFragment(e.target.href)) {
    return;
  }
  var l = document.createElement("link");
  l.rel = "prefetch";
  l.href = e.target.href;
  document.head.appendChild(l);
}
document.documentElement.addEventListener("mouseover", prefetch, {
  capture: true,
  passive: true,
});
document.documentElement.addEventListener("touchstart", prefetch, {
  capture: true,
  passive: true,
});

if (window.ResizeObserver && document.querySelector("header nav #nav")) {
  var progress = document.getElementById("reading-progress");
  var backToTopButton = document.getElementById("back-to-top");
  var readerTools = document.querySelector(".reader-tools");
  var readDoneShown = false;
  // Reading-depth milestones (post pages only). Each fires at most once per
  // pageview; distinct event names keep read-100 directly chartable in Umami.
  var isPostPage = document.body.classList.contains("tmpl-post");
  var readMilestones = [25, 50, 75, 100];
  var readFired = {};

  var timeOfLastScroll = 0;
  var requestedAniFrame = false;
  function scroll() {
    if (!requestedAniFrame) {
      requestAnimationFrame(updateProgress);
      requestedAniFrame = true;
    }
    timeOfLastScroll = Date.now();
  }
  addEventListener("scroll", scroll, { passive: true });

  // The progress bar "bakes" from pale dough to deep ember with reading
  // progress, like watching a loaf brown in the oven (values mirror
  // --gx-c1 → --gx-c4; the dark ramp glows brighter instead).
  var CRUST_LIGHT = [[234, 199, 162], [147, 53, 31]];
  var CRUST_DARK = [[92, 52, 35], [238, 149, 86]];
  function bakeColor(percent) {
    var ramp = document.body.classList.contains("dark")
      ? CRUST_DARK
      : CRUST_LIGHT;
    var from = ramp[0];
    var to = ramp[1];
    var k = percent / 100;
    var rgb = from.map(function (c, i) {
      return Math.round(c + (to[i] - c) * k);
    });
    return "rgb(" + rgb.join(",") + ")";
  }

  var winHeight = 1000;
  var bottom = 10000;
  function updateProgress() {
    requestedAniFrame = false;
    var percent = Math.min(
      (document.scrollingElement.scrollTop / (bottom - winHeight)) * 100,
      100
    );
    progress.style.transform = `translate(-${100 - percent}vw, 0)`;
    progress.style.backgroundColor = bakeColor(percent);
    if (isPostPage) {
      readMilestones.forEach(function (m) {
        if (percent >= m && !readFired[m]) {
          readFired[m] = true;
          track("read-" + m);
        }
      });
    }
    if (backToTopButton) {
      var hideBackToTop =
        document.scrollingElement.scrollTop < winHeight * 1.5;
      backToTopButton.hidden = hideBackToTop;
      if (readerTools) {
        readerTools.hidden = hideBackToTop;
      }
    }
    if (
      percent >= 100 &&
      !readDoneShown &&
      document.body.classList.contains("tmpl-post")
    ) {
      readDoneShown = true;
      var doneMsg = ui("readDone", "");
      if (doneMsg) {
        message(doneMsg);
      }
    }
    if (Date.now() - timeOfLastScroll < 3000) {
      requestAnimationFrame(updateProgress);
      requestedAniFrame = true;
    }
  }

  new ResizeObserver(() => {
    bottom =
      document.scrollingElement.scrollTop +
      document.querySelector("#comments,footer").getBoundingClientRect().top;
    winHeight = window.innerHeight;
    scroll();
  }).observe(document.body);
}

function expose(name, fn) {
  exposed[name] = fn;
}

expose("backToTop", function () {
  // css `scroll-behavior: smooth` animates this (and turns it off under
  // prefers-reduced-motion).
  window.scrollTo(0, 0);
  var homeLink = document.querySelector(".site-title a");
  if (homeLink) {
    homeLink.focus({ preventScroll: true });
  }
});

// Clicking a heading's "#" anchor copies the section link. Default hash
// navigation still happens, so the URL bar reflects what was copied.
addEventListener("click", function (e) {
  var anchor = e.target.closest("a.direct-link");
  if (!anchor || !navigator.clipboard) {
    return;
  }
  navigator.clipboard.writeText(
    location.origin + location.pathname + anchor.getAttribute("href")
  );
  message(ui("anchorCopied", "段落連結已複製 🔗"));
});

// Delegated analytics for server-rendered links (no inline scripts in
// templates): the header language switcher and the footer feed icon. Umami's
// tracker sends with keepalive, so counting right before navigation is safe.
addEventListener("click", function (e) {
  var langLink = e.target.closest("a.lang-switch__item");
  if (langLink) {
    track("lang-switch", { lang: langLink.getAttribute("hreflang") || "" });
    return;
  }
  if (e.target.closest("a#rss")) {
    track("feed-click");
  }
});

addEventListener("click", (e) => {
  const handler = e.target.closest("[on-click]");
  if (!handler) {
    return;
  }
  e.preventDefault();
  const name = handler.getAttribute("on-click");
  const fn = exposed[name];
  if (!fn) {
    throw new Error("Unknown handler" + name);
  }
  fn(handler);
});

// There is a race condition here if an image loads faster than this JS file. But
// - that is unlikely
// - it only means potentially more costly layouts for that image.
// - And so it isn't worth the querySelectorAll it would cost to synchronously check
//   load state.
document.body.addEventListener(
  "load",
  (e) => {
    if (e.target.tagName != "IMG") {
      return;
    }
    // Ensure the browser doesn't try to draw the placeholder when the real image is present.
    e.target.style.backgroundImage = "none";
  },
  /* capture */ "true"
);

// ── Locale-suggestion banner ─────────────────────────────────────────────
// The banner <aside id="lang-suggest"> is server-rendered (hidden) by
// base.njk. When this page has a translated version that matches the
// reader's preferred languages better than the current one, reveal it with
// a link — never auto-redirect (hreflang/SEO stays intact). The available
// versions are read from the hreflang alternates already in <head>, so this
// works on any page and never fires where no translation exists.
(function () {
  var banner = document.getElementById("lang-suggest");
  if (!banner || !navigator.languages) return;
  try {
    if (localStorage.getItem("langSuggestDismissed")) return;
  } catch (e) {
    return;
  }
  var strings;
  try {
    strings = JSON.parse(banner.getAttribute("data-strings") || "{}");
  } catch (e) {
    return;
  }
  var alternates = {};
  [].forEach.call(
    document.querySelectorAll('link[rel="alternate"][hreflang]'),
    function (link) {
      var code = link.getAttribute("hreflang");
      if (code && code !== "x-default") {
        alternates[code.toLowerCase()] = {
          code: code,
          href: link.getAttribute("href"),
        };
      }
    }
  );
  // Map a BCP-47 preference onto the site's language codes. Chinese needs
  // script awareness: Traditional regions/scripts → zh-TW, Simplified → zh-CN.
  function candidatesFor(pref) {
    var p = pref.toLowerCase();
    if (p === "zh" || p === "zh-tw" || p === "zh-hant" || p === "zh-hk" || p === "zh-mo") {
      return ["zh-tw"];
    }
    if (p === "zh-cn" || p === "zh-hans" || p === "zh-sg" || p === "zh-my") {
      return ["zh-cn"];
    }
    return [p, p.split("-")[0]];
  }
  var pageLang = (document.documentElement.lang || "").toLowerCase();
  var prefs = navigator.languages;
  var match = null;
  for (var i = 0; i < prefs.length && !match; i++) {
    var cands = candidatesFor(prefs[i]);
    for (var j = 0; j < cands.length && !match; j++) {
      if (cands[j] === pageLang) return; // current page already fits best
      if (alternates[cands[j]]) match = alternates[cands[j]];
    }
  }
  if (!match) return;
  var s = strings[match.code];
  if (!s || !s.available || !s.read) return;
  banner.setAttribute("lang", match.code);
  banner.querySelector(".lang-suggest__text").textContent = s.available;
  var link = banner.querySelector(".lang-suggest__link");
  link.textContent = s.read;
  link.href = match.href;
  link.setAttribute("hreflang", match.code);
  link.setAttribute("lang", match.code);
  var dismiss = banner.querySelector(".lang-suggest__dismiss");
  if (s.dismiss) dismiss.setAttribute("aria-label", s.dismiss);
  dismiss.addEventListener("click", function () {
    banner.hidden = true;
    try {
      localStorage.setItem("langSuggestDismissed", "1");
    } catch (e) {}
  });
  banner.hidden = false;
})();

// ── Table of contents (post pages) + scroll-spy ─────────────────────────
// The TOC <nav id="toc"> is rendered (empty) by post.njk so its styles survive
// PurgeCSS. We populate it from the article's heading anchors (which already
// have ids from markdown-it-anchor). Manually-authored headings such as the
// "About the author" section have no id and are intentionally skipped.
(function () {
  var toc = document.getElementById("toc");
  if (!toc) return;
  var article = document.querySelector("main > article");
  var list = toc.querySelector(".toc-list");
  if (!article || !list) return;
  var headings = [].slice.call(article.querySelectorAll("h2[id], h3[id]"));
  if (headings.length < 2) {
    // Nothing worth a TOC. It is display:none, so removing it shifts nothing.
    toc.parentNode && toc.parentNode.removeChild(toc);
    return;
  }
  var byId = {};
  headings.forEach(function (h) {
    var li = document.createElement("li");
    li.className = h.tagName === "H3" ? "toc-h3" : "toc-h2";
    var a = document.createElement("a");
    a.href = "#" + h.id;
    a.textContent = (h.textContent || "").replace(/^#+\s*/, "").trim();
    li.appendChild(a);
    list.appendChild(li);
    byId[h.id] = a;
  });
  // CSS reveals .toc.toc-ready only on >=1024px (desktop sidebar); on smaller
  // screens it stays hidden, avoiding a bottom-of-page TOC and any layout shift.
  toc.classList.add("toc-ready");

  if ("IntersectionObserver" in window) {
    var current = null;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          if (current) current.classList.remove("active");
          current = byId[e.target.id];
          if (current) current.classList.add("active");
        });
      },
      { rootMargin: "0px 0px -75% 0px", threshold: 0 }
    );
    headings.forEach(function (h) {
      io.observe(h);
    });
  }
})();

// ── Copy-code button (post code blocks) ─────────────────────────────────
// Prism renders fenced blocks as <pre class="language-*"><code>…</code></pre>.
// We wrap each in a positioned container and inject a copy button. The
// injected classes (code-copy*) are whitelisted in _11ty/optimize-html.js —
// PurgeCSS scans only server-rendered HTML and would otherwise strip their
// styles. Feedback reuses the shared #message toast (role="status").
(function () {
  if (!document.body.classList.contains("tmpl-post")) return;
  var blocks = document.querySelectorAll("pre[class*='language-']");
  if (!blocks.length) return;

  var LABEL_COPY = ui("codeCopy", "複製");
  var LABEL_DONE = ui("codeCopied", "已複製 ✓");
  var ARIA_LABEL = ui("codeCopyLabel", "複製程式碼");

  function legacyCopy(text) {
    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    var copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (e) {}
    field.remove();
    return copied;
  }

  [].forEach.call(blocks, function (pre) {
    // Defensive against a double init: never wrap the same block twice.
    if (pre.parentNode && pre.parentNode.classList.contains("code-copy-wrap")) {
      return;
    }
    var wrap = document.createElement("div");
    wrap.className = "code-copy-wrap";
    pre.parentNode.insertBefore(wrap, pre);
    wrap.appendChild(pre);

    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "code-copy";
    btn.textContent = LABEL_COPY;
    btn.setAttribute("aria-label", ARIA_LABEL);
    wrap.appendChild(btn);

    var resetTimer = null;
    btn.addEventListener("click", function () {
      var code = pre.querySelector("code");
      var text = (code || pre).textContent;
      function onCopied() {
        track("copy-code");
        message(LABEL_DONE);
        btn.textContent = LABEL_DONE;
        btn.classList.add("code-copy--done");
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          btn.textContent = LABEL_COPY;
          btn.classList.remove("code-copy--done");
        }, 2000);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(onCopied, function () {
          if (legacyCopy(text)) onCopied();
        });
      } else if (legacyCopy(text)) {
        onCopied();
      }
    });
  });
})();

// ── Front-end error beacon ──────────────────────────────────────────────
// Report uncaught errors and unhandled promise rejections to a Netlify
// function via sendBeacon (fire-and-forget; survives the page unloading).
// We send only technical fields — no PII. Cross-origin "Script error." is
// opaque and useless, so it is dropped. Reports are deduped per session and
// capped per pageview so a looping error can't flood the sink.
(function () {
  if (!navigator.sendBeacon) return;
  var ENDPOINT = "/.netlify/functions/error-log";
  var MAX_PER_PAGEVIEW = 5;
  var STACK_MAX = 2000;
  var sent = 0;
  var seen = {};

  function truncate(s, n) {
    if (typeof s !== "string") return "";
    return s.length > n ? s.slice(0, n) : s;
  }

  function report(payload) {
    if (sent >= MAX_PER_PAGEVIEW) return;
    var key = payload.message + "|" + payload.source + "|" + payload.line;
    if (seen[key]) return;
    seen[key] = true;
    sent++;
    try {
      var blob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      navigator.sendBeacon(ENDPOINT, blob);
    } catch (e) {}
  }

  addEventListener("error", function (e) {
    // Cross-origin script errors are reported opaquely as "Script error."
    // with no usable source — nothing actionable, so drop them. Resource
    // load failures (img/script) fire without e.error and e.lineno; skip
    // those too, we only want script exceptions.
    if (!e.message || e.message === "Script error.") return;
    if (!e.error && !e.lineno) return;
    report({
      message: truncate(e.message, 500),
      source: truncate(e.filename || "", 500),
      line: e.lineno || 0,
      col: e.colno || 0,
      stack: truncate((e.error && e.error.stack) || "", STACK_MAX),
      path: location.pathname,
      ua: truncate(navigator.userAgent, 300),
    });
  });

  addEventListener("unhandledrejection", function (e) {
    var reason = e.reason;
    var msg = reason && reason.message ? reason.message : String(reason);
    report({
      message: truncate("Unhandled rejection: " + msg, 500),
      source: "",
      line: 0,
      col: 0,
      stack: truncate((reason && reason.stack) || "", STACK_MAX),
      path: location.pathname,
      ua: truncate(navigator.userAgent, 300),
    });
  });
})();
