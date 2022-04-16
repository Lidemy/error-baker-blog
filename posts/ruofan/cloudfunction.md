---
title: 設定 multiple functions with cloud function
date: 2022-04-16
tags: [back-end]
author: Ruofan
layout: layouts/post.njk
---
<!-- summary -->

Hi，大家好！ 前陣子在實作透過 Serverless 的架構建構出獨立的 service，這篇文章會和大家分享如何透過 cloud function 在專案上設定多個 function。

<!-- summary -->
<!-- more -->

## 什麼是 cloud function ？

以下是 [Firebase 官方文件](https://firebase.google.com/docs/functions) 上的說明。

> Cloud Functions for Firebase is a serverless framework that lets you automatically run backend code in response to events triggered by Firebase features and HTTPS requests.

Serverless 架構 ( Function as a Service ) 下只需要將 yml 檔設定好指令，就可以輕鬆部署。

## 開始實作吧！

#### 初始化專案

首先會需要在 firebase 上建立一個專案。 接著透過指令安裝 `firebase-functions` 與 `firebase-tools` 。
接續使用 `firebase login` 與 `firebase init functions` 來初始化專案。

#### 設定 functions

從下方可以看到，這邊透過不同的 folder 建構出獨立的 function。
透過指令可以讓各別獨立的 function 各自部署，在這樣的架構下也可以設計 microservice。

`runWith` 這邊接收的是 RuntimeOptions，參數設定上從下方的例子可以看到：
1. `minInstances` : 這個參數的設定可以用來避免 `cold starts`，維持狀態。
  什麼是 cold starts ？
    以下是 [Google Cloud 官方文件](https://cloud.google.com/functions/docs/configuring/min-instances) 上的說明。
    > Because functions are stateless, your function sometimes initializes the execution environment from scratch, which is called a cold start. Cold starts can take significant amounts of time to complete, so we recommend setting a minimum number of Cloud Functions instances if your application is latency-sensitive.

    當模組因為過一段時間沒有使用進入休眠後，如果再次觸發，啟動模組的過程會需要耗費一些時間。

2. `timeoutSeconds` & `memory` :  這兩個參數的設定用在確保 function 有足夠的容量和時間處理許多檔案。

```javascript
require("https").globalAgent.keepAlive = true;

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

const app = express();
admin.initializeApp();

const functionOne = require("./functionOne/routes")(app);
const functionTwo = require("./functionTwo/routes")(app);

const runtimeOpts = {
  timeoutSeconds: 60,
  memory: "512MB",
  minInstances: 2,
};

exports.functionOne = functions
    .runWith(runtimeOpts)
    .region(process.env.API_REGION)
    .https.onRequest(functionOne);

exports.functionTwo = functions
    .runWith(runtimeOpts)
    .region(process.env.API_REGION)
    .https.onRequest(functionTwo);

```

來看一下在 local run 起來時， terminal 的顯示吧！

![](/img/posts/ruofan/cloudfunction.png)

## 小結

在 firebase 上使用 function 需要使用 Blaze 付費的方案，依據使用量來付費。 還可以設定預算，如果超出預算就發出通知給自己，相當友善的服務！
在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃
範例程式碼可以透過這個 [Github | Repository: functions](https://github.com/ruofanwei/functions) 觀看。

## 參考資料
- [Document | Cloud Functions for Firebase](https://firebase.google.com/docs/functions)
- [Document | Configuring Cloud Functions](https://cloud.google.com/functions/docs/configuring)
- [Blog | New Cloud Functions min instances reduces serverless cold starts](https://cloud.google.com/blog/products/serverless/cloud-functions-supports-min-instances)
