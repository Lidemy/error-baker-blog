---
title: 優化舊有專案（一）：加入 dotenv, nodemon, babel 優化開發
date: 2021-08-22
tags: [back-end, JavaScript, dotenv, babel, nodemon]
author: cwc329
layout: layouts/post.njk
---

<!-- summary -->

新手上路的工程師，在使用公司專案的時候發覺專案中使用很多開發上很好用的套件，這是我原本在學習路上沒有見過或者有看過但沒用過的東西，於是乎我就開始研究這些東西要怎麼使用，而我覺得最好的方法，就是在我自己原本的 side project 中導入這些，讓我看看到底要怎麼使用。

<!-- summary -->

# 使用的專案 - Podcastify

我使用的是我在 Lidemy 的期末專案，這是我與 [Kuan Yu](https://github.com/Yu040419) 以及 [
Sophie Chang](https://github.com/sophiebetough) 一同合作開發。

[舊版專案原始碼](https://github.com/cwc329/mtr04-final-project-Podcastify)

新版專案原始碼：[前端](https://github.com/cwc329/mtr04-final-project-Podcastify-ui)、[後端](https://github.com/cwc329/mtr04-final-project-Podcastify-api)

這邊文章會以後端 api 專案的重構為主。

## dotenv

我開始工作之後才之後 dotenv 有多好用。
簡單來說，dotenv 是一個可以幫開發者把 `.env` 檔案中的環境變數丟到 `process.env`中，這樣就可以在一個檔案中管理所有的環境變數。這樣我就可以把資料庫連線、第三方 API token、session secret 等東西都放在 `.env` 中，在部署的指令前就不需要宣告這些環境變數。

這個大概是導入最簡單的東西了，照著[官方文件](https://github.com/motdotla/dotenv)走，只要先

```shell
npm install dotenv
```

接著在專案的根目錄建立 `.env`，並且記得把 `.env` 加入 `.gitignore`，接下來在想要使用環境變數的檔案中使用 `dotenv` 即可。

在我這個專案中，影響最大的是 Sequelize 的 config 檔案，這是記錄資料庫連線帳號密碼的檔案，以往都是直接寫死，但是現在可以用 `.env` 控制之外，我甚至可以先去檢查這些變數是不是沒有給，並且拋出錯誤，讓我比較好 debug。

**config.js**

```js
require("dotenv").config();
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } = process.env;

if (!DB_NAME || !DB_USER || !DB_PASSWORD || !DB_HOST || !DB_DIALECT) {
  throw new Error("missing DB env");
}

const config = {
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  host: DB_HOST,
  dialect: DB_DIALECT,
};

module.exports = config;
```

而且 docker 在執行 image 的時候，也可以注入 env file，將環境變數改用 env file 管理，也可以讓我之後部署，甚至是使用 ci/cd 的時候更加順利。

## nodemon

根據[官方文件](https://github.com/remy/nodemon#nodemon)的描述

> nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

nodemon 是個開發上很好用的工具，我之前在開發 api 的時候，如果有 code 改變，我就要關掉目前的 app 並且重新啟動，這樣做有個缺點，就是當我忘記重啟的時候，就會因為執行的 code 與 IDE 的 code 不同，導致我會去解一些不存在的 bug。

而 nodemon 就是一款可以自動監聽工作資料夾，當這個資料夾的檔案有變動的時候，nodemon 就會自動幫重啟 app，這樣就可以保證執行的 code 是跟當前一樣的版本。

至於怎麼使用，也很簡單。依照官方文件有兩種方法可以安裝，global 以及 local，我個人比較喜歡 local 的安裝。

```shell
npm install nodemon --save-dev
```

之後只要跑

```
npx nodemon <path/to/app>
```

就可以了。

不過懶人如我就在 `package.json` 中定義了 npm script 去執行 nodemon
**package.json**

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon ./src/app.js"
  }
}
```

這樣我只要下

```
npm run dev
```

就可以執行 nodemon 幫我監控資料夾並且自動重啟 app，快速又方便。

## babel-node

使用 babel 其實是因為我比較想用 ES6 的語法，尤其是 `import` 與 `export` 開發，不過這樣在直接執行的時候會噴錯

```
SyntaxError: Cannot use import statement outside a module
```

而使用 babel 先將語法作轉換，是一種避免這種錯誤的方法，同時也能讓開發更順利。

不過在導入 babel 就比較複雜一些，因為同時我也想要使用一些 import alias 讓我開發上能稍微省一些力氣，所以除了基本的 babel 之外，我還安裝了 import-resolver 這個插件。這個可以讓我在 `.babelrc` 裡面先設定好我想要的 import alias 並且可以在開發的時候使用，當 babel 要編譯的時候，就會依照預先設定好的 import alias 幫我轉換。

一樣點進[官方文件](https://babeljs.io/docs/en/usage)依照步驟安裝

```
npm install --save-dev @babel/core @babel/cli @babel/preset-env
```

並且創建 `.babelrc` 然後把下面的檔案內容複製過去，不過這邊有點不同，因為後端是使用 node.js 運行，所以不需要設定瀏覽器支援度，不過依然需要 preset-env 才能將新版的語法轉換，所以我的 `.babelrc` 長這樣

```json
{
  "presets": ["@babel/preset-env"]
}
```

不過這還沒完，剛開始說我想要使用 import alias，所以我又安裝了 [import-resolver](https://www.npmjs.com/package/babel-plugin-module-resolver)

```
npm install --save-dev babel-plugin-module-resolver
```

依照官方文件的教學，我又在我的 `.babelrc` 中加入設定，最後長這樣

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": [
    [
      "module-resolver",
      {
        "root": ["./"],
        "alias": {
          "Middleware": "./src/middleware",
          "Model": "./src/models",
          "Util": "./src/utils",
          "Constant": "./src/constants",
          "Controller": "./src/controllers"
        }
      }
    ]
  ]
}
```

我將 model, controller 等比較上層的 folder 都設定了 import alias，這樣之後我就不用去寫一堆相對路徑，我只要使用 alias 就可以輕鬆地引入我想要使用的東西。

最後的最後，還有一個重要的地方，原本的 nodemon 是直接使用 node 去執行的，所以使用 babel + ES6 開發會讓 nodemon 噴錯。這個時候就是 [@babel/node](https://babeljs.io/docs/en/babel-node) 派上用場的時候了。這個是 babel 的一個 CLI，比 node.js 多了一項功能，就是可以先將程式碼做轉換。

一樣先安裝

```
npm install --save-dev @babel/node
```

然後我再將 npm run dev 的指令稍做修改，讓它使用 @babel/node 執行

```json
{
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "nodemon --exec babel-node ./src/app.js"
  }
}
```

這樣我的 nodemon 就可以順利執行了！

# 小結

到這邊，我使用一些簡單的工具，沒有很複雜的設定就大大的降低我開發的麻煩。這樣我就可以用比較習慣的語法，以及用比較簡潔的路徑來開發 api。不過這只是我把新的工具應用到就專案的第一步。

如果有第二集，我會來寫我是如何用 docker 封裝我的 app，以及如何使用 docker hub 提供的功能在我 push code 的時候自動幫我 build image。還有最後我是怎麼用 circleci 達成自動 build image 並且 publish。
