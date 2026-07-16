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
const exposed = {};

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
if (location.search) {
  var a = document.createElement("a");
  a.href = location.href;
  a.search = "";
  setTimeout(() => {
    history.replaceState(null, null, a.href);
  }, 1000)
}

function tweet_(url) {
  open(
    "https://twitter.com/intent/tweet?url=" + encodeURIComponent(url),
    "_blank"
  );
}
function tweet(anchor) {
  tweet_(anchor.getAttribute("href"));
}
expose("tweet", tweet);

function share(anchor) {
  var url = anchor.getAttribute("href");
  event.preventDefault();
  if (navigator.share) {
    navigator.share({
      url: url,
    });
  } else if (navigator.clipboard) {
    navigator.clipboard.writeText(url);
    message(ui("linkCopied", "文章連結已複製"));
  } else {
    tweet_(url);
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

const GA_ID = document.documentElement.getAttribute("ga-id");
window.ga =
  window.ga ||
  function () {
    if (!GA_ID) {
      return;
    }
    (ga.q = ga.q || []).push(arguments);
  };
ga.l = +new Date();
ga("create", GA_ID, "auto");
ga("set", "transport", "beacon");
var timeout = setTimeout(
  (onload = function () {
    clearTimeout(timeout);
    ga("send", "pageview");
  }),
  1000
);

var ref = +new Date();
function ping(event) {
  var now = +new Date();
  if (now - ref < 1000) {
    return;
  }
  ga("send", {
    hitType: "event",
    eventCategory: "page",
    eventAction: event.type,
    eventLabel: Math.round((now - ref) / 1000),
  });
  ref = now;
}
addEventListener("pagehide", ping);
addEventListener("visibilitychange", ping);

/**
 * Injects a script into document.head
 * @param {string} src path of script to be injected in <head>
 * @return {Promise} Promise object that resolves on script load event
 */
const dynamicScriptInject = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.type = "text/javascript";
    document.head.appendChild(script);
    script.addEventListener("load", () => {
      resolve(script);
    });
  });
};

// Script web-vitals.js will be injected dynamically if user opts-in to sending CWV data.
const sendWebVitals = document.currentScript.getAttribute("data-cwv-src");

if (/web-vitals.js/.test(sendWebVitals)) {
  dynamicScriptInject(`${window.location.origin}/js/web-vitals.js`)
    .then(() => {
      webVitals.getCLS(sendToGoogleAnalytics);
      webVitals.getFID(sendToGoogleAnalytics);
      webVitals.getLCP(sendToGoogleAnalytics);
    })
    .catch((error) => {
      console.error(error);
    });
}

addEventListener(
  "click",
  function (e) {
    var button = e.target.closest("button");
    if (!button) {
      return;
    }
    ga("send", {
      hitType: "event",
      eventCategory: "button",
      eventAction: button.getAttribute("aria-label") || button.textContent,
    });
  },
  true
);
var selectionTimeout;
addEventListener(
  "selectionchange",
  function () {
    clearTimeout(selectionTimeout);
    var text = String(document.getSelection()).trim();
    if (text.split(/[\s\n\r]+/).length < 3) {
      return;
    }
    selectionTimeout = setTimeout(function () {
      ga("send", {
        hitType: "event",
        eventCategory: "selection",
        eventAction: text,
      });
    }, 2000);
  },
  true
);

if (window.ResizeObserver && document.querySelector("header nav #nav")) {
  var progress = document.getElementById("reading-progress");
  var backToTopButton = document.getElementById("back-to-top");
  var readDoneShown = false;

  var timeOfLastScroll = 0;
  var requestedAniFrame = false;
  function scroll() {
    if (!requestedAniFrame) {
      requestAnimationFrame(updateProgress);
      requestedAniFrame = true;
    }
    timeOfLastScroll = Date.now();
  }
  addEventListener("scroll", scroll);

  // The progress bar "bakes": its crust colour deepens with reading progress
  // (quantities use the crust scale; both ends stay legible on paper/ink).
  var CRUST_LIGHT = [[217, 164, 65], [124, 74, 30]];
  var CRUST_DARK = [[110, 82, 44], [201, 150, 61]];
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
    if (backToTopButton) {
      backToTopButton.hidden =
        document.scrollingElement.scrollTop < winHeight * 1.5;
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
