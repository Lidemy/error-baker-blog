---
title: HMAC authentication
date: 2022-08-04
tags: [back-end]
author: Ruofan
layout: layouts/post.njk
---

<!-- summary -->

Hi，大家好！ 驗證權限有很多種方式，這篇文章會介紹 HMAC authentication。

<!-- summary -->

<!-- more -->

## 什麼是 `HMAC` ？

下方是 [rfc2104](https://datatracker.ietf.org/doc/html/rfc2104) 文件上的介紹：

> Providing a way to check the integrity of information transmitted
> over or stored in an unreliable medium is a prime necessity in the
> world of open computing and communications. Mechanisms that provide
> such integrity check based on a secret key are usually called
> "message authentication codes" (MAC).

`HMAC` 全名 Hash-based Message Authentication Code，運用雜湊函式同時結合一個加密金鑰，可以用在身份驗證。

![](/img/posts/ruofan/hmac-auth.png)

圖片來源： [@alexxubyte](https://twitter.com/alexxubyte/status/1514256034390429700?s=21&t=JSFbG3_cRisO2qr9huzu4A)

從上方圖片可以看到，當 client 端拿到 server 端產生的 public key，會結合 key, request 資料, http 方法, request timestamp 還有 nonce 等資料，經過演算來產生 MAC ( Message authentication code )，後續發送 request 時帶在 header 上。

###### Request timestamp

這邊為了克服不同時區的問題，因此會採用 UNIX time。

###### Nonce

nonce 是指一組隨機的數字或是字串，並且在每一次的 request 都不同。
