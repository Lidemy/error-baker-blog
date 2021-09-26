---
title: 使用 Golang 建立一個 gRPC 架構 
date: 2021-09-25
tags: [back-end, JavaScript, golang]
author: Cian
layout: layouts/post.njk
---


<!-- summary -->
<!-- gRPC（Remote Procedure Calls）是 Google 發起的一個開源的 RPC 系統。這篇文章練習用 Go 寫出一個 Server Side streaming 的 gRPC 前後端。 -->
<!-- summary -->

嗨，我是 Cian。
上個月初意外成為了一個前後端各半的半半工程師，過了一個月之後深深覺得這樣的生活不是我想要的，所以之後會回去專注在前端方面。雖然可以專心研究喜歡的前端很開心，但既然起了頭，這篇文章還是想做個收尾。因此，這篇文章會延續上一篇的內容繼續往剩下的三種方向看，但是會著重在介紹而不是實作的 code，以及提供一些相關的資源給有興趣的同學參考。

## HTTP/2 和 Streaming 傳輸

在上一篇文章中有提到 gRPC 可以擁有 Unary、Client-side streaming、Server-side streaming 和 Bidirectional streaming 四種生命週期，是受惠於 HTTP/2，這是因為在 HTTP/2 中有 Streaming 的技術，另外使用 bytecode 傳輸也是 HTTP/2 的特點。

### HTTP/2 之前——SPDY

在 2009 年， google 發布了一個稱為 SPDY 的實驗性協議。他的主要目標是希望可以解決一些 HTTP/1.1 中的性能限制來縮短網頁載入時間。這個協議的其中一個目標是將頁面加載時間（PLT）減少 50%。
想要讓頁面加載時間（PLT）減少 50%，就得知道什麼對頁面加載時間能造成巨大的影響，其中，SPDY 的創作者之一 Mike Belshe 的[一個實驗結果](https://hpbn.co/primer-on-web-performance/#latency-as-a-performance-bottleneck)提供了一個方向。
他研究了不同帶寬與延遲對頁面加載時間的影響。在這個實驗中，他發現當流量從 1Mbp 變成 2Mbps 的時候，頁面加載時間確實會減半，但隨後帶寬對加載時間的影響就會急速降低，當可用帶寬超過 5 Mbps 時，這個影響就會變得非常小。從 5 Mbps 升級到 10 Mbps 時，只讓頁面的加載時間縮短了 5%。

相對於帶寬對頁面加載時間的效率遞減狀況，延遲對頁面加載時間的影響影響就十分穩定，是線性的影響。也就是說，如果要對頁面加載時間進行改善，從改善延遲來思考可能會是比較有效率的途徑。

造成延遲的原因很多，像是 TCP 協議每次開始就必須進行的三次握手、丟失表頭會造成的 data packet 阻塞等等。這些都是底層協議的影響，也就是說，如果可以更有效率地利用底層協議，就可以達成這個優化。為了達成這件事，SPDY 引入了一個新的二進制的分流幀層，用來實現 request 和 response 複用、優先級以及壓縮標頭。這使得 TCP 的利用更有效率，從而實現更短的頁面加載時間。

### HTTP/2

在 SPDY 發佈之後，這個協議逐漸被人接受，到了 2012 到了 2012 年，各個大瀏覽器都開始支援這樣技術，在這樣的潮流之下，HTTP 工作組 (HTTP-WG) 決定從中學習，並且提供正式的 HTTP/2 標準。經過許多討論之後，SPDY 規範被採納為新 HTTP/2 協議的起點。

2015 年初，IESG 審查並批准了新的 HTTP/2 標準發布。和 HTTP/1 相比，HTTP/2 可以用更少的 TCP 連結，進行更長時間的傳輸，這網路容量的利用率變高。由於過程中 SPDY 和 HTTP/2 的共同進化使服務器、瀏覽器和站點開發人員可以在新協議開發過程中獲得實際經驗。因此，HTTP/2 標準是在正式發布前經過最廣泛測試的標準之一，幾週之後就在真實世界有了不少實踐。

### Stream 傳輸

HTTP/2 的所有通信都會在一個 TCP 連接上完成，這個連接可以承載任意數量的雙向 byte stream。每一個 byte stream 都會有一個唯一標示符，以及可選的優先級信息。
在這個雙向 byte stream 中，又可以承載複數條 message，每一個 message 都是一個 HTTP message，像是 request 或 response。
在這些 message 中，會包含一系列的 frames。frame 是最小的通信單位，裡面會有特定類型的數據、 HTTP header 以及 payload 等等。
在一個 TCP 通訊中，由於可以同時可以有複數條 streams，所以 frame 中也會帶有 stream 的標示符，屬於不同 stream 的 frames 可以交互傳輸，之後再依據這些標示符重新組裝。

基於這樣新的傳輸結構，在 HTTP/2 上就達成了減少 TCP 連結和可以進行 Streaming 的功能。同時，因為這些傳輸使用 byte stream，gRPC 的開發中也就會需要在發送或接收請求時，進行編碼和解碼。

## Server Side streaming RPC

Server-side streaming 是指 Server 收到一個 Client 的 request 時，會開啟一個 Stream 傳輸，並且回傳一個或多個 message response。

在這個例子中，我們希望的是給定一個範圍，並讓 Server 回傳該範圍內所有景點的相關的資訊。
因此首先會需要定義 message

定義 message

```text
/* 一個區塊 */
message Rectangle {
  Point lo = 1;
  Point hi = 2;
}
```

這裡的 Point 是上次 Unary 時製作的 Point 類型。

定義 service

```text
service RouteGuide {
	// 接收一個 Rectangle 回傳 Feature stream
  rpc ListFeatures(Rectangle) returns (stream Feature) {}
}
```
這裡直接定義會傳是一串怎樣內容的 stream，在這裡是一串 Feature message 類型的 stream。

之後和 Unary 相同，在 Client 端和 Server 端個別實踐 Stub 的交互就可以了。

// 範圍的找法


## Client Side streaming

Client Side Streaming 是指 Client 不斷回傳 message，而 Server 則在整個 Stream 結束之後，回傳一個 message response。

在這個範例專案中，使用者將他所經過的點透過 Stream 不斷回傳。而 Server 則在整個 stream 結束之後，回傳一個路徑的摘要。

定義 message

```text
message RouteSummary {
  // 計算收到的 point 數量
  int32 point_count = 1;

  // 計算 Client 回傳的點中，經過了幾個景點
  int32 feature_count = 2;

  // 計算經過的距離
  int32 distance = 3;

  // 計算經過的時間
  int32 elapsed_time = 4;
}
```

定義 service

```text
service RouteGuide {
	// client-to-server streaming RPC.
	// 接收一個 Stream 的 Point，回傳一個RouteSummary
  rpc RecordRoute(stream Point) returns (RouteSummary) {}
}
  
```

##  Bidirectional streaming

```text
  // A Bidirectional streaming RPC.
  //
  // Accepts a stream of RouteNotes sent while a route is being traversed,
  // while receiving other RouteNotes (e.g. from other users).
  rpc RouteChat(stream RouteNote) returns (stream RouteNote) {}
}
```

----

> 一般來說，在一開始設計時就會直接設計好所有要做的 method 和取得的 message，所以像這樣後面才加上的做法其實並不是最推薦的。這裡因為希望每一篇文章都可以更好閱讀和理解所以才分開解說，開發時請先建立好設計。

因此今天要做的內容：
1. 在 Proto buffer 檔案中新增範圍的資料類型和 Server-side streaming 的方法
2. 實作 Client 發送
3. 實作 Server-side

## 定義 Protocol Buffers 檔案

在 `route.proto` 檔案中。
首先，定義要搜尋的 message，我們想使用的是一組由兩個點(上一篇文章中定義的 Point Message)構成的矩形。

```text
// route.proto
message Rectangle {
  Point lo = 1;
  Point hi = 2;
}
```

接著，定義 Service 

```text
// route.proto
service RouteGuide {
  // Unary (from previous)
  rpc GetFeature(Point) returns (Feature) {}
  // Server-side streaming
  rpc GetList(Rectangle) returns (stream Feature) {}
}
```







在使用 Streaming 之前，可能的做法是讓 Server 去搜尋資料，接著把在範圍內的資料放到一個 response 中回傳給 User，這在數量少的資料中也許還好，但當資料的數量變多，Server 所需要的搜尋時間就會變長，而 Client 需要等待的時間也就越久。
而其中，假設搜尋到第一筆資料只花了三秒，但全部完成搜尋花了一分鐘，所有先搜尋到的結果就必須一起等到搜尋完成，十分浪費時間。
Server-side streaming 的做法則是每找到一筆資料就進行回傳，可以降低中間乾等的時間，讓 Client 可以更快拿到資料並進行處理。 



---

### 參考資料
[Introduction to gRPC | gRPC](https://grpc.io/docs/what-is-grpc/introduction/)
[Language Guide (proto3)  |  Protocol Buffers  |  Google Developers](https://developers.google.com/protocol-buffers/docs/proto3?hl=en#simple)
[Basics tutorial | Go | gRPC](https://www.grpc.io/docs/languages/go/basics/#generating-client-and-server-code)
[Day20-Go modules - iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10207937)
[神奇代码在哪里Go实战#9：gRPC](https://www.bilibili.com/video/BV1DV411s7ij)
[「 gRPC Web 」で gRPC 実践！ Go と gRPC で WebAPI を作ってみよう！！](https://www.youtube.com/watch?v=hlyNZoaXvqU)

---

同步刊載於個人部落格 [使用 Golang 建立一個 gRPC 架構](https://keronscribe.tw/golang-grpc-unary)





## recap
RPC 是 Remote Procedure Calls （遠端程序呼叫）的簡稱。

![](/img/posts/cian/grpc-unary/rpc.png)

gRPC（Remote Procedure Calls）則是 Google 發起的一個開源的 RPC 系統。基於 HTTP/2 協定傳輸，並且使用 Protocol Buffers 作為介面描述語言（IDL）。

使用 gRPC 的流程如下：

1. 在一個 `.proto` 的  Protocol Buffers 檔案中定義想要的數據類型和方法
2. 使用 gRPC 的 CLI 指令進行編譯
3. 在編譯之後，會根據這個文件生成 Stub 的 Interface，以及一些的 Accessors（訪問器）
4. 透過實現這些 Interface 和 Accessors，我們可以輕鬆地用各種語言在各種數據流中讀寫結構化數據

![](/img/posts/cian/grpc-unary/grpc-structure.png)

gRPC Client 和 Server 可以在各種環境中運行及進行通信，而且可以自由選用支援 gRPC 的語言進行開發。
另外由於 gRPC 有嚴格的 API 規範，因此十分適合團隊使用。