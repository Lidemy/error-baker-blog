---
title: 初探 swagger-ui
date: 2021-10-24
tags: [swagger-ui, swagger-editor, API-doc, OpenAPI, npm]
author: cwc329
layout: layouts/post.njk
---

<!-- summary -->

swagger-ui 是我最近接觸到的一項工具，使用者可以依照 OpenAPI 規範，將自己的 API 撰寫成 YAML 或者 JSON 檔案，再藉由 swagger-ui 轉換成一個 API 文件網頁。這個網頁可以部署在主機，或者放在專案中，需要的時候在 local 架起來檢視。

<!-- summary -->

# Swagger-ui

swagger-ui 我們團隊最近引入的一項工具，想要把原本四散各處而且不完整的 API 文件整理，並且用一個對於工程師而言比較容易取得的方式管理。

剛接觸的時候因為不太熟悉 YAML 撰寫方式以及 [OpenAPI](https://github.com/OAI/OpenAPI-Specification) 規範稍微麻煩一些，
不過上手難度不高，搭配 [swagger-ui-watcher](https://www.npmjs.com/package/swagger-ui-watcher) 或者其他類似套件可以做到更好的分層管理，讓 API doc 的撰寫可以更模組化更快速。

## Swagger-ui Online Demo

Swagger 官方有網頁的線上 ui demo 與 editor demo，我們可以先從這兩個網站一窺 swagger 到底是什麼樣子，以及要怎麼使用。

先看 [ui](https://petstore.swagger.io/?_ga=2.19666047.679151482.1635056385-1464799535.1632669410) 的頁面
![](/img/posts/cwc329/swagger-ui-demo/1.png)
![](/img/posts/cwc329/swagger-ui-demo/2.png)
![](/img/posts/cwc329/swagger-ui-demo/3.png)

頁面很清楚地列出 API 的 method 以及 path，點開之後可以看到更多相關資訊，像是接受什麼 parameter，以及會有什麼 response。

而且 `try it out` 的 button 點下去可以實際操作 API，讓使用者可以直接使用 API，不需要再切換到 postman 等工具，達成在同時看到 API 的文件與測試 API。

而 swagger-ui 產生這個頁面的方式是藉由預先撰寫好的 YAML 或者 JSON 檔案，讀取檔案內容之後將其渲染。這點可以從 [editor demo](https://editor.swagger.io/) 看到。
![](/img/posts/cwc329/swagger-ui-demo/4.png)
畫面左方就是 YAML 檔案，而右方則是依照左方的 YAML 檔案渲染出來的 ui 頁面。

這份 YAML 檔案首先要標明所使用的是哪一個版本的規範，先前提過的 OpenAPI 規範，其前身就是 swagger specification，是在 swagger 底下的，後來才獨立出來變成 OpenAPI 規範。YAML 與 JSON 文件只要依照這個規範撰寫，就可以在 swagger 底下自動產生出一份包含 methods, parameters 與 models 的 API 文件。

實際上的撰寫在下一部份會比較詳細的說明。

## Swagger-ui-watcher

> 以下的示範程式碼都可以在[這裡](https://github.com/cwc329/swagger-ui-demo)找到。
> 這是一份可以在 local 跑起來的小小 demo，有興趣可以 clone 下來玩玩看。

剛剛的 editor 頁面其實就可以示範怎麼撰寫 YAML 檔案，同時也能及時顯示出這份檔案在哪邊不符合規範。不過很麻煩的是那個頁面只支援單一 YAML 檔案渲染，也就是需要把整個 API 文件都寫在同一個檔案中才能在這邊渲染，這在實際撰寫的時候非常麻煩。

這邊我要介紹一個我們公司專案使用的工具，swagger-ui-watcher。這是一個 npm 上的套件，開發上主要的功能是可以在本地端快速的架設一個 swagger-ui 的 server，並且監聽特定的檔案，當檔案有變動時可以即時的重新渲染畫面，而且當檔案格式有錯時也會有錯誤訊息。最重要的是，這個套件可以把多個檔案自動彙整為一個完整的檔案，所以在寫文件的時候可以使用模組化的方式，能夠讓文件的原始碼更容易撰寫與維護。

![](/img/posts/cwc329/swagger-ui-demo/5.png)

像是範例程式碼中，我簡單地區分資料夾，讓不同的 endpoint 可以分開，同時也有一個 schema 的資料夾去存放各種常用的資料結構。資料夾可以依照每個專案有不同的設計，這點非常有彈性。

這邊可以先打開 [index.yaml](https://github.com/cwc329/swagger-ui-demo/blob/main/docs/index.yaml) 看看。

```yaml
openapi: 3.0.3

info:
  title: PIMQ workshop API
  description: PIMQ workshop api document
  version: 4.0.0

servers:
  - url: http://localhost:5566
    description: for local demo

tags:
  - name: "posts"
    description: "Posts of the site"
  - name: "comments"
    description: "Comments of posts"
```

可以看到我一開始定義我要使用的是規範版本是 3.0.3。info 是這個 API 的一些資訊。servers 是這個 API 有哪些 server，這邊寫出來的 server 都可以在 ui 的頁面選擇並且從頁面發送 request。tags 可以把我的 API 分類，在頁面上可以看到我的 API 依照不同的 tag 被放在不同的 block。
![](/img/posts/cwc329/swagger-ui-demo/6.png)

```yaml
paths:
  /posts:
    get:
      tags:
        - posts
      summary: get a list of posts
      responses:
        "200":
          description: ok
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    title:
                      type: string
                    cotent:
                      type: string
                    authorId:
                      type: integer
    post:
      tags:
        - posts
      summary: add a new post
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                title:
                  type: string
                content:
                  type: string
                authorId:
                  type: integer
      responses:
        "200":
          description: ok
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: integer
                  content:
                    type: string
                  title:
                    type: string
                  authorId:
                    type: integer
```

paths 就是 API 的路徑，依照 OpenAPI 的規範，paths 這個 object 下面的 field 是有
格式規範的，像是必須要以 `/` 開頭才行。路徑下面可以列出這個路徑所接受的 http request method。method 下面則包含這個 method 屬於哪個 tag，這就是在前面所寫好的 tags，同時也可以用 summary 以及 description 來簡述與詳述這支 API 的功能。parameter 與 requestBody 則是描述這個 API 可以接受怎樣的參數以及怎樣的 request body，包括參數的名稱、資料型態、規範等。responses 則是這個 request 會有什麼樣的 response，這些 response 會有什麼樣的 http status code，這些回應有什麼意義，又會回傳什麼資料。

雖然寫了滿長一段的，不過如果熟悉 YAML 檔案應該很容易就可以看出其結構，也能發現這個結構其實很清楚。

不過如這章節一開始所說，如果把所有的東西都寫在一起會非常難管理。
於是接下來的幾個 path 就使用了 `$ref` 這個關鍵字，讓我們可以用 reference 的方式引入其他 YAML 檔案，方便我們管理與撰寫原始碼。

```yaml
/posts/{postId}:
  $ref: posts/index.yaml#/post-collections

/comments:
  $ref: comments/index.yaml#/comments-collections
/comments/{commentId}:
  $ref: comments/index.yaml#/comment-collections
```

根據 OpenAPI [reference object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.1.md#reference-object) 可以使用相對路徑引入檔案，而如果要使用檔案中的某個 field，在檔案後用 `#` 加入 hash router 就可以了。是非常方便的方法。所以在這邊我就可以把 comments 與 posts 分成不同的資料夾管理，並且把資料夾中的東西放在 index.yaml 中，方便取用。

以 GET `/posts/{postId}` 為例，其 ref 是 [posts/index.yaml#/post-collections](https://github.com/cwc329/swagger-ui-demo/blob/main/docs/posts/index.yaml)。

```yaml
post-collections:
  get:
    $ref: getPost.yaml
  put:
    $ref: updatePost.yaml
  delete:
    $ref: deletePost.yaml
```

想要看 GET `/posts/{postID}` 就要去 [getPost.yaml](https://github.com/cwc329/swagger-ui-demo/blob/main/docs/posts/getPost.yaml) 看。

```yaml
tags:
  - posts
summary: get a post
parameters:
  - $ref: ../schemas/index.yaml#/parameters/postId
responses:
  "200":
    description: ok
    content:
      application/json:
        schema:
          $ref: ../schemas/index.yaml#/schemas/objects/post
```

可以看到我這邊 parameter 與 response 的 schema 都是使用 ref 的方式，這樣使用的好處是因為 postId 以及 post 的回覆其實很多地方都會使用到，如果不用 ref 的方式而是在每個地方都寫，這樣維護上很麻煩，假設今天 postId 從原本的流水號變成 uuid，又或者 post 要增加一個屬性，在維護文件上會很麻煩。但是使用 ref 並且事先寫好，就可以避免這種問題。

我習慣把 component 的定義統一放在 schema 的資料夾中，由於現在使用資料結構不多，我先偷懶用一個 [index.yaml](https://github.com/cwc329/swagger-ui-demo/blob/main/docs/schemas/index.yaml) 管理，簡單的分成 parameters, requestBodies, responses 與 schemas，這些命名都是依照 [components object](https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.1.md#components-object) 的規範去命名。把這些

應用 component 以及 reference 就可以建立有效率、可以重複使用的各種小元件，讓撰寫 API 文件變得迅速。

文章到此其實基本的撰寫已經差不多了，如果讀者想要自行練習的話我有兩個小習題可以做。

1. 我在 swagger-ui-demo 的 repo 中已經有建立兩個 parameter: order 與 sort，這是讓 API 把回傳的東西排序。請把這兩個 parameter 加到 GET `/posts` 中並且試著用加上這兩個 parameter 去發送 request。

2. 在 demo 的 API server 中其實還有一個 API path 我沒有寫在文件中，大家可以到 http://localhost:5566 首頁去看一下 json-server 預設會有哪些 path, request bodies 以及 response，並且試著加在 swagger-ui 上。

第 1 題會比較簡單。第 2 題就比較困難，因為基本上是要自己從 0 開始。
那今天的介紹就大概到這邊。
感謝！
