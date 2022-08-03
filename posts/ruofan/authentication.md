---
title: HMAC authentication
date: 2022-08-03
tags: [back-end]
author: Ruofan
layout: layouts/post.njk
---

<!-- summary -->

Hi，大家好！ 驗證權限有很多種方式，這篇文章會介紹 HMAC authentication。

<!-- summary -->

<!-- more -->

## `HMAC`

什麼是 `HMAC` ？
下方是 [rfc2104](https://datatracker.ietf.org/doc/html/rfc2104) 文件上的介紹：

> Providing a way to check the integrity of information transmitted
> over or stored in an unreliable medium is a prime necessity in the
> world of open computing and communications. Mechanisms that provide
> such integrity check based on a secret key are usually called
> "message authentication codes" (MAC).

`HMAC` 全名 Hash-based Message Authentication Code，運用加密雜湊函式同時結合一個加密金鑰，可以用在身份驗證。

![](/img/posts/ruofan/HMAC.png)

圖片來源： [@alexxubyte](<圖片來源：[https://twitter.com/alexxubyte/status/1514256034390429700/photo/1](https://twitter.com/alexxubyte/status/1514256034390429700/photo/1)>)
