import { makeSnippet, normalizeText, searchIndex } from "./search-core.mjs";

const MIN_QUERY_LENGTH = 2;
const SEARCH_DELAY_MS = 140;

function replaceToken(value, token, replacement) {
  return String(value || "").split(`{${token}}`).join(String(replacement));
}

function internalUrl(value) {
  try {
    const url = new URL(value, window.location.origin);
    if (url.origin !== window.location.origin) return "";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch (error) {
    return "";
  }
}

function imageUrl(value) {
  try {
    const url = new URL(value, window.location.origin);
    return url.protocol === "https:" || url.origin === window.location.origin
      ? url.href
      : "";
  } catch (error) {
    return "";
  }
}

function languageName(code, displayLocale) {
  try {
    return new Intl.DisplayNames([displayLocale], { type: "language" }).of(code) || code;
  } catch (error) {
    return code;
  }
}

function formattedDate(value, locale) {
  if (!value) return "";
  try {
    return new Intl.DateTimeFormat(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${value}T00:00:00Z`));
  } catch (error) {
    return value;
  }
}

export function initSiteSearch() {
  const dialog = document.getElementById("site-search");
  const toggle = document.getElementById("search-toggle");
  if (!dialog || !toggle) return;

  const input = dialog.querySelector("#search-input");
  const form = dialog.querySelector(".search-form");
  const closeButton = dialog.querySelector(".search-dialog__close");
  const clearButton = dialog.querySelector(".search-form__clear");
  const retryButton = dialog.querySelector(".search-retry");
  const body = dialog.querySelector(".search-dialog__body");
  const status = dialog.querySelector("#search-status");
  const resultsRoot = dialog.querySelector("#search-results");
  const fallback = dialog.querySelector(".search-fallback");
  const emptyTitle = dialog.querySelector(".search-empty__title");
  const emptyBody = dialog.querySelector(".search-empty__body");
  const articleTemplate = dialog.querySelector("#search-article-template");
  const authorTemplate = dialog.querySelector("#search-author-template");
  const shortcut = dialog.querySelector(".search-form__shortcut");
  const groups = {
    articles: dialog.querySelector(".search-group--articles"),
    authors: dialog.querySelector(".search-group--authors"),
    other: dialog.querySelector(".search-group--other"),
  };
  const lists = {
    articles: dialog.querySelector(".search-result-list--articles"),
    authors: dialog.querySelector(".search-result-list--authors"),
    other: dialog.querySelector(".search-result-list--other"),
  };
  const states = {
    idle: dialog.querySelector(".search-state--idle"),
    loading: dialog.querySelector(".search-state--loading"),
    empty: dialog.querySelector(".search-state--empty"),
    error: dialog.querySelector(".search-state--error"),
  };

  if (!input || !form || !articleTemplate || !authorTemplate) return;

  let strings = {};
  try {
    strings = JSON.parse(dialog.getAttribute("data-i18n") || "{}");
  } catch (error) {}

  const locale = dialog.getAttribute("data-lang") || "zh-TW";
  const indexUrl = dialog.getAttribute("data-index-url") || "/search-index.json";
  let indexPromise = null;
  let searchTimer = 0;
  let searchSequence = 0;
  let restoreFocus = toggle;

  if (shortcut) {
    shortcut.textContent = /Mac|iPhone|iPad/.test(navigator.platform || "")
      ? "⌘K"
      : "Ctrl K";
  }

  function setState(name) {
    Object.keys(states).forEach((key) => {
      if (states[key]) states[key].hidden = key !== name;
    });
    resultsRoot.hidden = name !== "results";
    body.setAttribute("aria-busy", String(name === "loading"));
  }

  function clearResults() {
    Object.values(lists).forEach((list) => list.replaceChildren());
    Object.values(groups).forEach((group) => {
      group.hidden = true;
    });
    fallback.hidden = true;
  }

  function loadIndex(force) {
    if (force) indexPromise = null;
    if (!indexPromise) {
      indexPromise = fetch(indexUrl, {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      }).then((response) => {
        if (!response.ok) throw new Error(`Search index: ${response.status}`);
        return response.json();
      });
    }
    return indexPromise;
  }

  async function retryIndex() {
    const sequence = ++searchSequence;
    setState("loading");
    status.textContent = strings.loading || "";
    try {
      await loadIndex(true);
      if (sequence !== searchSequence) return;
      if (input.value.trim()) runSearch(false);
      else {
        status.textContent = "";
        setState("idle");
      }
    } catch (error) {
      if (sequence !== searchSequence) return;
      indexPromise = null;
      status.textContent = strings.errorTitle || "";
      setState("error");
    }
  }

  function matchReason(field) {
    const key = {
      title: "matchTitle",
      tag: "matchTag",
      author: "matchAuthor",
      heading: "matchHeading",
      description: "matchDescription",
      content: "matchContent",
      slug: "matchSlug",
      year: "matchYear",
    }[field];
    return key ? strings[key] || "" : "";
  }

  function renderArticle(result, list) {
    const article = result.item;
    const href = internalUrl(article.url);
    if (!href) return;
    const fragment = articleTemplate.content.cloneNode(true);
    const link = fragment.querySelector("a");
    const lang = fragment.querySelector(".search-result__lang");
    link.href = href;
    fragment.querySelector(".search-result__title").textContent = article.title;
    lang.textContent = article.lang === locale
      ? ""
      : languageName(article.lang, locale);
    lang.hidden = article.lang === locale;

    const meta = [
      article.author && article.author.name,
      formattedDate(article.published, locale),
      (article.tags || []).slice(0, 3).join(" · "),
    ].filter(Boolean);
    fragment.querySelector(".search-result__meta").textContent = meta.join("  ·  ");
    fragment.querySelector(".search-result__snippet").textContent =
      makeSnippet(article, input.value, 170);
    fragment.querySelector(".search-result__reason").textContent =
      matchReason(result.matchedField);
    list.appendChild(fragment);
  }

  function authorUrl(author) {
    return internalUrl(
      (author.urls && author.urls[locale]) ||
      (author.urls && author.urls["zh-TW"]) ||
      Object.values(author.urls || {})[0] ||
      ""
    );
  }

  function renderAuthor(result) {
    const author = result.item;
    const href = authorUrl(author);
    if (!href) return;
    const fragment = authorTemplate.content.cloneNode(true);
    const link = fragment.querySelector("a");
    const avatar = fragment.querySelector("img");
    const avatarSource = imageUrl(author.avatar);
    link.href = href;
    fragment.querySelector(".search-result__title").textContent = author.name;
    if (avatarSource) {
      avatar.src = avatarSource;
    } else {
      avatar.remove();
    }
    const count = replaceToken(strings.authorPostCount, "count", author.postCount);
    const topics = (author.topics || []).slice(0, 3).join(" · ");
    fragment.querySelector(".search-result__meta").textContent =
      [count, topics].filter(Boolean).join("  ·  ");
    fragment.querySelector(".search-result__snippet").textContent =
      (author.bios && (author.bios[locale] || author.bios["zh-TW"])) || "";
    lists.authors.appendChild(fragment);
  }

  function renderResults(found, query) {
    clearResults();
    found.articles.forEach((result) => renderArticle(result, lists.articles));
    found.authors.forEach(renderAuthor);
    found.otherArticles.forEach((result) => renderArticle(result, lists.other));

    groups.articles.hidden = !lists.articles.children.length;
    groups.authors.hidden = !lists.authors.children.length;
    groups.other.hidden = !lists.other.children.length;
    fallback.hidden = Boolean(lists.articles.children.length) ||
      !lists.other.children.length;

    const renderedCount = dialog.querySelectorAll(".search-result__link").length;
    if (!renderedCount) {
      emptyTitle.textContent = replaceToken(strings.noResultsTitle, "query", query);
      emptyBody.textContent = strings.noResultsBody || "";
      status.textContent = emptyTitle.textContent;
      setState("empty");
      return;
    }
    status.textContent = replaceToken(strings.resultCount, "count", renderedCount);
    setState("results");
  }

  async function runSearch(forceReload) {
    const sequence = ++searchSequence;
    const query = input.value.trim();
    clearButton.hidden = !query;
    clearResults();

    if (!query) {
      status.textContent = "";
      setState("idle");
      return;
    }
    if (normalizeText(query).replace(/\s/g, "").length < MIN_QUERY_LENGTH) {
      status.textContent = strings.minChars || "";
      emptyTitle.textContent = strings.minChars || "";
      emptyBody.textContent = "";
      setState("empty");
      return;
    }

    setState("loading");
    status.textContent = strings.loading || "";
    try {
      const index = await loadIndex(forceReload);
      if (sequence !== searchSequence) return;
      renderResults(searchIndex(index, query, { lang: locale, limit: 12 }), query);
    } catch (error) {
      if (sequence !== searchSequence) return;
      indexPromise = null;
      status.textContent = strings.errorTitle || "";
      setState("error");
    }
  }

  function scheduleSearch() {
    window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => runSearch(false), SEARCH_DELAY_MS);
  }

  function openSearch(trigger) {
    restoreFocus = trigger || toggle;
    const nav = document.getElementById("nav");
    const navToggle = document.getElementById("nav-toggle");
    const langSwitch = document.querySelector(".lang-switch[open]");
    if (nav) nav.classList.remove("nav-open");
    if (navToggle) {
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", navToggle.dataset.labelOpen || "");
    }
    if (langSwitch) langSwitch.removeAttribute("open");

    if (!dialog.open) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
    }
    toggle.setAttribute("aria-expanded", "true");
    requestAnimationFrame(() => input.focus());

    if (!indexPromise) {
      setState("loading");
      status.textContent = strings.loading || "";
      loadIndex(false).then(
        () => {
          if (!dialog.open) return;
          if (input.value.trim()) runSearch(false);
          else {
            status.textContent = "";
            setState("idle");
          }
        },
        () => {
          if (!dialog.open) return;
          indexPromise = null;
          status.textContent = strings.errorTitle || "";
          setState("error");
        }
      );
    } else if (input.value.trim()) {
      runSearch(false);
    }
  }

  function closeSearch() {
    if (typeof dialog.close === "function") dialog.close();
    else {
      dialog.removeAttribute("open");
      toggle.setAttribute("aria-expanded", "false");
      restoreFocus.focus();
    }
  }

  toggle.addEventListener("click", () => openSearch(toggle));
  closeButton.addEventListener("click", closeSearch);
  clearButton.addEventListener("click", () => {
    input.value = "";
    clearButton.hidden = true;
    runSearch(false);
    input.focus();
  });
  retryButton.addEventListener("click", retryIndex);
  input.addEventListener("input", scheduleSearch);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const first = dialog.querySelector(".search-result__link");
    if (first) first.click();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowDown") return;
    const first = dialog.querySelector(".search-result__link");
    if (first) {
      event.preventDefault();
      first.focus();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowUp") return;
    const first = dialog.querySelector(".search-result__link");
    if (first && document.activeElement === first) {
      event.preventDefault();
      input.focus();
    }
  });

  dialog.addEventListener("cancel", () => {
    toggle.setAttribute("aria-expanded", "false");
  });
  dialog.addEventListener("close", () => {
    toggle.setAttribute("aria-expanded", "false");
    if (restoreFocus && typeof restoreFocus.focus === "function") restoreFocus.focus();
  });

  document.addEventListener("keydown", (event) => {
    if (!(event.metaKey || event.ctrlKey) || event.altKey || event.key.toLowerCase() !== "k") {
      return;
    }
    event.preventDefault();
    if (dialog.open) input.focus();
    else openSearch(toggle);
  });
}
