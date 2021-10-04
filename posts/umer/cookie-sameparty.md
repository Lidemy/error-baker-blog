---
title: 介紹 Cookie 的新屬性 SameParty
date: 2021-10-05
tags: [cookie, google]
author: Umer
layout: layouts/post.njk
---

<!-- summary -->
<!-- 介紹 Cookie 的新屬性 SameParty -->
<!-- summary -->
<!-- more -->

# 介紹 Cookie 的新屬性 SameParty

![](https://i.imgur.com/jYgKebp.png)

最近研究 Cookie 的時候發現有一個之前沒看過的屬性，SameParty 屬性，一查之後發現是個挺新的屬性，查到的資料普遍在最近兩年而且還在開發中（但是 [chrome](https://www.chromestatus.com/feature/5280634094223360) 已經在支援了），並且幾乎都是英文資料，所以這篇文章就來介紹我目前對這個新屬性的理解以及它想解決的問題。

## 第一方 Cookie 與第三方 Cookie

Cookie 本質上沒有第一方、第三方之分，這兩種分法是一種相對的概念，取決於 Cookie 的來源以及傳送 Cookie 的目的地，例如我在瀏覽露天拍賣(sale.com)的時候，把購物車裡面的商品內容存在 Cart Cookie，當我在瀏覽 PChome (pchome.com)的時候，由於兩者的域名不同，因此對於 PChome 而言， Cart Cookie 就是一個第三方 Cookie，對於露天而言則是第一方 Cookie。

## SameSite 的三種值 Strict, Lax, None

那麼，該怎麼限制 Cookie 是否要傳送（限制原因比如 Cookie 有存放重要資訊，或是避免 CSRF）？方法之一是透過設定 Cookie 的 SameSite 屬性。
這個屬性有三種值。

`Strict`，只允許第一方 Cookie 傳送，不會傳送給任何不同域名(不會有 cross-site requests)，可以避免一定程度的 CSRF

`Lax`，允許第一方 Cookie 傳送，和某些條件下的第三方 Cookie 傳送，例如
* 輸入網址
* `<a href="...">`
* `<form method="GET">`
* `<link rel="prerender" href="...">`
* `<form method="POST">`

`None`，允許第三方 Cookie 傳送

https://ithelp.ithome.com.tw/articles/10251288
## SameSite 的缺點

目前隱私意識崛起，主流瀏覽器也打算逐步禁用第三方 Cookie，雖然有`SameSite=Lax`這個屬性能在有限程度上傳送第三方 Cookie，但是在實作上通常一家大廠都不會只有單一一個域名，而是會有許多域名來提供各種服務，這些域名的 Cookie 彼此之間都是第三方 Cookie，但都是為在同一個廠商底下管理，彼此之間要共享 Cookie 實在不容易，因為對瀏覽器而言它們都是第三方 Cookie。

以前面的 PChome 例子來說，PChome 其實有很多子公司，並且露天也是它的合資企業之一，更不用說一家大廠也可能委託其他廠商來提供服務，如果 PChome 和露天或是其他合作廠商想要共享某些 Cookie，那麼在 SameSite 屬性底下其實很難做到。

## Chromium projects 的 First-Party Sets

針對同一廠商底下會有多個域名想共享 Cookie 的情況，Google 使用 First-Party Sets 來實作這個功能。
在想要共享 Cookie 的 Server 底下的路徑添加一個 JSON 檔案 `<owner site>/.well-known/first-party-set`，檔案裡面需要紀錄共享域名們的相關資訊，↓
```json
{
owner:"https://fps-owner.example",
members:[
"https://fps-member1.example",
"https://fps-member2.example"
]
}
```
以及 membersite 底下也要有相對應的配置↓
```json
{
  owner: "https://fps-owner.example"
}
```

更詳細的配置和測試方式可以參考[Chromium projects](https://www.chromium.org/updates/first-party-sets)

## Cookie 的新屬性 SameParty

使用了 First-Party Sets 的域名要共享 Cookie 之前，需要設定 Cookie 的 SameParty 屬性
`Set-Cookie: name=tasty; Secure; SameSite=Lax; SameParty`（SameParty 在比較新的 Chrome 瀏覽器才有，Google 建議加上 SameSite 來支援較舊的瀏覽器版本）。
如此一來，不同域名之間(example.com, example.rs, example.co.uk)就可以共享 Cookie 了。

## 總結

SameParty 屬性在我看來類似於 SameSite=Strict 的延伸版，也有對 CSRF 做處理，具體的 Cookie 傳送規則可以參考這張圖片。

`owner.example` 擁有這兩個網域 `member1.example`, `member2.example`，`member1.example`，在設定了 SameParty 的情況下，`member1.example` 的 Cookie 不會傳送到非 SameParty 的網域。
![SameParty Rule](https://raw.githubusercontent.com/cfredric/sameparty/main/images/same_party_table.png)

同時，`member1.example` 也不會把 Cookie 傳給  `member2.example` 
![SameParty Rule](https://github.com/cfredric/sameparty/raw/main/images/same_party_sop.png)

在查資料的途中，發現到 W3C 其實不贊同 SameParty 的功能([來源](https://www.theregister.com/2021/04/08/w3c_google_multple_domains/))，即使如此 Chrome 已經在 Chrome 89 以上實作這個功能 ( [Google](https://github.com/cfredric/sameparty) )瀏覽器了，使用了 Chromium 的 Edge 瀏覽器也有這個功能，兩方勢均力敵。

## 相關資料
[SameSite 那些事](https://segmentfault.com/a/1190000040161207)
[详解 Cookie 新增的 SameParty 属性](https://juejin.cn/post/7002011181221167118#heading-5)
[SFirst-Party Sets](https://github.com/privacycg/first-party-sets7)
[SameParty cookie attribute explainer
](https://github.com/cfredric/sameparty)
