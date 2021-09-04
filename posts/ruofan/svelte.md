---
title: 初探 svelte
date: 2021-09-04
tags: [Front-end]
author: Ruofan
layout: layouts/post.njk
image: https://i.imgur.com/JIy4LhV.png
---

<!-- summary -->

## 前言

Hi，大家好！最近初次嘗試使用 svelte 開發一個新的專案，這篇文章會分享架構的建設。

<!-- summary -->
<!-- more -->

## svelte 的特色？

svelte 和其他前端框架的不同，在 svelte 的官網上是這樣介紹的：

> Traditional frameworks allow you to write declarative state-driven code, but there's a penalty: the browser must do extra work to convert those declarative structures into DOM operations, using techniques like that eat into your frame budget and tax the garbage collector.

> Instead, Svelte runs at build time, converting your components into highly efficient imperative code that surgically updates the DOM. As a result, you're able to write ambitious applications with excellent performance characteristics.

簡單來說，svelte 會在 build time 的時後編譯元件，performance 的表現上是不錯的。
想了解更多的話，推薦看 svelte 的官網。

## QuickStart

透過下方的指令可以快速的開啟一個新的專案。

```bash
$npx degit sveltejs/template svelte-app
```

## SetUp

使用 vite 作為 dev server，svelte 官方有提供一個 plugin 讓我們安裝 vite。

```bash
$yarn add -D @sveltejs/vite-plugin-svelte
```

同時也需要設定檔 vite.config.js

###### **vite.config.js**

```js
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  server: {
    port: 5000,
  },
});
```

在使用環境變數上，因應 vite 使用上也需要特別注意。
舉例來說：
在 .env.development 加上了下方的 key

```json
VITE_FIREBASE_KEY='theKey'
```

如果要引用環境變數的話，就需要像下方的方式引用。

```js
const firebaseConfig = {
  key: `${import.meta.env.VITE_FIREBASE_KEY}`
}
```

此外區分 development 和 production 環境的話是透過下方的環境變數。

```js
console.log(`${import.meta.env.PROD}`) // production
console.log(`${import.meta.env.DEV}`) // development
```

此外，package.json 中的 script 也需要設定

###### **package.json**

```json
 "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview"
  },
```

css 的部分選擇了 Tailwind CSS。

```bash
$yarn add tailwindcss@npm:@tailwindcss/postcss7-compat postcss@^7 autoprefixer@^9
```

同時也需要實作設定檔 tailwind.config.js

###### **tailwind.config.js**

```js
module.exports = {
  mode: "jit", // Just-in-Time Mode
  purge: ["./index.html", "./src/**/*.{svelte,js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        primary: "#FBF6EB",
        secondary: "#6498C0",
      },
    },
    fontFamily: {
      sans: ["Averia Libre"],
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
```

透過下方指令就可以產生一個 postcss.config.js
```bash
$npx tailwindcss init -p
```
###### **postcss.config.js**
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

在路由的部分使用了 Svelte Routing

```bash
$yarn add svelte-routing
```

設定上蠻簡便的，這邊會先從 layout 開始實作。

###### **Layout.svelte**

```html
<script>
  import { Router, Route } from "svelte-routing";

  // components for this layout
  import SideBar from "../components/SideBar.svelte";
  // pages for this layout
  import Store from "../pages/Store.svelte";
  import StoreDetail from "../pages/StoreDetail.svelte";

  export const admin = "";
  export let location;
</script>
<div
  class="relative min-h-screen h-screen overflow-hidden md:flex"
  data-dev-hint="container"
>
  <SideBar location="{location}" />
  <main id="content" class="flex-1 p-6 lg:px-8 h-screen overflow-auto">
    <div style="position: absolute; right: 1em;"></div>
    <Router url="admin">
      <Route path="/store" component="{Store}" />
      <Route path="/store/:id" let:params><StoreDetail id="{params.id}"/></Route>
    </Router>
  </main>
</div>
```

接著實作 App.svelte 中的路由。

###### **App.svelte**

```html
<script>
  import { Router, Route } from "svelte-routing";
  import Login from "./pages/Login.svelte";
  // Layout
  import Layout from "./layout/Layout.svelte";
  import Home from "./layout/Home.svelte";
  export let url = "";
</script>

<div>
  <Router url="{url}">
    <Route path="/" component="{Home}" />
    <Route path="admin/*admin" component="{Layout}" />

    <Route path="/login" component="{Login}" />
  </Router>
</div>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>
```

最後安裝 eslint 跟 prettier。

```bash
$yarn add -D prettier eslint prettier-plugin-svelte eslint-plugin-svelte3 babel-eslint
```

接著實作設定檔 .eslintrc.js
###### **.eslintrc.js**
```js
module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: "module",
    allowImportExportEverywhere: true,
  },
  env: {
    browser: true,
    es6: true,
  },
  plugins: ["svelte3"],
  ignorePatterns: ["public/build/"],
  overrides: [
    {
      files: ["**/*.svelte"],
      processor: "svelte3/svelte3",
    },
  ],
  extends: "eslint:recommended",
  rules: {
    indent: ["error", 2],
    quotes: ["error", "double"],
  },
};
```
###### **.prettierrc**
```json
{
  "svelteSortOrder": "options-styles-scripts-markup",
  "svelteStrictMode": true,
  "svelteBracketNewLine": false,
  "svelteAllowShorthand": false,
  "svelteIndentScriptAndStyle": false
}
```

在架構的建設上大致上完成了，先來看一下檔案結構。

```bash
├── src
│   ├── App.svelte
│   ├── main.js
│   ├── pages
│   │   ├── Home.svelte
│   │   ├── Store.svelte
│   │   ├── StoreDetail.svelte
│   │   └── Login.svelte
│   ├── components
│   │   └── SideBar.svelte
│   └── layout
│       └── Layout.svelte
│
├── tailwind.config.js
├── vite.config.js
├── package.json
├── postcss.config.js
└── yarn.lock
```
## 回顧
看一下 package.json 我們安裝了哪些吧！
```json
{
  "name": "svelte-app",
  "version": "0.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "serve": "vite preview",
    "lint": "eslint . --ext .js,.svelte --fix"
  },
  "devDependencies": {
    "@sveltejs/vite-plugin-svelte": "^1.0.0-next.11",
    "autoprefixer": "^10.3.1",
    "babel-eslint": "^10.1.0",
    "eslint": "^7.32.0",
    "eslint-plugin-svelte3": "^3.2.0",
    "postcss": "^8.3.6",
    "prettier": "^2.3.2",
    "prettier-plugin-svelte": "^2.4.0",
    "svelte": "^3.37.0",
    "svelte-check": "^2.1.0",
    "svelte-routing": "^1.6.0",
    "vite": "^2.4.4",
  },
  "dependencies": {
    "postcss-preset-env": "^6.7.0",
    "svelte-preprocess": "^4.8.0",
    "tailwindcss": "^2.2.7",
  }
}
```
## 小結
很快速的帶大家 run 過建設一個新的 svelte 專案，下一篇會分享在這個專案中實作 google login 以及設定權限的部分。

在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃

## 參考資料
- [Documentation | Svelte 3: Rethinking reactivity](https://svelte.dev/blog/svelte-3-rethinking-reactivity)
