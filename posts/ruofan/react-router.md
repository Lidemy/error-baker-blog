---
title: react router v6
date: 2021-11-07
tags: [Front-end]
author: Ruofan
layout: layouts/post.njk
---

<!-- summary -->

Hi，大家好！ 前陣子 [react router](https://github.com/remix-run/react-router) 釋出 v6 的版本，終於可以幫專案中的 v6.0.0-beta.0 版本做升級啦！這篇文章會帶著大家認識如何從 react router v6.0.0-beta.0 升級到 react router v6。

<!-- summary -->
<!-- more -->

## 什麼是 react router？

以下為 react router [官方文件](https://reactrouter.com/) 上對自己的介紹：

> React Router is a fully-featured client and server-side routing library for React, a JavaScript library for building user interfaces. React Router runs anywhere React runs; on the web, on the server with node.js, and on React Native.

> React Router isn't just about matching a url to a function or component: it's about building a full user interface that maps to the URL, so it might have more concepts in it than you're used to. We'll go into detail on the three main jobs of React Router:
>
> 1.  Subscribing and manipulating the history stack
> 2.  Matching the URL to your routes
> 3.  Rendering a nested UI from the route matches

簡單來說，React Router 不只是讓網址配對到對應的路由及元件，還可以操控瀏覽器的歷史紀錄，以及從對應的網址渲染出 UI。想了解更多的話，推薦看 React Router 的 [官方文件](https://reactrouter.com/)。

## Upgrading from react router v6.0.0-beta.0

由於 [官方文件](https://reactrouter.com/) 已經有完整的介紹 [Upgrading from v5](https://reactrouter.com/docs/en/v6/upgrading/v5)，如果讀者目前是使用 v5 版本可以參考 [官方文件](https://reactrouter.com/docs/en/v6/upgrading/v5)。

## QuickStart

透過下方的指令可以快速的安裝 react router v6。

```bash
$yarn add history@5 react-router-dom@6
```

###### **package.json**

從 package.json 觀察，history 一樣維持版本 v5。

![](</img/posts/ruofan/react-router(1).png>)

接著來看原本 v6.0.0-beta.0 的路由是如何實作的。

```js
import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// ErrorBoundary
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

// components
import Loading from "@components/Loading";

// Code split
const HomePage = lazy(() => import("@pages/HomePage"));
const ErrorPage = lazy(() => import("@pages/ErrorPage"));
const SignUpPage = lazy(() => import("@pages/SignUpPage"));

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading />}>
        <Routes basename="/">
          <Route path="/" element={<HomePage />} />
          <Route path="/signUp" element={<SignUpPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 實作 upgrade 到 react router v6

是的，對比下來可以說是無痛升級！只有把 Routes 中的 basename 移除。

```js
import React, { useEffect, useState, Suspense, lazy } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

// ErrorBoundary
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallback from "./ErrorFallback";

// components
import Loading from "@components/Loading";

// Code split
const HomePage = lazy(() => import("@pages/HomePage"));
const ErrorPage = lazy(() => import("@pages/ErrorPage"));
const SignUpPage = lazy(() => import("@pages/SignUpPage"));

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="signUp" element={<SignUpPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
```

其中像是導頁以及操控瀏覽器歷史紀錄等行為也是無痛轉移 !

### 實作導頁使用到 useNavigate

```js
import React from "react";
import { useNavigate } from "react-router-dom";

function MemberPage() {
  const navigate = useNavigate();

  const handleEditProfole = (e) => {
    e.preventDefault();
    navigate(`/member/edit`);
  };

  return (
    <Container p="0" boxShadow="xl" h="100vh" m="auto">
      ...
    </Container>
  );
}
```

### 實作操控瀏覽器使用到 history

```js
import React, { useEffect } from "react";

import { createBrowserHistory } from "history";
const history = createBrowserHistory();

function MemberPage() {

  useEffect(() => {
    window.scrollTo(0, 0);
    window.history.pushState(null, window.location.pathname);
    const myListener = ({ location, action }) => {
      if (location.pathname === "/order/complete") {
        // Send user back if they try to navigate back
        history.go(1);
      }
    };
    const pathListen = history.listen(myListener);
    return pathListen;
  }, []);

  return (
    <Container p="0" boxShadow="xl" h="100vh" m="auto">
      ...
    </Container>
  );
}
```

## 小結

這次 react router v6 釋出的 [官方文件](https://reactrouter.com/) 寫得蠻不錯的！推薦大家閱讀！

此外，還在觀望 react router v6 的讀者可以先觀察一下 [react router github 上 提出的 issue](https://reactrouter.com/) 再做 upgrade。

## 參考資料

- [Documentation | react router v6](https://reactrouter.com/docs/en/v6)
