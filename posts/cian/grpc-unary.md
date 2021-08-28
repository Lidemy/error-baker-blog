---
title: 初探 gRPC
date: 2021-08-08
tags: [back-end]
author: Cian
layout: layouts/post.njk
---
<!--summary-->

嗨，我是 Cian。
最近意外成為了一個前後端各半的半半工程師，這篇文章和大家分享最近研究 gRPC 的成果。

## 首先， RPC 是什麼？
RPC 是 Remote Procedure Calls （遠端程序呼叫）的簡稱。
簡單來說，RPC 是一種調用遠端程序的模式。它讓我們在使用遠端的 Procedure 的時候，可以像使用 local 調用一樣方便。
Client 和 Server 都會有一個 Stub（樁），這個 Stub 會把底下的處理抽象化，因此對於 Client 端來說，他是和 Stub 互動，並不會在意他使用的這個函數實際上寫在哪。
因為可以像是調用本地函式一樣調用遠端函式，這個模式解决了分布式系統中 Server 間的調用問題。

![](/img/posts/cian/grpc-unary/rpc.png)

這張圖簡單描述了整個 RPC 的過程：
1. Client 的 Application 是這個 Procedure 的調用方，他會調用 Client Stub 中的 Method
2. Client Stub 是一個把調用過程包裝起來的代理對象，他其實並不擁有 Client Application 想要調用的 Method，所以他會向外進行 RPC 的調用。
3. 這個調用接著經過的 Client Run-time Library 是一個實現 RPC 的工具包
4. 最後我們會透過底層網路實現 data 的傳輸。

在這中間，因為只是想調用一下遠端的 Procedure，所以 RPC 其實常常選用傳輸效率更高的二進制傳輸，過程中會有序列化和反序列化的部分。

## gRPC

接著，來看一下 gRPC 是什麼。
gRPC（Remote Procedure Calls）是 Google 發起的一個開源的 RPC 系統。目標是讓我們可以更輕鬆地創建分佈式應用程序和服務。

![](/img/posts/cian/grpc-unary/grpc-structure.png)

gRPC 基於 HTTP/2 協定傳輸，並且使用 Protocol Buffers 作為介面描述語言（IDL）。也就是說，我們會需要使用 Protocol Buffers 語法和檔案類型，事先定義好要接收的方法和回傳的類型，接著 gRPC 會根據這個文件生成 Stub 的 Interface。透過實現這些 Interface，我們就可以做出使用 gRPC 的系統。

gRPC Client 和 Server 可以在各種環境中運行及進行通信，而且可以自由選用支援 gRPC 的語言進行開發。舉上圖的例子來說，我們可以在 Server 端，以 C++ 開發 gRPC Server，並且在 Client 端同時選用 Ruby 和 Android Java 來開發。
另外由於他有嚴格的 API 規範，因此也十分適合團隊使用。

## Protocol Buffers

雖然 gRPC 也可以使用像是 JSON 等其他數據格式，但它預設的 IDL是 Protocol Buffers，一種序列化結構化數據。

Protocol Buffers 的[官網](https://developers.google.com/protocol-buffers)上是這樣介紹自己的：

> Protocol buffers are Google's language-neutral, platform-neutral, extensible mechanism for serializing structured data – think XML, but smaller, faster, and simpler.

簡單翻譯是「Protocol Buffers 是 Google 的語言原生、平台原生的可擴張機制。用於序列化結構化的 data。有點像是 XML，但更小、更快也更簡單。」

使用 Protocol Buffer 寫 gRPC 的流程是這樣的：

1. 在一個 `.proto` 檔案中定義想要怎樣進行數據的結構化
2. 在 Compile 之後，我們會接著會得到一組特別生成的 Source code，以及使用它的 Accessors（訪問器）。
3. 透過這個 Accessors，我們可以輕鬆地用各種語言在各種數據流中讀寫結構化數據。

## gRPC 的四種生命週期

gRPC 有四種生命週期，可供不同的使用場景選用：

* Unary：一對一
  一個 request 對上一個 response
* Client-side streaming: 多對一
  Client 送很多個請求（Streaming），結束之後 server 只回一個 response
* Server-side streaming：一對多
  Client 只上傳一個請求，但 Server 回一堆 response（Streaming）
* Bidirectional streaming：多對多
  Client 和 Server 都以 Streaming 的形式交互

## 實作 Unary

作為練習，我們實作一個 Unary 的 gRPC 系統。目標是 Client 給定一個座標，Server 會返回對應的景點名。

## 定義 Protocol Buffers 檔案

新增一個 `route.proto` 檔案
首先，定義要回傳的 message 類型，我們想回傳的是一個位置情報，會有這個地點的名字和他的座標。

```text
// route.proto
/* 指定使用的是 proto3 的語法 */
syntax = 'proto3';

option go_package = "github.com/keronscribe/learn-go/grpc/route";
/* option 不會改變聲明的整體含義，但可能會影響它在特定上下文中的處理方式 */

package route;

/* 定義要回傳的 message 類型，我們想回傳的是一個位置情報 */
/* 座標訊息 */
message Point {
    int32 latitude = 1; // 把一個數字作為key使用，可以壓縮長度。要從 1 開始。
    int32 longitude = 2;
}
/* 相關訊息 */
message Feature {
    string name = 1;
    Point location = 2;
}
```

接著，定義要進行回傳的方法 `GetFeature`，他會接收一個座標情報，並且回傳這個座標上的景點訊息。

```text
// route.proto

service RouteGuide {
  // Unary
  rpc GetFeature(Point) returns (Feature) {}
}
```

### go.mod
我們會需要一個 `go.mod` 檔案來描述我們的專案將使用的 modules，不然後期可能會遇到引入問題。

```go
module github.com/keronscribe/learn-go/grpc

go 1.16

require (
	google.golang.org/grpc v1.38.0
	google.golang.org/protobuf v1.26.0
)
```

### 生成 stub code
接著，我們要產生 `route.pb` 文件和 `route_grpc.pb` 兩個文件，在這裡我們使用 Go 語言。
使用[官方提供的指令](https://www.grpc.io/docs/languages/go/basics/#generating-client-and-server-code)

```shell
protoc --go_out=. --go_opt=paths=source_relative --go-grpc_out=. --go-grpc_opt=paths=source_relative route.proto
```

* 可能會遇到「Please specify a program using absolute path or make sure the program is available in your PATH system variable --go_out: protoc-gen-go: Plugin failed with status code 1.」error，可以參考 [protocol buffers - Unable to build protobuf to go endpoint](https://stackoverflow.com/questions/28099004/unable-to-build-protobuf-to-go-endpoint) 這篇文章提供的方法，對我有效。

在剛剛的指令完成之後，我們在 `route_grpc.pb` 文件中找到一些 gRPC 生成的 Interface
首先，我們看到 Server

```go
// RouteGuideServer is the server API for RouteGuide service.
// All implementations must embed UnimplementedRouteGuideServer
// for forward compatibility
type RouteGuideServer interface {
	// Unary
	GetFeature(context.Context, *Point) (*Feature, error)
	mustEmbedUnimplementedRouteGuideServer()
}
```

這一段程式碼，是 gRPC 為了我們在 `route.proto` 中定義的 service `RouteGuide` 做的 API。
接下來我們會在 Server 端做出這個方法的實踐。

同樣的我們也可以找到 Client 的 API

```go
// RouteGuideClient is the client API for RouteGuide service.
//
// For semantics around ctx use and closing/ending streaming RPCs, please refer to https://pkg.go.dev/google.golang.org/grpc/?tab=doc#ClientConn.NewStream.
type RouteGuideClient interface {
	// Unary
	GetFeature(ctx context.Context, in *Point, opts ...grpc.CallOption) (*Feature, error)
}
```

我們接下來，要分別在 Client 和 Server 分別去把其中的方法實踐出來

### Server Side
我們從 Server Side 開始。
這部分要做的事情有：
1. 製作資料庫
2. 資料處理
3. 開一個 Listener 監聽 request

## 資料庫

在 `route/` 資料夾旁邊生成一個 `route-server/` 資料夾，並新增一個 `server.go` 檔案，我們要在這裡實現 Server stub 的 interface。
首先，定義 routeGuideServer 的 type

```go
import (
  pb "github.com/keronscribe/learn-go/grpc/route" // 透過 `proto` 生成的 Server Stub
)

type routeGuideServer struct {
	pb.UnimplementedRouteGuideServer
}
```

在這裡，因為在這個 `routeGuideServer` interface 中有一個 `mustEmbedUnimplementedRouteGuideServer()`，所以必須要在這裡有這個東西，他是用來實現向上兼容的。

接著我們先做 Server 的假 DB 部分。
在這個 `routeGuideServer` 中，加上這一行 DB 的 type 定義。

```go
type routeGuideServer struct {
  pb.UnimplementedRouteGuideServer
	features []*pb.Feature
}
```

我們把這個 DB 叫做 `features`，裡面是有個一些 feature 的 Slice。
接著塞入資料的 function。

```go
func newServer() *routeGuideServer {
	return &routeGuideServer{
		db: []*pb.Feature{
			{
				Name: "東京鐵塔",
				Location: &pb.Point{
					Latitude: 353931000,
					Longitude: 139444400,
				},
			},
			{
				Name: "淺草寺",
				Location: &pb.Point{
					Latitude: 357147651,
					Longitude: 139794466,
				},
			},
			{
				Name: "晴空塔",
				Location: &pb.Point{
					Latitude: 357100670,
					Longitude: 139808511,
				},
			},
		},
	}
}
```

### 資料處理

這個 Server 的目標是在收到一個座標的時候，回傳相對應的景點資訊，在這裡我們先簡單使用 for loop 遍歷進行比對，並回傳合適的資料。
也就是作出 API 中的 `GetFeature(context.Context, *Point) (*Feature, error)` 的實體：

```go
// import 要加上這兩個 Library
import (
  pb "github.com/keronscribe/learn-go/grpc/route"
  "context" // 新增
  "google.golang.org/protobuf/proto" // 新增
)

func (s *routeGuideServer) GetFeature(cxt context.Context, point *pb.Point) (*pb.Feature, error){
	for _,feature := range s.features{
		if proto.Equal(feature.Location, point){
			return feature, nil
		}
	}
	return nil, nil
}
```

### Listener
最後是在 main 中開一個 Listener 監聽，如果沒有問題，就使用 gRPC 內建的 Server 來進行處理。

到這裡的 import 區
```go
import (
  "log" // 新增
	"net" // 新增
	"context"

	pb "github.com/keronscribe/learn-go/grpc/route"
  "google.golang.org/protobuf/proto"
	"google.golang.org/grpc"  // 新增 grpc library
)
```

```go
func main() {
	// 生成一個listener
	lis, err := net.Listen("tcp", "localhost:5000")
	if err != nil {
		log.Fatalln("cannot create a listener a the address")
	}

	// gRPC Server
	grpcServer := grpc.NewServer()
	pb.RegisterRouteGuideServer(grpcServer, newServer())
	log.Fatalln(grpcServer.Serve(lis))
}
```

沒有問題的話跑起來會長這樣

![](/img/posts/cian/grpc-unary/grpc-server-running.png)

## Client

這裡我們先寫 main 去調用我們等等會寫的 getFeat function。

```go
package main

import (
	pb "github.com/keronscribe/learn-go/grpc/route" // 透過 `proto` 生成的 Client Stub
	"google.golang.org/grpc" // grpc library
	"log"
)

func main (){
	conn,err:= grpc.Dial("localhost:5000", grpc.WithInsecure(), grpc.WithBlock()){
		if err != nil{
			log.Fatalln("Client cannot dail grpc server")
		}
	}
	defer conn.Close() // 在程式的最後要關掉 conn

	client := pb.NewRouteGuideClient(conn)
	getFeat(client)
}
```
Dial 是 grpc 提供的一個方法，會是一個 dail 請求，第一個參數會說他要播向哪裡，之後是一些 option。
`grpc.WithInsecure()`：因為現在 server 端沒有提供驗證，所以使用 Insecure 來跳過驗證
`grpc.WithBlock()`：如果沒有成功就不讓他往下走的一個選項

NewRouteGuideClient 是 grpc 自動生成在 Client stub 產生的一個方法，可以在 `route_grpc.go` 找到它的定義，不過總之他會接收一個連接的 Interface，並且回傳一個 RouteGuideClient 類型的東西。
最後，只要實作 getFeat 就可以了。

```go
func getFeat (client pb.RouteGuideClient) {
	feature,err := client.GetFeature(context.Background(),&pb.Point{
		Latitude: 353931000,
		Longitude: 139444400,
	})
	if err != nil{
		log.Fatalln()
	}
	fmt.Println(feature)
}

```



在製作時，會有像這樣的 suggest，調用 Server 的 GetFeature 就像是調用 local 的 method 一樣方便。

![](/img/posts/cian/grpc-unary/get-feature-suggest.png)

整個 Client 端的程式碼如下

```go
package main

import (
	"context"
	"fmt"
	pb "github.com/keronscribe/learn-go/grpc-unary/route"
	"google.golang.org/grpc"
	"log"
)

func getFeat (client pb.RouteGuideClient){
	feature,err := client.GetFeature(context.Background(),&pb.Point{
		Latitude: 353931000,
		Longitude: 139444400,
	})
	if err != nil{
		log.Fatalln()
	}
	fmt.Println(feature)
}

func main () {
	conn, err := grpc.Dial("localhost:5000", grpc.WithInsecure(), grpc.WithBlock())

	if err != nil{
		log.Fatalln("Client cannot dail grpc server")
	}

	defer conn.Close()

	client := pb.NewRouteGuideClient(conn)
	getFeat(client)
}

```

只有三十幾行，非常簡潔。整個開發也很簡單流暢。
兩邊都跑跑看，結果就會像這樣。

![](/img/posts/cian/grpc-unary/result.png)

今天先做到簡單的 Unary，完成可以連接的前後端。
下一篇文章會繼續嘗試剩下三種生命週期。


### 參考資料
[Introduction to gRPC | gRPC](https://grpc.io/docs/what-is-grpc/introduction/)
[Language Guide (proto3)  |  Protocol Buffers  |  Google Developers](https://developers.google.com/protocol-buffers/docs/proto3?hl=en#simple)
[Basics tutorial | Go | gRPC](https://www.grpc.io/docs/languages/go/basics/#generating-client-and-server-code)
[Day20-Go modules - iT 邦幫忙](https://ithelp.ithome.com.tw/articles/10207937)
[神奇代码在哪里Go实战#9：gRPC](https://www.bilibili.com/video/BV1DV411s7ij)
[「 gRPC Web 」で gRPC 実践！ Go と gRPC で WebAPI を作ってみよう！！](https://www.youtube.com/watch?v=hlyNZoaXvqU)
