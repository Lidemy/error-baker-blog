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

## 如何客製化？

### 模板

`_includes` 裡面都是 layout 相關的東西，請注意可能會牽一髮動全身，裡面主要會是各個頁面的 template。

### 樣式

css/main.css 所有的樣式都在裡面，有新增的都放在最下面




## 參考資源

1. [Eleventy Documentation](https://www.11ty.dev/docs/collections/)
2. [Nunjucks 文件](https://mozilla.github.io/nunjucks/templating.html)
