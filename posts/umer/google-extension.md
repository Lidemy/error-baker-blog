---
title: 初探 Google extension
date: 2021-09-09
tags: [JavaScript, google-extension]
author: Umer
layout: layouts/post.njk
---

<!-- summary -->
<!-- 初探 Google extension，寫出簡單的小作品 -->
<!-- summary -->
<!-- more -->


## 介紹 extension
使用常見的網頁技術（HTML, JavaScript, CSS）所寫出的程式，運行在 Chrome 瀏覽器的沙盒執行環境中，透過 UI 介面以及 Extensions APIs 來客製化 Chrome 瀏覽器的使用體驗。

## extesion 的基本組成會具有以下的檔案
* manifest.json
* popup.js
* background.js
* content-script.js

## 實作一個簡單的 extension
最終的結果會有以下簡單功能，
extension 會有一個 popup（彈出視窗），裡面可以輸入一段訊息，按下 submit 之後，訊息會傳送到圖片右邊的 extension 後台，再把這段訊息 prepend 到當前使用中的分頁。
![](https://i.imgur.com/jOR2TZD.png)

### manifest.json
每個 extension 都需要有的文件，用來配置 extension 所使用到的檔案的依賴性（dependency）以及基本資訊。

* background: extension 的後台腳本，在 manifest V3 使用到瀏覽器的 service worker 來運作後台腳本。
> a "service worker is a script that your browser runs in the background, separate from a web page, opening the door to features that don't need a web page or user interaction."
* permissions: 在執行 extension 的時候（run time）申請 extension APIs 的權限，這次實作是要在點擊 extension 當下的分頁做操作，所以申請 "active tab" 權限。
* action: 設定 extension UI 相關資料。
* content_scripts: 網頁、content script 分別是獨立運行的，透過設定 [match patterns](https://developer.chrome.com/docs/extensions/mv3/match_patterns/)就可以把 content script 放到網頁的 DOM 裡面執行，並且可以取得頁面資訊、對頁面的 DOM 做操作、回傳頁面資訊給 extension 等。
```c
{
  "name": "Getting Started Example",
  "description": "Build an Extension!",
  "version": "1.0",
  "manifest_version": 3,
  "background": {
    "service_worker": "background.js"
  },
  "permissions": [
    "activeTab"
  ],

  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "/images/get_started16.png",
      "32": "/images/get_started32.png",
      "48": "/images/get_started48.png",
      "128": "/images/get_started128.png"
    }
  },
  "icons": {
    "16": "/images/get_started16.png",
    "32": "/images/get_started32.png",
    "48": "/images/get_started48.png",
    "128": "/images/get_started128.png"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"]
    }
  ]
}
```
### popup

popup、background、分頁彼此之間都是 single thread，為了要讓彼此可以傳遞訊息，需要使用`chrome.runtime` API 的 connect 方法。
這次實作會在 popup.js 建立一個監聽器，監聽是否有 response 傳過來並用 callback 印出， 以及監聽 button 的 click 事件，點擊 button 之後傳送訊息 `這是 popup 發送的訊息: ${inputElement.value}` 給 port。
(popup.js)
```js
const inputElement = document.querySelector("input");
const buttonElement = document.querySelector("button");
const port = chrome.runtime.connect({ name: "connection" });

port.onMessage.addListener(function (response) {
  console.log(response);
});

buttonElement.addEventListener('click', function (event) {
  port.postMessage({ msg: `這是 popup 發送的訊息: ${inputElement.value}` });
});

```

popup 的介面跟一般網頁一樣透過 HTML、CSS 來做出。
(popup.html)
```html
<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="popup.css">
    <meta charset="UTF-8">
  </head>
  <body>
    <input placeholder="filter this word" />
    <button class="submit-btn">Submit</button>
    <script src="popup.js"></script>
  </body>
</html>
```
### background.js
* extension 的後台腳本，生命週期是 extension 裡面最長的，在瀏覽器打開時運作，瀏覽器關閉時停止。
* background.js 透過載入 HTML 時註冊一個 service worker 來運行。
* service worker 運行在 single thread （單執行緒、單線程），常用來監聽事件，可以在 DevTools 查看 service worker。

前面有提到 service worker 本身是 single thread，沒辦法直接影響網頁的 DOM，因此需要使用`chrome.runtime` API 來做訊息的傳遞（Message passing）。
這次實作會在 background.js 建立一個監聽器，在 popup.js 和 background.js 建立連結之後，再繼續監聽是否有 response 傳過來，接收到 response 之後執行 callback，發送訊息 '這是 background 發送的訊息' 給 popup，以及發送訊息（response）給當前使用的分頁。
```js
chrome.runtime.onConnect.addListener(function (port) {
  if (port.name) {
    port.onMessage.addListener(function (response) {
      console.log(response);
      port.postMessage({ msg: '這是 background 發送的訊息' })

      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        console.log(tabs)
        chrome.tabs.sendMessage(tabs[0].id, { data: response })
      })
    })
  }
})
```

### content-script.js

會注入到頁面 DOM 執行的腳本
```js
const bodyElement = document.querySelector('body')

chrome.runtime.onMessage.addListener(handleMessage);
function handleMessage(request) {
  console.log(request.data.msg)
  bodyElement.prepend(request.data.msg)
}
```

### 結果以及有趣的發現
最後會做出文章前面提到的功能，如圖片。
![](https://i.imgur.com/B3UgQ1x.png)

需要注意的是 extension 使用到的 popup、background、content-script 彼此之前如果要進行訊息的傳遞，需要先建立 connect（或是透過 one-time requests 達成），以及 content-script 需要先在 manifest 設定 match patterns 來把腳本放到頁面的 DOM 中執行。

這次實作寫出一個簡單的 google extension 之後才發現背後的原理一點也不簡單，特別是發現到原來瀏覽器有 service worker 的存在，也算是稍微回答了一些我在實作這次 extension 的時候遇到的以下狀況（圖片顯示 extension 後台）：
![](https://i.imgur.com/r3D1fGw.png)

在接收到訊息之後，background.js 印出的訊息會是亂碼，popup.js 印出的訊息卻是正常的編碼結果（前提：確定 background 跟 popup 這兩個檔案程式碼都跟上面一樣）。

明明都是在瀏覽器裡面跑為什麼結果會不一樣？之後才發現到原來在載入 popup 的 HTML 之後會註冊一個 service worker，兩者都是 single thread，但是我沒有在 popup 的 HTML 加入`<meta charset="UTF-8">`這串文字所導致亂碼結果。
