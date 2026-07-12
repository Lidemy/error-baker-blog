# ErrorBaker 技術共筆部落格

https://blog.errorbaker.tw/

這邊是 ErrorBaker 技術共筆部落格的原始碼，主要是參考[為什麼我離開 Medium 用 eleventy 做一個 blog](https://jason-memo.dev/posts/why-i-leave-medium-and-build-blog-with-eleventy/) 裡面推薦的 [eleventy-high-performance-blog](https://github.com/google/eleventy-high-performance-blog) 改造而來。

這邊改最多的是把個人部落格改成共筆部落格，能夠支援以下功能：

1. 可以方便地新增作者資訊
2. 每個作者有自己的資料夾
3. 每個作者有自己的個人頁面，可以自己客製化
4. 文末會自動附上相對應的作者資訊

## 開發

```
npm install
npm run watch
```

## 部署

只要把 code push 之後就會自動透過 Netlify 進行部署。

## 該如何新增作者？

每一個作者都會有個 unique 的 key 來識別，這邊假設 key 是 peter。

1. 把個人大頭貼放到 `img/authors` 裡面
2. 打開 `_data/metadata.json`，在 `authors` 陣列裡面新增一個 object，格式可參考其他物件，key 是 `peter`
3. 在 `posts/` 資料夾底下新增 `peter` 資料夾，並複製其他資料夾的 `index.njk`，內容會是作者的個人頁面，可自由客製化
4. 在 `img/posts` 資料夾底下新增 `peter` 資料夾，文章的圖片可以放到這裡面

## 該如何發文？

一樣假設作者的 key 是 `peter`

1. 把 repo clone 下來
2. 在 `posts/peter` 裡面新增 markdown 檔案，開頭 frontmatter 格式請參考下面
3. 完成之後 commit + push 就會觸發部署流程，大約五分鐘後可以在 production 上看到改動

## 文章 frontmatter 格式

```
title: 用 Paged.js 做出適合印成 PDF 的 HTML 網頁 // 標題
date: 2018-09-30 // 發文日期
tags: [Front-end, JavaScript] // 標籤
author: huli // 作者 key
layout: layouts/post.njk // 這固定不變
```

## 摘要功能
使用一對 `<!-- summary -->` 可以選擇將一部分內容顯示在摘要區中。

```
<!-- summary -->
Hi，這是 ErrorBaker 技術共筆部落格，由一群希望藉由共筆部落格督促自己寫文章的人們組成。
<!-- summary -->

部落格的主題以 web 前後端主題居多，但其實只要是跟技術有關的主題都有可能出現。
```

如果想要顯示的摘要的內容不在文章裡面，可以使用 comment 指定：

```
<!-- summary -->
<!-- 我是會吸引人點進文章，但沒有整段出現在文章裡的摘要 -->
<!-- summary -->
```

使用 comment 指定的摘要支援 HTML，例如`<code>`等。 結尾的 `-->` 目前不可省略。

另外，`<!-- summary -->` 和 comment 標籤中的半形空白是必須的。

## 如何客製化？

### 模板

`_includes` 裡面都是 layout 相關的東西，請注意可能會牽一髮動全身，裡面主要會是各個頁面的 template。

### 樣式

css/main.css 所有的樣式都在裡面，有新增的都放在最下面

## 文章規範

### Tags

- tags 採用 kabab case 來命名 e.g. back-end
- 若遇到有連詞或分詞疑問，依循前者來決定 e.g. backend vs back-end，如果已經有人使用 backend 則使用 backend。

## 多國語系翻譯

文章可以翻成多國語系（預設 `en` / `ja` / `zh-CN`）。翻譯由 AI 代理執行，**不需付費 API**，
規範集中在根目錄的 [`AGENTS.md`](./AGENTS.md)。

### 怎麼翻一篇文章

1. 用 Claude Code 跑斜線指令（假設原文是 `posts/peter/foo.md`）：

   ```
   /translate-post posts/peter/foo.md          # 翻成預設的 en, ja, zh-CN
   /translate-post posts/peter/foo.md en,ja    # 只翻指定語系
   ```

   （非 Claude Code 的代理：直接請它「依 AGENTS.md 翻譯 posts/peter/foo.md」即可。）

2. 代理會在原文的 `translationTargets` 記錄預期語系，產出
   `posts/peter/foo.en.md` 等檔並標為 `draft: true`，再回報「回譯校驗」讓你用中文
   檢查語意。指定 `en,ja` 時，守門只要求這兩個譯文。
3. 本機預覽 `npm run serve`（草稿在 dev 模式可見），確認沒問題後才可移除譯文的
   `draft: true`，並填入 `reviewedBy` 與 `reviewedAt`；這兩個審核欄位缺一時，
   pre-commit 會拒絕發佈。

### 其他作者如何加入多語系

翻譯是**逐篇 opt-in**，未加入的文章完全不受影響。想讓自己的文章有譯文時：

1. 跑 `/translate-post posts/<author>/<slug>.md`；代理會在原文 frontmatter 補
   `lang: zh-TW`、`translationKey` 與 `translationTargets`，並產出指定語系的草稿譯文。
2. 人工審核譯文後移除 `draft: true`，填入 `reviewedBy` 與 `reviewedAt`。
3. （建議）在 `_data/metadata.json` 自己的作者條目加上 `intro_en`、`intro_ja`、
   `intro_zh-CN`；譯文頁的作者簡介才會跟著在地化（缺少時顯示中文 `intro`）。

### 譯文不會混進中文首頁

譯文有獨立路由（`/en/posts/...`）與語言切換器、`hreflang`；中文首頁、標籤頁、RSS
只會列繁中文章。

### 過期守門（pre-commit）

提交時會自動檢查：被改動的原文或譯文若**缺少 `translationTargets` 指定的譯文**、
**存在未列入清單的譯文**、**譯文已過期**（原文標題或內文變了），或已發佈譯文缺少
人工審核紀錄，就會擋下提交並提示你修正。檢查一律讀取 Git 暫存區，不會被 working tree
的未暫存內容影響。

WIP 想先略過檢查：

```bash
SKIP_TRANSLATION_CHECK=1 git commit ...
# 或
git commit --no-verify
```

> 機制說明：守門腳本是 `scripts/check-translations.js`，透過專案既有的 `pre-commit`
> 套件掛在 git hook（不需額外裝 Husky）。語系清單以 `_data/langs.json` 為唯一來源
> （第一個元素是預設語系，其餘為翻譯目標；順序即切換器顯示順序），`.eleventy.js`、
> 守門腳本與測試都由它推導。新增語系只需兩步：在 `_data/langs.json` 加語系代碼、
> 在 `_data/i18n.json` 補該語系完整字串區塊（缺必要欄位時 build 會直接失敗提示）。

### 導覽列語言切換器

每頁導覽列都有全站語言切換器。**目前頁面有該語言版本**→ 可點連結；**沒有**→ 顯示為灰色
停用並提示「此頁面尚無此語言版本」（不會產生壞連結）。等之後做了各語系首頁/列表頁
（第二階段），這些停用項目會自動變成可點。

## 參考資源

1. [Eleventy Documentation](https://www.11ty.dev/docs/collections/)
2. [Nunjucks 文件](https://mozilla.github.io/nunjucks/templating.html)
