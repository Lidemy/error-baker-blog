---
title: 實作專案套件化
date: 2022-04-03
tags: [Front-end, article]
author: Xiang
layout: layouts/post.njk
image:
---

<!-- summary -->

看到這個標題，不曉得讀者心中是否會產生一些疑問？專案套件化是什麼意思？為什麼會有這個想法？做這個會有什麼用處？
本篇文章將會分享為何我會想製作這個主題，以及我在實作時是如何去構思及修正的。

<!-- summary -->
<!-- more -->

## 前言

作為工程師，我們很習慣會去把有重複使用到的東西獨立出來管理。不論是函式、元件、樣式，甚至是頁面，當我們把重複用到的東西獨立出來以後，就能夠避免在維護的時候，明明是相同的東西，卻要去改好幾個地方。

獨立出來以後，又能夠依據使用情境，來細分管理方式，比如說一個 sidebar 元件，只有在這個專案會用到，那我其實在這個專案底下開一個資料夾來存放就可以了。但如果是類似 button 的元件，我希望未來新的專案都能夠使用，那我們就可以把這個元件獨立成一個套件。只要在各個專案中引入就可以直接使用。

類似的機制其實在座各位都並不陌生，像 [Font Awesome](https://fontawesome.com/)、[Chakra](https://chakra-ui.com/) 就是在提供類似的服務，幫我們把很常重複使用的元件給封裝起來，我們只需要在專案中引入即可直接使用。

除了引用別人做好的套件以外，我們還可以製作自己的套件，好處就是我們可以完全自由的決定我們的元件要有什麼功能，要長什麼樣子。還有最重要的是，別人的東西我們不敢保證哪一天會不會停止維護，我們自己做的東西我們能夠自己來維護。

將元件變成套件，其實網路上已經有非常多很棒的資源了，本篇文章會分享的，是如何能將整份專案變成套件，並且可以自由的決定，要開放哪些功能讓使用者能夠客製化，來達成整份專案的重複使用。

> 本篇文章的範例會以 Vue2 為主，但任何前端框架都能透過相同的概念，實作專案套件化。

## 目標

在這邊先提一下整份專案套件化的目的是什麼，首要目標當然就是讓我們可以在各個不同的專案當中引入使用。但是既然各個專案都能夠使用，代表這個套件底下的功能並不齊全，它必須要涵蓋大部分專案都會使用到的架構，但不必去擁有專案底下需要具備的所有細節。

也就是說這份套件化的專案，它其實是專案的 `核心`，而這個 `核心` 會在真正使用於專案時，再把其他附帶的功能給組裝上去。
舉例來說，假設我每一個專案，它都會有登入頁面，那我就可以把登入功能納入核心的功能當中，如果我今天要建立一個購物網站，我可以去引用我的核心，並將購物車功能組裝上去，這樣我就只需要做出購物車系統就能夠產生新的購物網站，省去了製作登入功能的時間。

或者我將管理系統變成一個 `核心`，未來我想實作員工管理系統，或者商品管理系統、活動管理系統、ＸＸ管理系統，我都能直接使用這個 `核心`，再加上一些客製化的頁面上去，快速產生出新的專案。因為管理系統的架構是不變的，差別只在最後使用的資料內容是什麼，所以只要能夠將 `核心` 給完善，在使用時基本上只要套入設定就能夠完成了，大幅減少新專案的開發時間。

> 大家可以把這個所謂的 `核心`，想像成功能更完善的 `create-react-app` 或者 `vue-cli`。

那這個所謂的 `核心`，需要具備什麼樣的功能及條件呢？

1. 隨裝隨用
2. 方便更版
3. 支援客製化

`隨裝隨用`、`方便更版`，這兩點大家一定都能理解，而 `支援客製化` 其實是最難的，也是最重要的部分。因為每個專案會有每個專案自己的細節，我們需要開放使用者自行客製化（不論是功能或頁面），如果這個核心未來都只有自己會使用，當然直接開放所有功能的客製化即可。但是如果我們會把核心開放給外界使用，就得去定義哪些地方要開放客製化哪些地方不要。

但為了讓文章的主題不要太過發散，我把開放客製化的目標定為下面幾項就好：

- router - 使用者可以自行加入新的 route
- component - 使用者可以自行加入新的 component

## 規劃

確認目標以後，就要來規劃實作的步驟了：

1. 嘗試把一個簡單的元件部署上 npm
2. 思考客製化的邏輯及方法
3. 嘗試將專案套件化
4. 延伸思考

先從簡單的任務開始，理解基本的部署流程(先部署元件就好)，再從使用情境去探討該如何規劃套件架構，前面的規劃都確定好最後才是實作出我們的套件。

<!-- - 先談談單純將 component 套件化，變成可複用的元件
- 思考專案套件化後的使用邏輯（舊的 slot 概念 -> 新的 register 概念）
- 接著變成將專案套件化
- 需要解決的問題
  - 套件部署的位置（公開？非公開？）
  - babel 轉譯的時機 -->

## 實作

**[☞ 將元件套件化]()**
由於專案套件化比較複雜，我們先嘗試將 `元件` 做成套件就好，等初步了解部署 npm 的流程以後，再來思考如何將專案製做成套件。
假設我現在有一個 hello world 元件，我想要把它變成套件打包到 npm。

```js
// src/components/HelloWorld.vue

<template>
  <div>Hello World</div>
</template>
<script>
export default {
  name: "hello world",
};
</script>
```

我要做的就是使用 vue 官方提供的方法，定義 `install` 函式。先建立一個 js 檔，把我的 hello world 元件引入：

```js
// src/components/install.js

import HelloWorld from "./HelloWorld.vue";

// 定義 install 函式
HelloWorld.install = function (Vue) {
  Vue.component("hello-world", HelloWorld);
};

// export 出去
export default HelloWorld;
```

這個 `install` 的 function 就是讓使用者可以透過 `Vue.use()` 來呼叫並且引用我們打包好的元件。

```js
// 使用時
import HelloWorld from "<hello-world> 套件";

Vue.use(HelloWorld);
```

基本的 install 函式定義好以後，我們就可以來把元件打包了，打包的方式也很容易，使用 Vue 官方提供的 Library 建置指令就好了!

- `vue-cli-service build --target lib —-name <打包後的檔名> <install.js 檔的路徑>`

```json
// package.json

scripts: {
  "build": "vue-cli-service build --target lib —-name hello-world ./src/components/install.js"
}

```

同時我們必須要在 package.json 定義幾項資訊：

- name：套件名稱
- version：套件版號
- main：主要入口點

```json
// package.json

{
  "name": "hello-world",
  "version": "1.0.0",
  "main": "dist/hello-world.common.js",
  "scripts": {
    "build": "vue-cli-service build --target lib —-name hello-world ./src/components/install.js"
  }
}
```

上述兩件事情完成以後，就可以來準備發佈了。發佈之前因為需要有 npm 的帳號，所以需要先[註冊](https://www.npmjs.com/)一個，驗證 Email 並且在本地端登入：

```js
npm adduser // 新增使用者
npm login // 登入
```

登入完成後，`發射鈕` 給它按下去！

```js
npm publish
```

這樣就可以完整的將元件打包上 npm 了！使用時就像使用一般套件一樣引入就行啦。

```html
<template>
  <hello-world></hello-world>
</template>
<script>
  import helloWorld from "<套件>";
  Vue.use(helloWorld);
</script>
```

因為只是單純的 Hello world 元件，所以引入時看到的內容就是這一行字：

![](https://blog.errorbaker.tw/img/posts/xiang/package-vue-project-01.png)

> 上面這段講得很快，主要只是帶大家稍微認識一下部署套件的流程，有興趣了解細節的朋友可以查看 [官方文件](https://v2.vuejs.org/v2/cookbook/packaging-sfc-for-npm.html)，或 google 搜尋更多資源。

**[☞ 思考專案套件化後的使用情境]()**

簡單了解部署套件的流程以後，接著我們來初步構思一下，若是我們想將 `專案` 套件化，使用的時候應該要如何使用？先定義好使用方式，我們才更容易思考如何建構專案。

首先，因為我們的專案也要能支援客製化，所以我們得要能接收使用者給我們的資料才行。回想過去我們在使用元件的時候，通常會如何讓元件接收外部傳送進來的資料？我們最常使用的方式，就是透過 props，或者是 slot 來傳遞。

```html
// 在父層元件引入 child component 使用，並且傳入 props1、props2、slot 等資料

<template>
  <child-component :props1="aaa" :props2="bbb"> slot content </child-component>
</template>
<script>
  import childComponent from "./childComponent";
  export default {
    components: {
      "child-component": childComponent,
    },
  };
</script>
```

子層的 child component 就能對接收到的 props1、props2、slot 來做事情：

```html
// 在子層接收 props 等資料

<template>
  <div :class="props1 === 'aaa' ? 'active' : ''" :type="props2"></div>
</template>
<script>
  export default {
    props: ["props1", "props2"],
  };
</script>
```

那如果我把整個 App 作為一個元件讓外部做使用，例如在 App 上面挖很多個 props (ex. config, schema, model)，這樣使用者就可以透過這些 props 來傳入設定。

```html
// 引入整個 App 元件

<template>
  <App :config="config" :schema="schema" :model="model"></App>
</template>
<script>
  import App from "<套件>";
  Vue.use(App);
</script>
```

上面這樣子的使用方式，就可以把專案最外層的 component (App)，作為一個很大的元件，提供給外部做引用。使用者就可以直接像操作 component 一樣的方式來做使用。我們可以把這種套件化的方式稱作 `Base on component`，透過 component 的概念來將專案套件化。

`Base on component` 是最直覺，最好理解的一種套件化方式之一。但是它會存在一些不便，因為我們的資料需要透過 props、slot 做傳遞，所以如果是這兩種方式沒辦法傳遞的資料，就得依賴別種管道來做處理了。

這樣會對專案的實際應用產生限制，例如我們不能夠利用 props 來新增 routes，也就是說使用者將會無法新增新的頁面到專案當中，這絕對是不行的。所以得另外找出可以用來新增 routes 的方式。

為了解決這個問題，我重新回到官方文件去找靈感。看看如何能設計出一種簡單就能新增 routes 的方式。後來發現，當我們在使用框架的時候，其實都會有一個將 router 註冊上 App 的動作。

```js
new Vue({
  router: router
  render: (h) => h(App),
}).$mount('#app');

```

也就是說，如果我能夠把 routes 先新增好，再把 router 註冊上 App，其實就能達成新增 routes 的需求了。以這個改念下去延伸，我只需要接收到 routes 的設定，再將它加入原本的 router 即可。

流程是這樣子：

1. 接收 routes 的設定
2. 將 routes 新增進 router
3. 把 router 註冊到 App

例如：我原本的 `核心` 只有 login 頁面，我在購物網站這個專案底下想要新增商品頁面，只需要傳入 routes 的設定並註冊上 App 就可以了。

```js
// 核心的 routes 只有 login 頁面
const routes = [
  {
    path: "/login",
    components: loginPage,
  },
];

// 我設計一個 function 只要呼叫就可以把 route 的設定新增進 routes
const registerRoutes = (newRoute) => {
  routes.push(newRoute);
};
```

```js
// 當我呼叫新增 routes 的 function
registerRoutes({ path: "/products", components: ProductsPage });

// products 就會被新增進 routes 當中
console.log(routes);
/*
[
  {
    path: '/login',
    components: loginPage,
  },
  {
    path: '/products',
    components: ProductsPage
  }
]
*/
```

```js
// 最後再把新增完成的 router 註冊上 App

import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes,
});

new Vue({
  router: router
  render: (h) => h(App),
}).$mount('#app');

```

如此一來只要使用者想新增 routes，只需要呼叫 `registerRoutes` 並傳入設定即可。

既然我們可以提供新增 routes 的 function，那我們就可以提供新增 component 的 function。讓使用者自行呼叫 function 就可以新增新的頁面或元件。使用時期望可以單純透過 call function 的動作，就完成所有客製化頁面、元件的註冊：

```js
// 使用時

import Core from "<套件>";

Core.registerRoutes(customRoute);
Core.registerComponents(customComponent);
```

我們把上面這種使用方式稱作 `Base on register`，透過註冊的方式來實作專案套件化。
有了這個註冊的機制以後，我們就可以自由定義要讓哪些東西被註冊，routes、store、i18n...等等都可以開放讓使用者進行註冊。

> 有一點值得注意的問題是，我們必須要等到所有該註冊的東西都註冊完了，才可以執行 `new Vue` 的動作，否則一但 `new Vue` 執行完了，我再加新的 routes 進去也不會成功註冊到 App 上面。

代表 `new Vue` 這個行為是要讓使用者可以自行呼叫的。當使用者註冊完所有東西以後，自行呼叫 `new Vue`。
所以我們可以把使用情境改成下面這樣：

```js
// main.js 套件使用情境

// 使用時先註冊完所有東西，再執行 new Vue
import Core from "<套件>";

Core.registerRoutes(customRoute);
Core.registerComponents(customComponent);
Core.registerRun(); // 這個 function 用來執行 new Vue 這個動作
```

**[☞ 將專案套件化]()**

現在使用的情境已經有了，我們只需要針對這個使用情境，來製作這個 `Core` 的功能就行了。
我們把我們的注意力，拉回到套件的製作上面。

因為我們是將整份專案製作成套件，所以我們會需要用到這個專案原本的設定：

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
```

在沒有要註冊任何東西的情況下，其實只需要把 `核心` 專案底下的所有東西註冊上 App 並回傳出去即可

```js
// core.js 套件開發

import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const registerRun = () => {
  return new Vue({
    router: router,
    store,
    render: (h) => h(App),
  }).$mount("#app");
};

export default registerRun;
```

其實上面的步驟就只是平常我們在使用框架時，多把 `new Vue` 包成一個 function，並且主動去呼叫它而已。
當我們把這支 core.js 作為套件的入口點，就可以在引入套件時直接使用到 core.js 匯出的 registerRun 這個 function。

```json
// 套件的 package.json
{
  "name": "core",
  "version": "1.0.0",
  "main": "src/core.js",  // 把 core.js 作為整個套件的入口檔
  .
  .
  .
}


```

專案在使用套件時，就可以直接用 core.js 提供的 function：

```js
// main.js 套件使用情境
import Core from "<套件>";
Core.registerRun();
```

接下來做的事情，就是定義 registerRoutes、registerComponents 兩個 function，並把它們跟 registerRun 一起包進一個 Object 並且 export 出去：

```js
// core.js 套件開發
import Vue from "vue";
import App from "./App.vue";
import routes from "./router/routes";
import router from "./router";
import store from "./store";

export default {
  registerRoutes: (route) => {
    ...
  },
  registerComponents: (component) => {
    ...
  },
  registerRun: () => {
    return new Vue({
      router: router,
      store,
      render: (h) => h(App),
    }).$mount("#app");
  };
};

```

專案在使用套件時，就可以直接用 core.js 匯出的整個 Object：

```js
// main.js 套件使用情境
import Core from "<套件>";

Core.registerRoutes(customRoute);
Core.registerComponents(customComponent);
Core.registerRun();
```

由於 main.js 會作為專案的 js 入口點，所以執行 `Core.registerRun()` 就等於透過 `new Vue` 將整個 Vue 專案綁到 `<div id="app"></div>` 這個 tag 上面。這個操作就能夠將核心的專案透過套件引入進來，並且註冊好客製化的頁面及元件，最後綁到 HTML 上面，完成整個專案套件的引入。

日後我有新的功能想要加進 `核心` 套件時，只需要把功能完成後建立新的版號，就可以在新的專案當中引入新版本的 `核心` 套件進行開發。而這個 `核心` 套件，就能在每一次建立新專案的時候一直被重複使用。

**[☞ 延伸思考]()**

專案套件化的基本概念，就如同上面提供的方法。不過還是有很多值得思考的問題：

- 如何避免使用者註冊的客製化 component 跟核心的 component 發生衝突？
- 如何避免註冊 routes 之後可能造成核心功能壞掉？
- 套件化以後的專案，在引用時如何解決 babel 不會轉譯 node_module 檔案的問題？
- 上面介紹的 `registerRoutes`、`registerComponents` 都只有提到概念而已，細節該如何去規劃？
- 如何開放其他功能讓使用者註冊？

## 總結

比起網頁開發，開發套件其實更像是軟體開發。當有不同的使用情境出現時，就會有不同的需求需要滿足。雖然不是每個開發者都會遇到需要開發大量專案的情境，也不見得大家會有需要將專案製作成套件的需求，不過每項工具的實作，相信都有它值得參考的價值。因為一但有人拋了新的概念出來時，或許相同的主題底下，每個人都有機會想出不同的解決方法。

對了～延伸思考的問題並沒有標準答案，需要視使用情境而定。所以如果看完這篇文章的你也有實作專案套件化的需求，都歡迎跟我交流心得唷。
