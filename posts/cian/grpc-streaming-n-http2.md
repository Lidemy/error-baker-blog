---
title: gRPC 和 HTTP/2 Streaming
date: 2021-10-03
tags: [back-end, golang, gRPC, HTTP]
author: Cian
layout: layouts/post.njk
---


<!-- summary -->
<!-- gRPC（Remote Procedure Calls）是 Google 發起的一個開源的 RPC 系統。這篇文章簡單介紹 HTTP2 和 gRPC中的 streaming。 -->
<!-- summary -->

嗨，我是 Cian。
上個月初意外成為了一個前後端各半的半半工程師，過了一個月之後深深覺得這樣的生活不是我想要的，所以之後會回去專注在前端方面。雖然可以專心研究喜歡的前端很開心，但既然起了頭，這篇文章還是想做個收尾。另外，在上一篇文章之後，我才知道原來這 route 專案是官方的[教學專案](https://grpc.io/docs/languages/go/basics/)，因此，我決定來看一下補充的內容，以及延續上一篇的內容繼續往剩下的三種方向看，以及提供一些相關的資源給有興趣的同學參考。

## HTTP/2 和 Streaming 傳輸

在上一篇文章中有提到 gRPC 可以擁有 Unary、Client-side Streaming、Server-side Streaming 和 Bidirectional Streaming 四種生命週期，是受惠於 HTTP/2，這是因為在 HTTP/2 中有 Streaming 的技術，另外使用 bytecode 傳輸也是 HTTP/2 的特點。

### HTTP/2 之前——SPDY

在 2009 年， google 發布了一個稱為 SPDY 的實驗性協議。他的主要目標是希望可以解決一些 HTTP/1.1 中的性能限制來縮短網頁載入時間。這個協議的其中一個目標是將頁面加載時間（PLT）減少 50%。
想要讓頁面加載時間（PLT）減少 50%，就得知道什麼對頁面加載時間能造成巨大的影響，其中，SPDY 的創作者之一 Mike Belshe 的[一個實驗結果](https://hpbn.co/primer-on-web-performance/#latency-as-a-performance-bottleneck)提供了一個方向。

![](/img/posts/cian/grpc-streaming-n-http2/page-load-time-vs-bandwidth-and-latency.png)

他研究了不同帶寬與延遲對頁面加載時間的影響。在這個實驗中，他發現當流量從 1Mbp 變成 2Mbps 的時候，頁面加載時間確實會減半，但隨後帶寬對加載時間的影響就會急速降低，當可用帶寬超過 5 Mbps 時，這個影響就會變得非常小。從 5 Mbps 升級到 10 Mbps 時，只讓頁面的加載時間縮短了 5%。

相對於帶寬對頁面加載時間的效率遞減狀況，延遲對頁面加載時間的影響影響就十分穩定，是線性的影響。也就是說，如果要對頁面加載時間進行改善，從改善延遲來思考可能會是比較有效率的途徑。

造成延遲的原因很多，像是 TCP 協議每次開始就必須進行的三次握手、丟失表頭會造成的 data packet 阻塞等等。這些都是底層協議的影響，也就是說，如果可以更有效率地利用底層協議，就可以達成這個優化。為了達成這件事，SPDY 引入了一個新的二進制的分流幀層，用來實現 request 和 response 複用、優先級以及壓縮標頭。這使得 TCP 的利用更有效率，從而實現更短的頁面加載時間。

### HTTP/2

在 SPDY 發佈之後，這個協議逐漸被人接受，到了 2012 到了 2012 年，各個大瀏覽器都開始支援這樣技術，在這樣的潮流之下，HTTP 工作組 (HTTP-WG) 決定從中學習，並且提供正式的 HTTP/2 標準。經過許多討論之後，SPDY 規範被採納為新 HTTP/2 協議的起點。

2015 年初，IESG 審查並批准了新的 HTTP/2 標準發布。和 HTTP/1 相比，HTTP/2 可以用更少的 TCP 連結，進行更長時間的傳輸，這網路容量的利用率變高。由於過程中 SPDY 和 HTTP/2 的共同進化使服務器、瀏覽器和站點開發人員可以在新協議開發過程中獲得實際經驗。因此，HTTP/2 標準是在正式發布前經過最廣泛測試的標準之一，幾週之後就在真實世界有了不少實踐。


> 關於實驗的參考資料在[這裡](https://hpbn.co/primer-on-web-performance/#latency-as-a-performance-bottleneck)，關於優化 TCP 的資料在[這裡](https://hpbn.co/building-blocks-of-tcp/#optimizing-for-tcp)，有興趣的朋友可以進一步閱讀。

### Stream 傳輸

HTTP/2 的所有通信都會在一個 TCP 連接上完成，這個連接可以承載任意數量的雙向 byte stream。每一個 byte stream 都會有一個唯一標示符，以及可選的優先級信息。
在這個雙向 byte stream 中，又可以承載複數條 message，每一個 message 都是一個 HTTP message，像是 request 或 response。
在這些 message 中，會包含一系列的 frames。frame 是最小的通信單位，裡面會有特定類型的數據、 HTTP header 以及 payload 等等。
在一個 TCP 通訊中，由於可以同時可以有複數條 streams，所以 frame 中也會帶有 stream 的標示符，屬於不同 stream 的 frames 可以交互傳輸，之後再依據這些標示符重新組裝。

基於這樣新的傳輸結構，在 HTTP/2 上就達成了減少 TCP 連結和可以進行 Streaming 的功能。同時，因為這些傳輸使用 byte stream，gRPC 的開發中也就會需要在發送或接收請求時，進行編碼和解碼。

## Streaming RPC 可能會用上的一些食譜

### 在 Server 發送 stream
Server-side Streaming 是指 Server 收到一個 Client 的 request 時，會開啟一個 Stream 傳輸，並且回傳一個或多個 message response。
在使用 Streaming 之前，可能的做法是讓 Server 去搜尋資料，接著把在範圍內的資料放到一個 response 中回傳給 User，這在數量少的資料中也許還好，但當資料的數量變多，Server 所需要的搜尋時間就會變長，而 Client 需要等待的時間也就越久。
而其中，假設搜尋到第一筆資料只花了三秒，但全部完成搜尋花了一分鐘，所有先搜尋到的結果就必須一起等到搜尋完成，十分浪費時間。
Server-side Streaming 的做法則是每找到一筆資料就進行回傳，可以降低中間乾等的時間，讓 Client 可以更快拿到資料並進行處理。 

可以在一個 for loop 中使用 `stream.Send(item)` 在一個 stream 中回傳多個東西。


```go 
func (s *routeGuideServer) ListFeatures(rectangle *pb.Rectangle, stream pb.RouteGuide_ListFeaturesServer) error {
	for _, feature := range s.features {
		if inRange(feature.Location, rectangle) {
      // 使用 stream.Send(feature) 回傳 feature
			if err := stream.Send(feature); err != nil {
				return err
			}
		}
	}
	return nil
}
```

### Client 想知道 stream 結束的時候
接收 stream 的時候，需要知道什麼時候 stream 結束了。
這時可以使用 `io.EOF` 來處理。

```go
for { 
  // 這個 serverStream 是 Client 發 request 時接收到的 response，我們放到 serverStream 裡面
  feature, err := serverStream.Recv(){
    if err = io.EOF {
      break
    }

    if err != nil {
      log.Fatalln(err)
    }
  }
}
```

### Client 發送 stream
Client Side Streaming 是指 Client 不斷回傳 message，而 Server 則在整個 Stream 結束之後，回傳一個 message response。
在範例專案中，使用者將他所經過的點透過 Stream 不斷回傳。而 Server 則在整個 stream 結束之後，回傳一個路徑的總結。

Client 和 Server 端一樣是在 for loop 裡面用 clientStream 發送。

```go
clientStream, err := client.RecordRoute(context.Background())

// 這裡有一些 error handling...

for _, point := range points {
  if err := clientStream.Send(point); err != nil {
    log.Fatalln(err)
  }
}
```

### Client 結束發送 stream
當 Client 端發送 Stream 的時候我們需要調用 `CloseAndRecv()` 來關閉這個 stream 以讓  gRPC 知道我們已完成寫入，並且接受來自 Server 的 response。

```go
clientStream, err := client.RecordRoute(context.Background())

// 這裡有一些 Client 發送 Streaming 的 code
// 還有一些 error handling...

//  Streaming 的內容寫完了，要來關掉這個 stream
// 並且我們把 server 最後的回傳值放進 summary 
summary, err := clientStream.CloseAndRecv()
if err != nil {
  log.Fatalln(err)
}
fmt.Println(summary)
  
```

### Server 接收及結束接收 stream
在 Server 端接收 stream 的寫法基本上和 Client 是差不多的。只是當收到來自 Client 的完成訊息時，Server 端會需要發送一個結束的 response 回去給 Client。這時我們需要使用 `SendAndClose()` 來完成這件事。

```go
for {
  point, err := stream.Recv()
  if err == io.EOF {
    // 這裡知道 gRPC 結束了，所以要回傳一個 summary
    endTime := time.Now()
    return stream.SendAndClose(&pb.RouteSummary{
      // 這裡是最後的內容們
    })
  }
  if err != nil {
    return err
  }
}
```

### 計算地球上兩個點的距離
這是一個根據[半正矢公式 (Haversine formula)](https://zh.wikipedia.org/zh-tw/%E5%8D%8A%E6%AD%A3%E7%9F%A2%E5%85%AC%E5%BC%8F) 寫成的函式。
順帶一提，我看到這個函式時，他的來源說這使用了一個開源的內容，但根據內文連結並沒有真正找到那個源。

```go
func toRadians(num float64) float64 {
	return num * math.Pi / float64(180)
}

// calcDistance calculates the distance between two points using the "haversine" formula.
// The formula is based on http://mathforum.org/library/drmath/view/51879.html.
func calcDistance(p1 *pb.Point, p2 *pb.Point) int32 {
	const CordFactor float64 = 1e7
	const R = float64(6371000) // earth radius in metres
	lat1 := toRadians(float64(p1.Latitude) / CordFactor)
	lat2 := toRadians(float64(p2.Latitude) / CordFactor)
	lng1 := toRadians(float64(p1.Longitude) / CordFactor)
	lng2 := toRadians(float64(p2.Longitude) / CordFactor)
	dlat := lat2 - lat1
	dlng := lng2 - lng1

	a := math.Sin(dlat/2)*math.Sin(dlat/2) +
		math.Cos(lat1)*math.Cos(lat2)*
			math.Sin(dlng/2)*math.Sin(dlng/2)
	c := 2 * math.Atan2(math.Sqrt(a), math.Sqrt(1-a))

	distance := R * c
	return int32(distance)
}
```

---

#### 參考資料
[Introduction to gRPC | gRPC](https://grpc.io/docs/what-is-grpc/introduction/)
[Basics tutorial | Go | gRPC](https://www.grpc.io/docs/languages/go/basics/#generating-client-and-server-code)
[神奇代码在哪里Go实战#9：gRPC](https://www.bilibili.com/video/BV1DV411s7ij)
[HTTP/2 简介  |  Web Fundamentals  |  Google Developers](https://developers.google.com/web/fundamentals/performance/http2#%E6%95%B0%E6%8D%AE%E6%B5%81%E4%BC%98%E5%85%88%E7%BA%A7)
[Networking 101: Building Blocks of TCP - High Performance Browser Networking (O'Reilly)](https://hpbn.co/building-blocks-of-tcp/#optimizing-for-tcp)
[HTTP: Primer on Web Performance - High Performance Browser Networking (O'Reilly)](https://hpbn.co/primer-on-web-performance/#latency-as-a-performance-bottleneck)

---

這篇文章在我工作轉專案、換部署以及第一次在日本搬家的三重夾擊中寫成，內容恐多有不備，但遺憾短期內恐怕也不會有時間來補足。
如果不幸文章有一些錯誤，請不吝指正，我會盡可能將修正意見捕進內文中。
非常感謝各位的閱讀，之後會主要寫前端相關內容，也請多多支持！感謝～

全文同步刊載於個人部落格 [gRPC 和 HTTP2 Streaming](http://localhost:8080/posts/cian/grpc-streaming-n-http2/)