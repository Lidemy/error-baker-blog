---
title: 來做一個 Gatsby Generic Plugin 吧
description: "拆解 Gatsby Plugin 的檔案組成與五種類型命名規範，並用 Gatsby Node API 與 createNode 手把手做出一個最簡單的 Generic Plugin，適合想開發並發布自有外掛的人。"
date: 2021-11-15
tags: [Gatsby Plugin]
author: YongChen
layout: layouts/post.njk
---

<!-- summary -->
之前朋友有個 side project 想做一個功能，也想將該製作成一個 Gatsby Plugin 並上傳到 [Gatsby Plugin Library](https://www.gatsbyjs.com/plugins) 未來提供大家使用，而我對該功能也有點興趣，就來研究與 Gatsby 相關的議題啦。簡介 Gatsby 以及 Gatsby Plugin 的生態系，詳細描述 Gatsby Plugin 的組成與類型，最後透過 Gatsby APIs 製作一個最簡單的 Gatsby Generic Plugin。
<!-- summary -->
<!-- more -->

## 什麼是 Gatsby？
**不僅是靜態網頁產生器**
Gatsby 一直以來是著名的靜態網頁產生器 (Static Site Generator, SSG)，其特點是在 build time，便將應用程式編譯成一個個的 HTML 檔案，接著再部署到 web，在使用者向 server 第一次發送 request 之後，server 回傳的便是完整的 HTML 檔案，在使用者切換頁面的時候，瀏覽器處理網頁路徑、JS 更換網頁內容，因此在使用者切換其他頁面無須再向 server 拿資料，所以頁面瀏覽速度迅速，操作起來就像是單頁式應用 (Single Page Application, SPA)，但 SSG 回傳的是預渲染好的靜態網頁內容，不同於 SPA 回傳的是空白的 HTML 檔案，因此有利於 SEO。

然而 Gatsby 不僅能產生靜態網頁也能產生動態網頁，或者是讓靜態網頁中部分內容是動態產生的，可看到官網的介紹，除了相當挺吸引人標語，也描述剛所提及的部分特點。

![](https://i.imgur.com/S6b9RLF.png)

在最新版本的 Gatsby 4 中，新增並支援 2 種渲染方式：
- 延遲靜態生成 (Deferred Static Generation, DSG)：在 build time 的時候預先標記特定頁面，直到 run-time 的時候再將標記過的頁面做 building，該方法可延遲特定頁面的生成。
- 伺服器渲染 (Server-Side Rendering, SSR)：透過伺服器作渲染。
<br>

**Gatsby 數據層與 UI 層分離**
若簡單解釋 Gatsby 的架構，Gatsby 建構於 React 以及 GraphQL 之上，React component 作為「UI 層」，GraphQL 則作為「數據層」。

我想有寫過 React 的人想必對 React component 的概念不陌生，在此不敘述，至於 Gatsby 的「數據層」，能整合不同的數據來源，無論在從 CMSs (ex: WordPress, Drupal)、JSON、Markdown、電子表單、其他第三方系統 APIs，都能將資料整合在一起，這是因為 Gatsby 採用 GraphQL 獲取資料，在 build time 的時候會建立一個將所有資料整合的 GraphQL server，所以在 UI 層的 React component 中的所有數據，都是在 `build time` 從相同的地方取得的，這樣的特性將  UI 層與數據層分離。

![](https://i.imgur.com/UFEUMX7.png)

## 什麼是 Gatsby Plugin？
Gatsby plugins 是 `Node.js packages`，可以快速地為網站新增模組化、客製化的功能，而不用重頭開始打造。Gatsby 擁有豐富的 plugin 生態系，可參考本文開頭所提及的 [Gatsby Plugin Library](https://www.gatsbyjs.com/plugins)

可先將 Gatsby plugin 的核心概念做 3 點小結：
1. 每個 Gatsby plugin 皆可被製作成對外發布的 npm 或是 yarn package。另外也可作為內部的 [local plugin](https://www.gatsbyjs.com/docs/creating-a-local-plugin/)。
2. Gatsby plugin 必須有 `package.json` 檔案。
3. Gatsby plugin 使用 Gatsby APIs 來實作功能。

**Gatsby Plugin 的檔案組成**
- `package.json` (若作為 local plugin 可為空物件 `{}`)
    - `name`： plugin 的名稱。
    - `main`： 若需要其他應用程式，將其檔案名稱寫在這，若不需要，官方建議填寫 `index.js`，並且在與`package.json` 相同層級的地方，建立一個空的 index.js。
    - `version`：版本紀錄，當版號改變時會清除 `cache`。
    - `keyword`：plugin 發布到 npm 上，須有 `gatsby`、`gatsby-plugin` 的關鍵字，也才能發被到 Gatsby Plugin Library。
- `gatsby-node.js`：該檔案中撰寫 [Gatsby Node APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-node/) 相關的 code，當 build 的時候會 run 過該檔案的 code 一次。
- `gatsby-config.js`：定義網站的 metadata、plugin、其他基本設定。
- `gatsby-browser.js`：該檔案中可實作[Gatsby's Browser APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/)
- `gatsby-ssr.js`：該檔案中可實作[Gatsby's SSR APIs](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/)
<br>

**Gatsby Plugin 的類型**
根據 plugin 功能，區分成不同類型的 plugin，由於有一定的[命名規範](https://www.gatsbyjs.com/docs/how-to/plugins-and-themes/naming-a-plugin/)，故從名稱便可略知一二該 plugin 的功能。

- `gatsby-source-*`：從給定的資料來源 (e.g. WordPress, MongoDB, the file system)，載入資料，使用這類型的 plugin，可連接對應來源的資料到 Gatsby 網站中。
- `gatsby-transformer-*`：將資料格式 (e.g. CSV, YAML) 轉換資料成 Gatsby 通用的 JS 物件型式的資料格式。
- `gatsby-[plugin-name]-*`：若該 plugin 是另一個 plugin 的 plugin 😅 (不是我要繞口令，官方文件就是這麼說明的，連表情符號也是。)，相依 plugin 的名稱，則會作為前綴加在新 plugin 的名稱之前，
例如，新增 emoji 到 `gatsby-transformer-remark` 的輸出，新的 plugin 名稱就會變成 `gatsby-remark-add-emoji`。
- `gatsby-theme-*`：代表該 plugin 會有 UI component，可能會有 section、page、page 的一部分。
- `gatsby-plugin-*`：這是最為常見的 plugin 類型，也被稱作 Generic Plugin。若 plugin 的功能不完全符合上述的 plugin 功能，即可這樣命名。

## 製作一個 Gatsby Generic Plugin

**資料的最小單位 Node**
在 Gatsby 中，一個 [Node](https://www.gatsbyjs.com/docs/node-creation/) ，是資料的最小單位，我們能透過 [createNode](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createNode)，來製作一個 Node，而前面有提到的 `gatsby-node.js`，該檔案中所寫的 code 是用來操作 Gastsby Node APIs，例如 `createPage`、`createResolvers`、`sourceNodes`，也就是用來操作 Node(s) 節點。

**Generic plugin 向 API 請求資料的流程**
在 `gatsby-node.js` 中可以使用 Gatsby APIs 執行下列功能：
1. 載入 API keys。
2. 發送請求到 APIs。
3. 利用 API 回傳的結果製作 Gatsby-nodes。
4. 依照 Nodes 的製作頁面。

**Generic plugin 的範例**
`sourceNodes`，是用來製作 Nodes 的 API，功能實作如下：

```js
// gatsby-node.js
exports.sourceNodes = ({ actions, createNodeId, createContentDigest }) => {
  const nodeData = {
    title: "Test Node",
    description: "Testing the node ",
  }
  const newNode = {
    ...nodeData,
    id: createNodeId("TestNode-testid"),
    internal: {
      type: "TestNode",
      contentDigest: createContentDigest(nodeData),
    },
  }
  actions.createNode(newNode)
}
```

上述的程式碼，會製造一個叫做 `TEST Node` 的 Node，只要在 Gatsby 專案中使用 `gatsby develop`，指令重啟 graphQL server，便能在預設的 `http://localhost:8000/___graphql` 頁面中，取得 `allTestNode` 的 query 結果。

![](https://i.imgur.com/JcpOi02.png)

## 總結
這篇文章介紹：
- SSG 的運作原理以及 Gatsby 但它不僅僅是 SSG，也能動態產生內容。
- 透過 GraphQL 將所以數據整合在一起，也因為 Gatsby 建立在 React 以及 GraphQL 之上，能清楚拆分成 UI 層與數據層。
- Gatsby Plugin 的核心概念以及其組成需要哪些檔案。
- Gatsby 擁有豐富的 Plugin 生態系，可迅速為網站新增功能，Plugin 依照功能區分類型。
- 如何製作一個 Gatsby Generic Plugin。

因為省略 Gatsby 專案創建以及 GraphQL 的操作方式，本文的最後一小節：「製作一個 Gatsby Generic Plugin」，可能對完全沒接觸過 Gatsby 以及 GraphQL 的讀者會比較不清楚，可參閱這兩篇文件：[環境設定](https://www.gatsbyjs.com/docs/tutorial/part-0/)、[製作並部署你的第一個 Gatsby 網站](https://www.gatsbyjs.com/docs/tutorial/part-1/)。

原本想直接寫完「如何製作 Gatsby Theme Plugin」的，只是發現這樣難以說明清楚 Gatsby Plugin 是什麼，下一篇再詳細介紹 Gatsby Theme Plugin。

## 參考資源
- [Create Gatsby Plugin](https://www.gatsbyjs.com/docs/creating-plugins/)
- [Understanding Plugin Development In Gatsby](https://www.smashingmagazine.com/2020/07/understanding-plugin-development-gatsby/)
