---
title: 如何使用 react-intl + babel plugin 自動化產出多國語系檔？
date: 2022-01-31
tags: [react, intl, internationalization, i18n, automation, babel, js, formatjs, ast]
author: tian
layout: layouts/post.njk
---

### 誰可能適合閱讀這篇文章？

- 有使用 React 實作多國語系的需求
- 想瞭解 Babel 除了將 ES6+ 轉成 ES5 還能幫助我們做些什麼？
- 如何結合 react-intl 和 babel 自動化產出語系檔

如果你沒有上述需求，你可以考慮去閱讀其他夥伴們的 [優秀作品](https://blog.errorbaker.tw/)

### react-intl 簡介

從[官方文件](https://formatjs.io/)可以得知， react-intl 是一套可以協助我們做多國語系的 Library

### react-intl 基本操作
在 React 專案中執行指令 `yarn react-intl` or `npm install react-intl` 可以按照下面的程式碼做最基本的配置

1. 在元件的最外層包一個 react-intl 內建的 Context：IntlProvider，這樣被包裹的元件才能透過 useIntl 這個 custom hook 取得 formatMessage

2. formatMessage 內放的是一個 object 包含 id 和 defaultMessage，當 IntlProvider messages 中的 key 和 formateMessage 中 object 的 id 對應時，就會使用對應的詞作為翻譯。

```jsx
import { IntlProvider, useIntl } from "react-intl"

function App() {
  return (
    <IntlProvider messages={{ test: "測試" }}>
      {/* props: messages 的 test 對應到 formatMessage({ id: "test" }) */}
      <TranslationBlock />
    </IntlProvider>
  )
}
function TranslationBlock() {
  const { formatMessage } = useIntl()
  return (
    <div>
      <span>
        {formatMessage({ id: "test", defaultMessage: "預設訊息" })}
        {/* 顯示為 測試 */}
      </span>
    </div>
  )
}
```

```jsx
import { IntlProvider, useIntl } from "react-intl";

function App() {
  return (
    <IntlProvider messages={}>
      {/* messages 沒有翻譯 */}
      <TranslationBlock />
    </IntlProvider>
  )
}
function TranslationBlock() {
  const { formatMessage } = useIntl()
  return (
    <div>
      <span>
        {formatMessage({ id: "test", defaultMessage: "預設訊息" })}
        {/* messages 沒有翻譯 顯示 defaultMessage 為 預設訊息 */}
      </span>
    </div>
  )
}
```


隨著翻譯字詞數量的增加我們會額外獨立出一個翻譯檔，再引入到 IntlProvider 中，方便集中管理

`locale/zh.json`

```json
{
  "test1": "測試1",
  "test2": "測試2",
  "test3": "測試3",
  "test4": "測試4"
}
```

`App.jsx`

```jsx
import { IntlProvider, useIntl } from "react-intl";
import zh from "../locale/zh";
import jp from "../locale/jp";
import en from "../locale/en";

function App() {
  return (
    <IntlProvider messages={zh}>
      <TranslationBlock />
    </IntlProvider>
  )
}

function TranslationBlock() {
  const { formatMessage } = useIntl()
  return (
    <div>
      <span>{formatMessage({ id: "test1", defaultMessage: "預設訊息1" })}</span>{/* 測試1 */}
      <span>{formatMessage({ id: "test2", defaultMessage: "預設訊息2" })}</span>{/* 測試2 */}
      <span>{formatMessage({ id: "test3", defaultMessage: "預設訊息3" })}</span>{/* 測試3 */}
      <span>{formatMessage({ id: "test4", defaultMessage: "預設訊息4" })}</span>{/* 測試4 */}
    </div>
  )
}
```

但很快的，隨著翻譯的語系（zh, en, jp...）和字詞的增加，就會開始遇到問題了，每一次新增翻譯和語系的時候，都必須 **手動** 的將語系的 `translation key` 複製出來貼到語系檔裡面才能進行翻譯，這樣不僅麻煩也很容易漏，
所以我希望能採用某種自動化的機制，讓我只需要在 formatMessage 中定義好 id 和 defaultMessage，就來自動的產出語系檔，每個不同語系檔都包含對應 id 的 translation key，這樣我就只需要將注意力放在定 id 和翻譯。

在查了很多資料之後發現，使用 react-intl 中的 defineMessage + babel plugin 可以幫我們做到這件事情。

再加上 defineMessage 之後，翻譯不會並不會發生什麼變化，但使用 defineMessage 可以讓我們講使用螢光筆一樣，將待會需要 extract 的翻譯字詞標記起來。

```jsx
import { defineMessage, useIntl } from "react-intl";

function TranslationBlock() {
  const { formatMessage } = useIntl();
  return (
    <div>
      <span>
        {formatMessage({ id: "test1", defaultMessage: "預設訊息 1" })}
      </span>{" "}
      {/* 預設訊息 1 */}
      <span>
        {/* defineMessage 回傳的值等同於 { id: "test2", defaultMessage: "預設訊息 2" } */}
        /{formatMessage(
          defineMessage({ id: "test2", defaultMessage: "預設訊息 2" })
        )} {/* 預設訊息 2 */}
      </span>
    </div>
  );
}

export default App;
```

隨著翻譯字詞的增多，不想寫那麼多次 defineMessage ，我們還可以用有加 s 的 defineMessage*s* 進行標注

```jsx
const messages = defineMessages({
  test3: { id: "test3", defaultMessage: "預設訊息 3" },
  test4: { id: "test4", defaultMessage: "預設訊息 4" },
})

// defineMessages 回傳的 messages 等同於
// const messages = {
//   test3: { id: "test3", defaultMessage: "預設訊息 3" },
//   test4: { id: "test4", defaultMessage: "預設訊息 4" },
// }

function TranslationBlock() {
  const { formatMessage } = useIntl()
  return (
    <div>
      <span>
        {formatMessage({ id: "test1", defaultMessage: "預設訊息 1" })} {/* 預設訊息 1 */}
      </span>
      <span>
        {formatMessage(
          defineMessage({ id: "test2", defaultMessage: "預設訊息 2" }) {/* 預設訊息 2 */}
        )}
      </span>
      <span>{formatMessage(messages.test4)}</span> {/* 預設訊息 3 */}
      <span>{formatMessage(messages.test4)}</span> {/* 預設訊息 4 */}
    </div>
  )
}
```

### Babel 簡介

Babel 是一個 JavaScript 的轉譯器，通常拿來將瀏覽器的尚未支援的 ES6+ 語法轉成 ES5，這樣就可以讓開發者用最新的語法來寫 Code。

Babel 背後的原理是抽象語法樹 Abstract Syntax Tree，簡稱 AST，對 AST 有興趣的話，推薦看[這篇](https://chihyang41.github.io/2021/06/28/AST-and-ESLint-Introduction-part-1/)

### Babel 設置

可以參考[官方文件](https://babeljs.io/setup#installation)安裝，還需要加上 Plugin [babel-plugin-react-intl](https://github.com/formatjs/babel-plugin-react-intl)

`babel.config.json`

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"],
  "plugins": [
    [
      // 這個 Plugin 會將定義好的 id 和 defaultMessage extract 出來
      "react-intl",
      {
        "messagesDir": "./src/translations/extract" // extract 出來的檔案要放到那個資料夾下面
      }
    ]
  ]
}
```

在專案中執行 `babel ./src` 就會再目標資料夾看到 extract 出來的 json 檔，資料格式會像是這樣

```json
[
  { "id": "test1", "defaultMessage": "預設訊息 1" }
  { "id": "test2", "defaultMessage": "預設訊息 2" }
  { "id": "test3", "defaultMessage": "預設訊息 3" },
  { "id": "test4", "defaultMessage": "預設訊息 4" },
]
```

但這不是我們要的格式，我希望的語系檔格式會像是這樣

```json
{
  "test1": "預設訊息 1",
  "test2": "預設訊息 2",
  "test3": "預設訊息 3", 
  "test4": "預設訊息 4",
}
```

聰明如你，一定想到了可以自己寫一個腳本做轉換，但正所謂不要重複造輪子，社群上的大大們已經把工具都做好，在這裡我們可以直接使用就好了，

我們要使用的是這個 [react-intl-translations-manager](https://github.com/GertjanReynaert/react-intl-translations-manager)

使用這個工具甚至可以直接幫我們把 Extract 的文字轉換成各種不同的語系檔

`manageTranslation.js`

```js
const manageTranslations = require("react-intl-translations-manager").default

manageTranslations({
  messagesDirectory: "src/translations/extract", // 剛剛 extract 出來的檔案
  translationsDirectory: "src/translations/locales/", // 輸出語系檔的資料夾
  languages: ["en", "zh", "jp", 'alien'], // any language you need
  whitelistsDirectory: "src/translations/locales/whitelists",
})
```

在所有的設置都安排好之後我們要做的事就是
1. 利用 react-intl 的 defineMessage 將需要 extract 的字詞定義好
2. 使用 babel-plugin-react-intl 將 id 和 defaultMessage extract 出來
3. 使用 react-intl-translations-manager 將 extract 出來的翻譯轉換成語系檔
4. 最後將 extract 出來，已經轉換成語系檔的檔案案刪除

寫在 package.json 的 script 會像這樣

```json
{
  "scripts": {
    "trans": "yarn trans:extract && yarn trans:manage && yarn trans:clean",
    "trans:extract": "babel ./src",
    "trans:manage": "node manageTranslation.js",
    "trans:clean": "rm -rf ./src/translations/extract"
  },
}
```

執行 `yarn trans` 之後你就會看到你需要的語法出 locale 資料夾下面，你就可以在 IntlProvider 的 messages 切換不同的語系檔來轉換語系

可參考 [repo](https://github.com/futianshen/react-js-intl) 


### 參考資料

[Internationalization & Localization Using React-Intl & TypeScript](https://medium.com/@yehiasaleh/internationalization-localization-using-react-intl-typescript-1e7cfccd34d7)
[formatjs](https://formatjs.io/docs/getting-started/installation/)
[babel](https://babeljs.io/setup)
[babel-plugin-react-intl](https://github.com/formatjs/babel-plugin-react-intl)
[react-intl-translation-manager](https://github.com/GertjanReynaert/react-intl-translations-manager)
[前端癢癢 der - 淺談 AST 及 ESlint Rule：AST 是殺毀？（上）](https://chihyang41.github.io/2021/06/28/AST-and-ESLint-Introduction-part-1/)
