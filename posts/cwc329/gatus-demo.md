---
title: Gatus demo
date: 2022-09-08
tags: [Gatus, monitoring, devops]
author: cwc329
layout: layouts/post.njk
---
# Gatus Demo
<!-- summary -->

筆者參加 iThome 主辦的 2022 雲端大會，其中一個議程是 Bo-Yi Wu 所主講的「自動化監控網站運行服務 – Gatus」，第一次聽到這個監控服務，於是自己練習一下做了一個小小的 demo 分享給大家。

<!-- summary -->

## Gatus
Gatus 是一套以 Go 語言撰寫的開源網路監控軟體，可以為組織監控包含 http, tcp 等協定的網路通訊是否正常。

此軟體最常被問到的是：「目前市面上已經有很多監控服務，例如：Prometheus, Cloudwatch，Gatus 又有什麼不同，為何要選擇 Gatus 呢？」

這個問題在 [Gatus GitHub](https://github.com/TwiN/gatus#why-gatus) 頁面已經很清楚了說明了：
> Neither of these(Prometheus etc.) can tell you that there’s a problem if there are no clients actively calling the endpoint. In other words, it's because monitoring metrics mostly rely on existing traffic, which effectively means that unless your clients are already experiencing a problem, you won't be notified.

簡單來說，這些監控服務只有在監控對象有被使用的時候才會有記錄，而記錄中有問題才會被發現。假設今天有個 endpoint 本身有問題，不論是連線或者是回傳值，如果這個 api 沒有被使用的話，就無法從這些監控服務得知狀況。

而 Gatus 則是可以自動去測試這些 endpoint，並且透過預先寫好的 config 去判斷這個 endpoint 是否健康、是否正常。這就是 Gatus 與其他監控服務不同之處，也是其特色。

## Demo
在 Gatus 的 GitHub 裡面就有一些基本的 config，供使用者在不同情境下使用。

筆者在這個基礎之上使用 docker 以及 docker-compose 寫了一個小小的 [demo](https://github.com/cwc329/gatus_demo) 稍微展示一下 Gatus 的功能。

筆者在這個 demo 簡單地寫了一個小小的 express server，透過 docker 打包好之後用 docker-compose 把 demo server 以及 Gatus 都架起來，並且用 Gatus 去監控這個 demo server 的狀況。跑起來的話會是這樣：
![](/img/posts/cwc329/gatus_demo/1.png)

筆者在 [demo server](https://github.com/cwc329/gatus_demo/blob/main/index.js) 的一些 endpoint 動了一些手腳，並且在 [config](https://github.com/cwc329/gatus_demo/blob/main/config/config.yaml) 裡面對這些 endpoint 設定不一樣的健康條件。

一般來說，對於 endpoint 最在意的就是他能否正常的回應。在 `/mayBreak` 這個 endpoint，筆者就隨機回傳 100 - 500 的 status code，而在 config 裡面檢查這個 endpoint 是否回傳介於 200 - 299 之間的 code。而在上圖可以看到 `/mayBreak` 這個 endpoint 時好時壞。

而有的時候即使 endpoint 都會回傳 2XX，但是速度很慢也值得注意，可能是程式有效能瓶頸，或者是系統有哪個地方出現問題。在 `/slow` 這個 endpoint 筆者就設定回傳時間會延遲 0-4 秒，而在 config 裡面設定這個 endpoint 需要在 2 秒內回傳。上圖的監控有能看到這個 endpoint 時好時壞。

## 可能使用情境
在雲端大會看到這個開源軟體的時候，正好前陣子客戶環境遇到雲端主機都正常，但是 API 回傳很慢，導致客戶使用體驗不佳。而因為筆者平常只會去看機器的 log，並沒有將 API 的 log 導入 Cloudwatch，所以無法在第一時間發現問題，即使收到客戶回報問題，也要從茫茫的 log 海中找到對應的 log。不論是發現問題還是定位問題都很沒有效率。而且因為敝公司的系統滿複雜的，客戶並不是所有的服務都會用到。Gatus 這套工具看起來是能解決問題的。

不過重新想一下，因為商業模式以及合約的關係，因應維運需求工程師們有調閱程式 log 的權限，但是 RD 部門並不能進入客戶環境。也就是說即使知道某個 endpoint 有問題，工程師們也只能在開發環境下重現，並不能直接使用客戶的資料。更甚者，不能進入客戶環境，代表這些開放給客戶使用的 API 在沒有授權的狀況下 RD 也不能使用。所以如果 RD 部門想要使用 Gatus 來監控客戶環境的 API 是否正常，基本上是一項不可能的任務。

不過筆者在翻閱文件的時候發現 Gatus 除了監控 web API 之外，也能去看使用 TCP 協定的網路服務連線是否正常。剛好敝公司硬體部門前陣子的案例是客戶工廠的 IoT 服務有問題，找 Bug 找了好久，後來發現是有一台 Redis server 無法連上，在重啟這台 server 之後就恢復正常了。也就是說雖然敝公司無法使用 Gatus 作為監控客戶服務的工具，但是依然可以作為監控我們某些服務的工具。

所以筆者淺見，Gatus 要使用的話也要考慮到各家的商業模式以及合約。如果是做內部系統，基本上都有權限可以存取 web API 的話可以用這個作為一個輕量快速的監控系統。而如果需要監控沒有或者僅有受限權限的環境，Gatus 就可能不是一個好的解法。

## 延伸練習
Gatus 還有很多可以使用的設定，用起來滿有趣的。
我在 demo 中有附上使用 gmail 收到 alerting mail 的 config 範例，讀者如果有興趣可以把 demo clone 下來自己修改，讓自己的收到這些信件，不過記得可以先把 interval 調低，或者也可以設定 threshold 在一定錯誤之後才發送信件，避免被眾多警示信塞滿信箱。

這是我久違的文章，分享一下最近得知的新玩意兒，請大家多多指教。
