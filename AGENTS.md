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
- 原文的 `translationTargets` 是預期譯文清單：首次翻譯時填入本次指定語系；未指定時
  填入全部預設目標語系。之後新增語系要併入既有清單，不能覆蓋掉仍存在的譯文。
- 語系清單以 `_data/langs.json` 為唯一來源（第一個元素是預設語系，其餘為翻譯
  目標語系）；顯示名稱等 UI 字串定義於 `_data/i18n.json`。新增語系只需更新這兩個
  檔案——`.eleventy.js`、`scripts/check-translations.js` 與測試會自動推導，
  `i18n.json` 缺必要欄位時 build 會直接失敗提示。
- 翻譯守門只會檢查已明確加入 i18n 的原文：frontmatter 同時具有 `lang: zh-TW` 與
  `translationKey`。它會要求 `translationTargets` 列出的譯文存在；舊文章若未填此欄，
  為向下相容會沿用「全部目標語系」的規則。未加入 i18n 的既有文章不受影響。

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
- `draft: true` 的譯文不會進 production build，也暫時不需要 `publishedAt`。人工審核
  通過後才可移除 `draft`，並且**必須**補上：

```yaml
reviewedBy: <審核者>
reviewedAt: <YYYY-MM-DD>
publishedAt: <YYYY-MM-DD>
```

pre-commit 會拒絕缺少或日期格式錯誤的已發佈譯文。

### 日期欄位契約

- `date`：原始作品的發布日；譯文必須逐字複製原文值，不能改成翻譯日期。
- `publishedAt`：**這個語言版本**第一次正式公開的日期；非 draft 譯文必填，首次發布後
  不因文章更新而改動。
- `updatedAt`：這個語言版本有實質內容更新時才填或更新；必須不早於 `publishedAt`。
- `reviewedAt`：人工審核日期，只供稽核，不能代替 `publishedAt` 或 `updatedAt`。

既有 zh-TW 原文可省略 `publishedAt`，站台會沿用 `date`。現有 draft 譯文也不需要遷移，
等實際發布時再加入 `publishedAt`；任何已填日期都必須是真實的 `YYYY-MM-DD` 日曆日期。

### `sourceHash`（過期偵測用，務必正確）

譯文必須記錄原文內文的雜湊，git 提交時的守門腳本會用它判斷譯文是否過期。
**不要自己心算雜湊**，請執行下列指令取得，並把輸出原封貼進 frontmatter：

```bash
node scripts/check-translations.js --hash posts/<author>/<slug>.md
```

（此值是原文「標題與 frontmatter 之後內文」的 SHA-256；標題或內文之後若更新，
雜湊會變，守門腳本即會要求重新翻譯。）

### 原文也要補欄位（首次翻譯時）

第一次翻某篇時，在**原文** frontmatter 補上下列三欄（已存在則更新，不要重複）：

```yaml
lang: zh-TW
translationKey: <author>/<slug>
translationTargets: [<本次要求的語系>]  # 例如 [en, ja]；未指定時為 [en, ja, zh-CN]
```

`translationTargets` 必須是 `_data/langs.json` 支援的非預設語系，並與實際譯文檔案一致。
若之後新增語系，將它併入清單；只有刻意停止支援某語系時，才在同一個 commit 同時移除
清單項目與該譯文檔案。這讓守門能區分「只要求部分語系」和「譯文被意外刪除」。

任一譯文檔案存在時，繁中原文必須保留 `lang: zh-TW` 與 `translationKey`。若要刪除文章，
必須在同一個 commit 刪除原文及所有譯文；守門會拒絕失去原文、無法再驗證 `sourceHash`
的孤兒譯文。原文若設為 `draft: true`，其譯文也都必須維持 `draft: true`，不能單獨發佈。

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
  `reviewedBy`、`reviewedAt` 與 `publishedAt` 才會發佈。
- 檢查 `_data/metadata.json` 中該作者是否已有 `intro_<lang>`（如 `intro_en`）欄位；
  沒有的話提醒使用者補上在地化簡介，否則譯文頁的作者簡介會顯示中文原文。
- 本機預覽：`npm run serve`，草稿在 dev 模式可見；`npm run build`（production）不會輸出草稿。
- 對外發佈內容建議經人工/法務或合規確認（公司規範）。
