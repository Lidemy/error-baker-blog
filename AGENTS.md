# Repository layout（工作目錄注意事項）

- 本 repo 的根目錄可能是 **bare repo**：磁碟上根目錄看得到的檔案為過期快照，
  **不要直接讀取或編輯**。
- 實際工作一律在 `.claude/worktrees/` 底下的 worktree 進行。
- 建立 worktree 時一律從 `origin/main` 切出（先 `git fetch origin main`），
  避免基於過期分支開工。

# AGENTS.md — 文章翻譯規範（Translation Guide for Agents）

這份檔案是「把一篇技術文章翻成多國語系」的**唯一真相來源**，供任何 AI 代理
（Claude Code、Codex、Cursor、其他）依循。

> 設計目標：零付費 API、不綁定特定廠商、保留人工審核、SEO 正確。
> 站台的 i18n（路由、語言切換器、hreflang）已由模板處理，代理**只需產出符合規範的
> Markdown 檔**即可。

## 觸發方式與輸入驗證

任何代理都能以一句話啟動流程，不需要工具專屬設定：

> 依 AGENTS.md 翻譯 `posts/<author>/<slug>.md` 成 `<lang>[,<lang>...]`

工具捷徑（皆為純別名，規範只在本檔）：

- **Agent Skills 開放標準**（Codex CLI 等）：`.agents/skills/translate-post/`。
- **Claude Code**：斜線指令 `/translate-post <檔案> [語系,...]`（`.claude/commands/`）。

開始翻譯前，代理必須先驗證輸入，任一項不成立就停止並清楚說明，
不得猜測路徑、猜測語系或修改任何檔案：

1. 原文必須是存在的繁中檔案 `posts/<author>/<slug>.md`（不是 `.<lang>.md` 譯文）。
2. 指定的語系必須列於 `_data/langs.json` 的非預設語系；未指定時使用全部
   預設目標語系。
3. 不得代使用者移除 `draft`、填寫人工審核欄位、提交或發佈內容。

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

---

# Tag 正規化規範（Tag Normalization Guide for Agents）

這一章是「為文章推薦 canonical tags」的**唯一真相來源**，供任何 AI 代理依循。
定位是 **AI 推薦、人核可**：代理只產出建議草稿，寫入與否由使用者決定；
`scripts/check-tags.js` 是唯一的硬閘門，代理不得繞過、修改或代替它。

> 設計目標：零付費 API、不綁定特定廠商、封閉詞彙表內選擇（不發明）、
> 所有寫入都經人核可且能被 CI 驗證。

## 觸發方式與輸入驗證

任何代理都能以一句話啟動，不需要工具專屬設定：

> 依 AGENTS.md 正規化 `posts/<author>/<slug>.md` 的 tags

或批次模式（處理僅有大類、缺 leaf topic 的 backlog）：

> 依 AGENTS.md 正規化 tags backlog

backlog 的唯一真值來源是 `npm run check-tags` 報告中的「Leaf-topic backlog」清單
（定義：tags 全部屬於 `tagTaxonomy.json` `policy.umbrellaTopics` 宣告的大類）。
代理必須以該報告為準，不得自行維護或猜測清單。

工具捷徑（皆為純別名，規範只在本章）：

- **Agent Skills 開放標準**：`.agents/skills/normalize-tags/`。
- **Claude Code**：斜線指令 `/normalize-tags <檔案|backlog>`（`.claude/commands/`）。

開始前，代理必須先驗證，任一項不成立就停止並清楚說明：

1. 目標必須是存在的繁中原文 `posts/<author>/<slug>.md`（譯文的 tags 一律
   跟隨來源，不單獨正規化）。
2. `_data/tagTaxonomy.json` 必須存在且可通過 `compileTaxonomy` 載入。
3. 不得在未經使用者核可前修改任何檔案。

## 推薦規則

1. **封閉詞彙表**：只能從 `_data/tagTaxonomy.json` 的 canonical label 中選擇。
   遇到 alias 或 retired 寫法，一律替換為對應的 canonical。
2. **數量與格式**：每篇 1–5 個、不重複，維持單行 `tags: [...]` 格式。
3. **依內容選擇，附依據**：每個建議 tag 需附一句依據（對應文章的哪個主題或
   段落），供使用者快速核可。
4. **選不到就回報，不硬湊**：文章找不到合適的 leaf topic 時，保留現有大類
   （如 `Frontend`）並將該篇列入 backlog 回報；不得為了湊數選相關性弱的 tag。
5. **不發明新 topic**：需要新 topic 時只產出「提案」——canonical 候選名、
   slug 建議、會使用它的文章清單、`test/test-tags.js` 需同步更新的數字
   （registry 與主題地圖卡片數）——交由使用者決定命名與是否採納。
   slug 是永久網址，命名權永遠在人。
6. **分類候選只是參考**：達到門檻的 topic 由 check-tags 報告為候選，
   代理不得宣稱或執行「升級為分類」。

## 產出與核可流程

1. 先以 diff 形式呈現建議（原 `tags:` 行 → 建議行，附每個 tag 的依據），
   **等使用者核可後才寫入檔案**。
2. 寫入來源檔後，同步把該篇所有既存譯文（`.<lang>.md`）的 `tags:` 行改為與
   來源**逐字相同**。
3. 寫入後必跑 `npm run check-tags`，並回報結果；任何違規都要修到通過，
   不得留給使用者收尾。

## 新 topic 提案被採納後（閉環）

使用者核可提案後，由代理在**同一次核可**下依序完成，不得留半套：

1. `_data/tagTaxonomy.json` 新增該 topic（canonical、slug 依使用者定案；
   相關舊寫法放 `aliases`）。
2. 回填提案證據清單中的文章 tags（含各篇既存譯文逐字同步）。
3. 同步 `test/test-tags.js` 中 registry 數與主題地圖卡片數的釘死數字。
4. 跑 `npm run check-tags` 與 `npx mocha test/test-tags.js`，全綠才算完成。

## 完成後

- 提醒使用者：tags 變更會改變文章所屬的 topic 頁；若移除了某 topic 的最後
  一篇文章，`test-tags` 的 unusedTopics 斷言會失敗，需一併處理。
- 不得代使用者提交（commit）或發佈。
