---
title: async/await 到底在等什麼？
date: 2021-11-22
tags: [JavaScript, async, await]
author: cwc329
layout: layouts/post.njk
---

# 前言

最近在工作上解了幾個 issue，都是跟 async/await 有關係的，用這個機會紀錄一下這段時間學到的一些東西。

## 總之加爆

身為一個後端工程師，我寫的 code 有一半以上都是要跟其他服務做互動，比如說對資料庫下 query 以及打其他 micro service 的 API。

這些非同步的行為，身為一個 junior 理所當然 async/await 加爆，不管 function 裡面有沒有非同步行爲我都先加上 async，不管 function 是不是 async function 我都加上 await。現在回頭看，那個時候真的都在寫一些在地上爬的義大利麵。

要脫離這種加爆的寫法，首先就要先粗淺了解一下 async/await 到底代表什麼意思。

我當初只知道，async/await 可以解決 callback hell，讓很多相互依賴的非同步程式可以用人類更好閱讀的方式呈現，而不是縮排縮排再縮排。

這種寫法可以讓人清楚明瞭，並且用類似同步執行的寫法去寫出非同步的步驟。

但是我不知道的是，這其實是 Promise。

用最簡單最不精確的話來說，async function 就是一個會回傳 Promise 的 function，而 await 則表示我要等這個 Promise 結束之後我才會執行下面的動作。理解這個的話，就可以來看我第一個犯的錯，這也是 eslint 的其中一個 rule: no-return-await。

先看一下以下的程式碼

```js
const queryPromise = async (sql, params) => {
  return new Promise((resolve, reject) => {
    // use Promise to wrap db query function
  });
};

const selectPosts = async () => {
  return await queryPromise(sql, params);
};
```

上面的這段 code，在 `selectPosts` 中 return 後面是不需要 await 的。
我當初的疑問是，我回傳的是執行 query 之後的結果，這個結果不是要用 await 拿到之後再回傳嗎？這樣我加上 await 是哪裡有錯呢？

但是在仔細想想，async function 回傳的是什麼？是一個 Promise。

而 queryPromise 原本就是回傳一個 Promise，就算我用 await 先等待 resolve or reject，然後再回傳，因為 async function 的特性，最後還是會變成一個 Promise。

那麼我何苦這麼麻煩？直接把原本的 Promise 回傳就可以了啊！

所以上面的程式碼，修改之後會變成這樣

```js
const selectPosts = async () => {
  return queryPromise(sql, params);
};
```

既然我在這邊不需要等待 Promise 的動作，那麼就可以省略 await 的關鍵字，讓 `selectPosts` 被呼叫的時候再 resolve or reject 即可。

## async/await 不等人

在解決 async/await 加爆的問題之後，我認為自己對於 async/await 的理解已經前進一大步了，畢竟我之前只會無腦亂加。

這個時候遇到第二個問題，有一段舊的程式使用 request 套件執行 API request 更新 cache，並且在 request 結束之後要用 mqtt 發布訊息數則訊息。

```js
const updatePostCache = () => {
  request(option, (err, res, body) => {
    //cb here
  });
};

const publishMqtt = async () => {
  mqttClient(option);
};
const updatePost = async () => {
  await queryPromise(sql, param);
  updatePostCache();
  await publishMqtt();
};
```

但是因為 request 套件的回應是要在 callback 裡面處理，導致在 API request 尚未被執行完成，後面的 mqtt 就已經在動作了，這會造成資料更新與發出 mqtt 會有 race condition，這是不應該有的狀況。

這邊的解法，我很直覺想，那我就把 `updatePostCache` 變成 async function 就好了，於是乎第一版的解法長這樣

```js
const updatePostCache = async () => {
  request(option, (err, res, body) => {
    //cb here
  });
};

const publishMqtt = async () => {
  mqttClient(option);
};
const updatePost = async () => {
  await queryPromise(sql, param);
  await updatePostCache();
  await publishMqtt();
};
```

本來以為打完收工，沒想到實際測試下去，race condition 還是存在，搞得我都想再回去打波動拳了。後來去看了 MDN 之後我才恍然大悟，原來要理解 async/await 還是要從 Promise 下手才行。

這邊就簡單的說一下 Promise，它是 JavaScript 原生提供的非同步運算物件，其建構子可以傳入兩個 callback function，分別是成功與失敗的處理，一般來說前者會被叫做 resolve，後者是 reject。

根據官方文件，原本使用 callback 的 API 或者 function 也可以用 Promise 包起來，並且在 callback 裡面使用 resolve 與 reject，這樣就可以用 Promise chaining 或者 async/await 融入比較新的寫法。

所以我依照 MDN 的方法重新把 `updatePostCache` 包起來後變成這樣

```js
const updatePostCache = () => {
  return new Promise((resolve, reject) => {
    request(option, (err, res, body) => {
      if (err) return reject(err);
      return resolve(body);
    });
  });
};

const publishMqtt = async () => {
  mqttClient(option);
};
const updatePost = async () => {
  await queryPromise(sql, param);
  await updatePostCache();
  await publishMqtt();
};
```

改好之後我就看到我的 mqtt 會在 API request 收到 response 之後才執行，總算避免掉 race condition。不過 cache 更新沒有優化導致 call API 其間畫面一直轉圈圈就是另一個故事了。

## Promise.all vs for loop await

最後一個我想要說的小坑是關於 Promise.all。

Promise.all 在我們公司通常被用在兩個地方，一個是一次呼叫很多不同的 async function，另一種是搭配 `Array.prototype.map()` 使用，對一個 array of objects 做同樣的處理，例如再把資料一筆一筆塞入資料庫中。

這次的問題就出在後者，因為希望不要有重複的資料出現，所以在塞入之前會先檢查一下是不是已經有同樣的資料存在。

```js
const addPosts = async (posts) => {
  const categoryHashTable = await getCategoryHashTable();
  const addPost = async (post) => {
    const { category } = post;
    if (!categoryHashTable[category]) await insertNewCategory();
    const result = await insertPost(post);
    return result.insertId;
  };
  return Promise.all(Posts.map(addPost));
};
```

這邊我想先檢查分類是否已經存在，如果不存在就新增分類。但是這段程式碼有個問題，如果我新增五篇文章都用同一個新的分類，我本來預期只會新增一個分類，沒想到最後新增五個一樣的分類。

後來問了大神同事才知道，原來這是滿基本的 Promise 觀念。Promise.all 並不會保證從 array 的第一個依序開始執行，反而所有的元素一起執行，彼此是有 race condition 的。

所以如果要如我想像的執行，有兩種比較可行的方法。第一是在 runtime 預處理資料，是先整理好我要 insert 什麼，然後統一執行。而如果要沿用我剛剛的程式邏輯，那可以用 for...of loop 處理，在每個 loop 中依序執行 async function，這樣就可以保證我的文章是依照在 array 的順序被處理。

```js
const addPosts = async (posts) => {
  const categoryHashTable = await getCategoryHashTable();
  const addPost = async (post) => {
    const { category } = post;
    if (!categoryHashTable[category]) await insertNewCategory();
    const result = await insertPost(post);
    return result.insertId;
  };
  for (const post of posts) {
    await addPost(post);
  }
};
```

# 結語

以上是我最近踩到的一些小坑，跟大家分享一下，也希望透過寫文章讓自己可以記得更清楚。
