---
title: 用 k6 為 api 做 Load Testing
date: 2021-08-07
tags: [back-end]
author: Ruofan
layout: layouts/post.njk
image: https://k6.io/static/d34aede268b85c2821a801227fc9e696/80926/cloud-stub.webp
---
<!-- summary -->
## 前言
Hi，大家好！前陣子在研究可以為api做Load Testing的工具。
如果你對於這個工具感到好奇，可以看看這篇。

<!-- summary -->
<!-- more -->
## 什麼是k6 ?
以下為k6官方文件上對自己的介紹：
> k6 is a developer-centric, free and open-source load testing tool built for making performance testing a productive and enjoyable experience.

> Using k6, you'll be able to catch performance regression and problems earlier, allowing you to build resilient systems and robust applications.

簡單來說，k6是一個開源的api負載測試工具，下方圖片中區分出不同類型的api測試，出自於k6官方文件。

如果想認識不同類型的api測試之間的差異推薦去看[官方文件](https://k6.io/docs/)，這次會實作的部分是(For performance)Load testing。

![](https://k6.io/docs/static/e45e3f092ab0445aa3da987a69ddad85/d9937/test-types.png)

特別值得注意的是，因為k6是用Go撰寫的，如果需要引用其他node module搭配k6做測試的話，會需要使用Ｗebpack打包工具以及Babel編譯。

## 開始實作吧！

首先會需要安裝k6，這邊會以mac透過Homebrew安裝為例：
```bash
$brew install k6
```
這邊會用`fake.js`套件產生假資料協助測試，因此也會實作打包與編譯設定檔的部分。

```bash
npm install
  @babel/core \
  @babel/preset-env \
  babel-loader \
  core-js \
  webpack \
  webpack-cli
```

這邊先分享一下接下來實作的檔案結構配置。
```bash
├── dist
│   ├── test.index.js
│   └── test.index.js.map
│
├── utils
│   ├── faker.js
│   ├── generateData.js
│   └── testing.js
│  
├── webpack.config.js
├── .babelrc
└── package.json
```
接著設定`webpack config`檔案
讀者如果想要試著實作的話，這邊的設定檔只需要更改 entry file 的路徑。
打包完的檔案會出現在dist的資料夾中，最後在跑script的時候只需要跑dist中產生出來的檔案。

###### **`webpack.config.js`**
```json
const path = require("path")

module.exports = {
  mode: "development",
  entry: {
    "index": "./utils/testing"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "test.[name].js",
    libraryTarget: "commonjs",
  },
  module: {
    rules: [{ test: /\.js$/, use: "babel-loader", exclude: /node_modules/ }],
  },
  stats: {
    colors: true,
    warnings: false,
  },
  target: "node",
  externals: [/k6(\/.*)?/],
  devtool: "source-map",
}
```

還有`.babelrc`檔案

###### **`.babelrc`**
```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": 3
      }
    ]
  ],

}
```
稍微調整一下package.json中的script
這邊在script中使用的pretest，其中的pre 能夠讓每次在跑npm run test這個script的時候都會先重新打包。
關於script的其他用法可以參考[npm doc](https://docs.npmjs.com/cli/v7/using-npm/scripts)。

###### **`package.json`**
```json
{
  "name": "functions",
  "scripts": {
    "pretest": "webpack",
    "test": "k6 run ./dist/test.index.js"
  },

}
```
設定好打包與編譯的工具後就可以安裝`faker.js`了！

```bash
$npm install faker
```
這邊先和大家分享一下，在使用faker.js套件產生假資料時，筆者踩過的雷 💀
就是，這個套件產生的假資料是有蠻高機會重複的！但是當你產生的資料需要是唯一的時候，該怎麼辦呢?!
目前我的解決方式是：

###### **`faker.js`**
```js
import * as faker from "faker/locale/en_US"

faker.seed(Math.floor(100000000000000000 * Math.random()))

export { faker }
```
如果大家有更好的解決方式，歡迎分享讓我知道！
接著，設定產生假資料的檔案

###### **`generateData.js`**
```js
import {faker} from "./faker"
export const generateStores = () => ({
  contactPerson: faker.name.lastName(),
  storeName: faker.company.bsBuzz(),
  storeSlug: faker.random.word(),
  address: faker.address.country(),
  customerServicePhone: faker.phone.phoneNumber(),
  account: faker.internet.email(),
  password: faker.internet.password(),
  companyName: faker.company.bsBuzz(),
  liffid: faker.datatype.uuid(),
})
```
處理完假資料後，就可以開始實作測試檔案！
options可以讓我們設定如何在k6執行測試，以下方範例測試檔為例：

`scenarios` 是測試的情境
這邊使用了 `constant-arrival-rate` 來執行，也就是固定一個數量的虛擬用戶在設定的一段時間內執行測試api。

`preAllocatedVU` 是指在跑測試之前預先配置的虛擬用戶數量，這個設定能夠讓測試執行得更有效率。
其他的設定就會比較好理解了，大意上是指在一分鐘內每隔15秒就會去打一次api。


此外，這邊特邊需要注意的是在k6使用環境變數的方式
以下方的測試檔來說，我使用了 `LOCAL_HOSTNAME` 這個環境變數，在跑script的時候就會需要帶上這個環境變數的值

###### **`package.json`**
```json
{
  "name": "functions",
  "scripts": {
    "pretest": "webpack",
    "test": "k6 run -e LOCAL_HOSTNAME=test/api ./dist/test.index.js"
  },

}
```

###### **`testing.js`**
```js
import http from "k6/http";
import { check, sleep } from "k6";
import { generateStores } from './generateData';

// define url
const baseUrl = `http://${__ENV.LOCAL_HOSTNAME}`;
const urls = {
  createStore: `${baseUrl}/store`,
};

export let options = {
  scenarios: {
    constant_request_rate: {
      executor: "constant-arrival-rate",
      rate: 1,
      timeUnit: "15s", // 1 iterations per 15 second
      duration: "1m",
      preAllocatedVUs: 5, // how large the initial pool of VUs would be
    },
  },
};

const createStoreApi = () => {
  const store = generateStores();
  const payload = JSON.stringify(store);

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
    tags: { k6test: "🔥" },
  };
  const createStoreResult = http.post(urls.createStore, payload, params);

  check(createStoreResult, {
    "status is 200": (res) => res.status === 200,
  });
}

export default function () {
  createStoreApi()
  sleep(1);
}
```

## 執行結果
跑完測試後可以在終端機或是k6 cloud看到的資料，透過分析後的數據可以評估api反應時間是否能夠滿足需求定義時間，找出可以優化的方向。
下方圖片是終端機跑完測試後印出來的資料。

![](/img/posts/ruofan/k6_result_iterms.png)

下方圖片是k6 cloud上把資料視覺化後的圖表。
如果想把測試顯示在k6 cloud上的話，免費的使用額度是有限制的。

![](/img/posts/ruofan/k6_cloud.png)

## 結語

在還沒有流量但又需要測試api的效能或是負載時，k6是一個很不錯的工具！
並且可以根據不同情境做不同測試，想研究其他更多設定的話，可以參考 k6 的文件跟官網：https://k6.io/docs/


在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃

