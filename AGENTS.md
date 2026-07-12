# AGENTS.md — 文章翻譯規範（Translation Guide for Agents）

這份檔案是「把一篇技術文章翻成多國語系」的**唯一真相來源**，供任何 AI 代理
（Claude Code、Cursor、其他）依循。Claude Code 使用者可用斜線指令
`/translate-post <檔案> [語系...]` 觸發，其內容就是「請依本檔規範處理」。

> 設計目標：零付費 API、不綁定特定廠商、保留人工審核、SEO 正確。
> 站台的 i18n（路由、語言切換器、hreflang）已由模板處理，代理**只需產出符合規範的
> Markdown 檔**即可。

---

## 任務

把指定的**原文** `posts/<author>/<slug>.md`（繁體中文 `zh-TW`）翻譯成指定語系，
每個語系各產出一個 `posts/<author>/<slug>.<lang>.md` 檔。

- 預設目標語系：`en`（英文）、`ja`（日文）、`zh-CN`（簡體中文）。
- 若使用者指定語系（如 `/translate-post posts/benben/foo.md en,ja`），只翻指定的。
- 支援的語系與顯示名稱定義於 `_data/i18n.json`；新增語系時需同步更新該檔與
  `.eleventy.js` 的 `SITE_LANGS`、`scripts/check-translations.js` 的 `TARGET_LANGS`。
- 翻譯守門只會檢查已明確加入 i18n 的原文：frontmatter 同時具有 `lang: zh-TW` 與
  `translationKey`。未加入這兩欄的既有文章不受影響。

---

## 翻譯規則

1. **只翻譯散文與 `title`。** 不要翻譯 `tags`、`author`、`date`、`layout`、程式碼、
   URL、檔名。
2. **程式碼一字不動。** Fenced code block（```` ``` ````）與 inline code
   （`` `code` ``）的**內容完全保留原樣**，連同語言標註（如 ```` ```js ````）。
   程式碼裡的「字串、變數名、註解」也不翻（註解可斟酌：技術教學常保留原文較清楚，
   預設不翻；若使用者明確要求翻註解才翻）。
3. **保留 Markdown 結構**：標題層級、清單、表格、連結語法、圖片、引用、HTML 標籤、
   `<!-- summary -->` 摘要標記等一律保留；只替換其中的人類可讀文字。
4. **連結與圖片路徑不變**（站內連結、圖片 URL 保持原樣）。
5. **術語**：技術名詞採目標語社群慣用譯法；必要時保留英文原詞（可用「中文（English）」
   形式）。語氣與原文一致、自然流暢，不要逐字硬翻。

---

## 產出檔案格式

對每個目標語系 `<lang>`，寫出 `posts/<author>/<slug>.<lang>.md`，frontmatter 如下：

```yaml
---
title: <翻譯後的標題>
date: <與原文相同>
tags: <與原文相同，不翻>
author: <與原文相同>
layout: layouts/post.njk
lang: <lang>                       # 例如 en / ja / zh-CN
sourceLang: zh-TW
translationKey: <author>/<slug>    # 同一篇各語系共用，例如 benben/15-raycast-101
permalink: /<lang>/posts/<author>/<slug>/   # 例如 /en/posts/benben/15-raycast-101/
draft: true                        # 人工審核前不發佈，請勿自行移除
sourceHash: <見下方，務必正確>
image: <若原文有 image 則保留，否則省略>
---
```

- `translationKey` = 原文相對 `posts/` 的路徑去掉副檔名，例如
  `posts/benben/15-raycast-101.md` → `benben/15-raycast-101`。
- `permalink` 結尾務必有斜線。
- 內文接在 frontmatter 之後，即翻譯後的文章本體。
- `draft: true` 的譯文不會進 production build。人工審核通過後才可移除它，並且**必須**
  補上可稽核欄位：`reviewedBy: <審核者>`、`reviewedAt: <YYYY-MM-DD>`。pre-commit 會拒絕
  缺少這兩欄的已發佈譯文。

### `sourceHash`（過期偵測用，務必正確）

譯文必須記錄原文內文的雜湊，git 提交時的守門腳本會用它判斷譯文是否過期。
**不要自己心算雜湊**，請執行下列指令取得，並把輸出原封貼進 frontmatter：

```bash
node scripts/check-translations.js --hash posts/<author>/<slug>.md
```

（此值是原文「標題與 frontmatter 之後內文」的 SHA-256；標題或內文之後若更新，
雜湊會變，守門腳本即會要求重新翻譯。）

### 原文也要補欄位（首次翻譯時）

第一次翻某篇時，在**原文** frontmatter 補上下列兩欄（已存在則略過，不要重複）：

```yaml
lang: zh-TW
translationKey: <author>/<slug>
```

原文不需要 `permalink`（沿用 Eleventy 既有路由 `/posts/<author>/<slug>/`）、
不需要 `draft`、不需要 `sourceHash`。

---

## 回譯校驗（交付前必做）

寫完所有譯文後，把**每個譯文再翻回繁體中文**，與原文逐段對照，向使用者回報：

- 語意是否一致、有無漏譯或多譯。
- 技術術語是否正確、是否有歧義。
- 程式碼區塊是否確實未被更動。

這讓使用者能用看得懂的語言把關品質。回報為對話輸出即可，不需另存檔案。

---

## 完成後

- 提醒使用者：譯文為 `draft: true`，**經人工審核後再移除** `draft`、填寫
  `reviewedBy` 與 `reviewedAt` 才會發佈。
- 本機預覽：`npm run serve`，草稿在 dev 模式可見；`npm run build`（production）不會輸出草稿。
- 對外發佈內容建議經人工/法務或合規確認（公司規範）。
