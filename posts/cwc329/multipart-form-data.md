---
title: multipart/form-data 初探
date: 2022-04-30
tags: ["RFC 7578", OpenAPI, multipart/form-data, RCF]
author: cwc329
layout: layouts/post.njk
---

<!-- summary -->

筆者忝為後端工程師，一直到最近因為要直接處理上傳檔案，才碰到要接收 application/json 以外的 request content-type。
記錄一下為了開發功能去翻閱 RFC 有關於 multipart/form-data 的一些心得。

<!-- summary -->

# 前言
雖然這樣說有點不可思議，但是寫後端一年多了，我其實沒有碰過 json 以外的資料傳輸格式，即便公司產品已經有上傳 xlsx, csv 檔案並且將檔案內容如存到 DB，但是底層處理已經是前人包好，我只需要處理最後產出的 json 格式資料而已。所以我完全沒有碰過如何處理 http request body 是 json 以外的 body。

最近開發新功能，除了要將資料儲存到 DB，也要把上傳的檔案儲存到 AWS S3 備份。
這是過往沒有過的先例，於是我只好自己生出規格，並且依照規格實作接收檔案並且上傳到 S3 的功能。依照我們公司現在參照的 OpenAPI，如果要在一個 request 同時傳輸檔案與資料，要使用 `Content-type: multipart/data-form`。
基本上，現代開發使用的 npm 套件都已經處理好很多東西了，但是還是需要知道一個 request 到底長怎樣，以及需要帶什麼樣的 header 與參數，這篇文章希望能用簡單的方式分享一下我在這次研究的一些心得。

# OpenAPI Spec
一開始撰寫 API doc，為了因應需要同時傳遞資料以及檔案，根據 [OpenAPI spec](https://swagger.io/docs/specification/describing-request-body/multipart-requests/) 需要使用 multipart request。我先依照網站上面的範例把 API doc 生出來給前端之後，在參照著網頁的敘述開始研究 multipart/form-data。

## OpenAPI Multipart Request
在網頁中很清楚的寫道：
> You typically use these requests for file uploads and for transferring data of several types in a single request (for example, a file along with a JSON object)

這完全符合我的使用情境，需要同時傳輸 json 格式的資料以及一個檔案。OpenAPI 的 yaml 範例這邊先略過不談，主要是要看網頁中的 http request example。

```http request
POST /upload HTTP/1.1
Content-Length: 428
Content-Type: multipart/form-data; boundary=abcde12345
--abcde12345
Content-Disposition: form-data; name="id"
Content-Type: text/plain
123e4567-e89b-12d3-a456-426655440000
--abcde12345
Content-Disposition: form-data; name="address"
Content-Type: application/json
{
  "street": "3, Garden St",
  "city": "Hillsbery, UT"
}
--abcde12345
Content-Disposition: form-data; name="profileImage "; filename="image1.png"
Content-Type: application/octet-stream
{…file content…}
--abcde12345--
```

這是一份 http request 的內容，從第一行開始分別是 http request method 以及 發送到哪裡，
第二、三行分別是這個 request 的 headers，最後則是 request body。

這樣就可以看出一個 multipart/form-data request 到底是怎麼組成的，不過詳細到底是怎樣，需要什麼 header 以及 request body 要怎麼寫，這就要去看 RCF 了。

# RCF 7578
關於 multipart/form-data 的規格，記錄在 [RCF 7578](https://datatracker.ietf.org/doc/html/rfc7578)。這份文件詳細的紀錄 multipart/form-data 的用途、規格以及如果開發者想要傳送或者處理 multipart/form-data request 時需要注意的事情。筆者在這邊文章只會關心網頁中的 section 4，也就是其定義。

## Boundary
從上方的 http request 範例可以看到，Content-Type 除了表示這個 request 所傳送的 body 是 multipart/form-data 之外，還有一個參數 boundary，並且標明這個參數的值。而在 request body 裡面可以看到參數的值會跟著 `--` 一起出現，並且分隔 form 的不同部分。

依據 [section 4.1](https://datatracker.ietf.org/doc/html/rfc7578#section-4.1)，boundary 是 multipart 這個 media type 所需要的參數，並且會以單獨一行、`--` 為開頭再加上 boundary 組成。根據 [RFC 2046 section 5.1](https://datatracker.ietf.org/doc/html/rfc2046#section-5.1) boundary line 會出現在 request body 的開頭、結尾以及所有 part 的之間。

## Headers of Each Part
依照 [section 4.2](https://datatracker.ietf.org/doc/html/rfc7578#section-4.2) multipart 的每個 part 都必須要有 Content-Disposition 的 header，標明這個 part 的 disposition type，很明顯的 disposition type 就是 form-data。除此之外，也必須要一個 name 的參數，這個參數代表這個 part 在這份 request 中的名稱。
而如果這個 part 所夾帶的資料是個檔案，那還要再多提供一個參數 filename，代表這個檔案的名字。

[section 4.4](https://datatracker.ietf.org/doc/html/rfc7578#section-4.2) 與 [section 4.8](https://datatracker.ietf.org/doc/html/rfc7578#section-4.2) 除了必須的 header 之外，每個 part 都可以再帶 Content-Type 表明這個 part 所帶的資料是什麼格式。如果沒有指定，預設就會是 text/plain。除了 Content-Disposition 以及 Content-Type 還有 Content-Transfer-Encoding，其他 header 則不應該出現在 request body 中，而且就算出現也應該被忽略。

## Multi File for One Field
同一個 filed 可能會需要上傳多個檔案，例如一次要上傳很多張照片。根據 [section 4.4] 如果有這種需求，則每個檔案都要在不同的 part，也就是每個檔案都要用，但是可以使用相同的 field name 來表示這些檔案應該要被視作同一個 field。

## 小結
以上是我覺得 RFC 7578 section4 比較重要的規範，知道了這些就可以初步知道一個 multipart/form-data 是什麼樣子。

首先，在 http request headers 先用 Content-Type 表示這個 request 是 multipart/form-data，並且定義出 request body 要使用的 boundary。
接著則是要根據 spec 做出符合規範的並且合理的 request body。body 的開頭、結尾以及每個 part 之間都要有一行用 `--` 與 boundary 組成的分隔行。每個 part 都要先定義這個 part 的 Content-Disposition，以及如果需要的話再定義這個 part 的 Content-Type 以及 Content-Transfer-Encoding，接著再把這個 part 要傳送的資料放入。

# 結論
這次的介紹範圍較少，只侷限在 RCF 7578，不過在這篇 RCF 中其實有提到其他的 RCF，包含 RCF 的用詞定義以及 multipart 這個 media type 的 RCF 都在 RCF 7578 裡面被提到，我也有點開瀏覽。如果讀者有興趣的話，可以去看相關章節，可以對 http 有更深入的了解。這是我第一次認真讀 RCF 並且寫簡介文章，如果有不足或者錯誤的地方，請不吝留言指教。
