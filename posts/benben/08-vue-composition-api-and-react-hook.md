---
title: Vue3 Composition API & React hooks
date: 2022-07-30
tags: [Front-end, react, vue]
author: benben
layout: layouts/post.njk
image: https://dev-to-uploads.s3.amazonaws.com/i/296z018ivuyy4p3954at.png
lang: zh-TW
translationKey: benben/08-vue-composition-api-and-react-hook
translationTargets: [en, ja, zh-CN]
---

<!-- summary -->
<!-- 單憑其中一方，是無法達到這個高度的。 -->
<!-- summary -->

**！本篇文章會介紹 Vue Composition API 與 React hooks 的用法，並假設你已經對兩者其中之一有基本認識。**

<center>

![vue/react](https://dev-to-uploads.s3.amazonaws.com/i/296z018ivuyy4p3954at.png)

</center>

> [圖片來源](https://dev.to/vuesomedev/write-vue-like-you-write-react-23p9)

## 前言

嗨！

我是 Benben，這是我第一次嘗試用全英文寫文章（也可能是最後一次 XD）。

為什麼我會寫這篇文章？

：我還在學 React 和 Vue，而且兩個都非常喜歡！

那為什麼要用英文寫？

：因為我也還在學英文。其實我的母語是國語（準確說是繁體中文）。但在現實世界裡，英文是軟體開發者最常使用的語言，有非常非常多的文件是用英文寫的，甚至只有英文版。

我不是在炫耀自己英文有多好。事實上，我的多益（TOEIC）只考了 550 分（滿分 990），聽起來很扯吧？但其實也沒什麼好意外的，對某些人來說，這篇文章可能就是一坨屎，這點我不反對。但你知道嗎？也許 1～3 年後，這坨屎文章會讓我在這個領域成功也說不定，誰知道呢？

好啦，廢話夠了。來寫點 code 吧。

## 開始之前

所以，當你加入了 Vue 與 React 框架的戰爭，你會選一邊站——通常是比較偏愛的那一邊。對大多數人來說，那個框架可能就是他們唯一學過的。

但有些開發者會試著去理解另一方（Angular：我不是塑膠做的）。這是個美好但罕見的情境。大多數人喜歡打宗教戰，為自己的信仰而戰。

很難讓人承認這些爭論對任何人其實都沒什麼幫助。因為在軟體領域，**沒有銀彈**。也就是說，沒有任何一個工具可以在所有情境下都是最好的。

你必須把眼光放長遠。不是因為舊東西變化很快，也不是因為新東西很難學，而是因為 **everything fails all the time（所有東西隨時都在故障）**。

> everything fails all the time - Werner Vogels（Amazon 副總裁暨技術長）

## 基本用法

來看看基本用法——`Counter`（計數器）！

一個簡單的計數器，永遠是學習新前端框架最好的範例。它讓我們看到如何定義響應式資料，以及響應式資料如何驅動視圖層。

以下是簡單的範例。

> in react

```jsx
import { useState } from 'react'

const Counter = () => {
  const [count, setCount] = useSate(0)
  return (
    <div>
      <h1>Counter:</h1>
      <button onClick={() => setCount(count + 1)}>you click: { count } times!</button>
    </div>
  )
}

export default Counter
```

> in vue

```html
<script setup>
import { ref } from 'vue'
const count = ref(0)
const addCount = () => ref.value++
</script>

<template>
  <h1>Counter:</h1>
  <button @click="addCount">you click: {{ count }} times!</button>
</template>
```

兩者其實差別不大，對吧？

但兩者背後的精神還是不一樣。

我不是要談 `MVC`、`MVVM` 模型之類的東西。我想這個話題讓很多人感到困惑。以 `MVC` 來說，`M` 是什麼？`V` 是什麼？`C` 是什麼？又要如何實作它們？沒有標準答案。

> 延伸閱讀：[What is the difference between MVC and MVVM? - Stack Overflow](https://stackoverflow.com/questions/667781/what-is-the-difference-between-mvc-and-mvvm)

讓我們保持簡單，看看我們得到了什麼。

在 React 中，你寫一個 component 比較像把所有東西都寫在 JavaScript 裡（CSS 也可以放進 JavaScript，例如 CSS-in-JS）。

> react

```jsx
const Component = () => {
  // JS/TS here! like logic, hooks etc.
  return (
    <div>
      {/* Template here! */}
    </div>
  )
}

export default Component
```

在 Vue 中，你寫一個 component 比較像是一個小型的 HTML/JS/CSS 實例。

> vue

```html
<script setup>
  // JS/TS here! like logic, composition API etc.
</script>

<template>
  <!-- Template here! -->
</template>
```

另一方面，CSS 又是另一回事了。有非常多的解決方案，你可以選自己需要的，或者跟著自己的信仰走，但這就有點離題了。

在我看來，我覺得 Vue 對其他競爭者抱持著非常開放的心態。

> 延伸閱讀：<https://vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks>

除此之外，我認為 React 的文件有點過時了。我相信很多人第一次嘗試學 React（特別是 16.8 之後）時，都會有一個疑問：「應該先學 Class component，還是先學 Hooks？」

在 2022 年，我會說先學 Hooks，但還是要學一些 Class component，因為你可能需要維護用 Class component 寫的舊程式碼。此外，class component 也包含了許多好的程式設計概念，像是 `classes`、`inherit`、`this` 等等。

最近 React 也翻新了他們的文件（2022.06）。這對所有人來說都是好消息。

> 延伸閱讀：<https://beta.reactjs.org/learn>

如我們所見，React Hooks 功能比 Vue Composition API 早推出。但 Vue Composition API 的新文件卻比 React 的新文件早很多推出。

我敢打賭這次翻新是受到 Vue 的啟發。Vue3 的新文件在 2022.02（大約農曆新年時候）推出，非常令人驚豔。兩份新文件都有暗色模式，對新手更友善，也有更多程式碼範例等等。我覺得這是一種良性競爭，而我們開發者從中受惠。單憑其中一方，是無法達到這個高度的。

## Composition API 與 Hooks

讓我們更深入探討 Composition API 與 React Hooks。

這裡有一個類似 Counter 的範例，但我們在裡面加上了一個 `global` counter 功能。

我們只用 **React 或 Vue 原生的 API**，而不使用 Redux/Zustand 或 Vuex/Pinia 之類的狀態管理 library。

in **Vue3 Composition API**

> useCounter.js

```javascript
import { ref } from 'vue'

// global
const globalCount = ref(0)
const addGlobalCount = () => globalCount.value++

export const useCounter = () => {
  // local
  const localCount = ref(0)
  const addLocalCount = () => localCount.value++

  return {
    globalCount,
    addGlobalCount,
    localCount,
    addLocalCount,
  }
}
```

> Counter.vue

```javascript
<script setup>
import { useCounter } from '../composition/useCounter'

const { msg } = defineProps()

const {
  globalCount,
  addGlobalCount,
  localCount,
  addLocalCount,
} = useCounter()
</script>

<template>
  <div class="card">
    <button type="button" @click="addLocalCount">
      {{ msg }} count is: {{ localCount }}
    </button>
    <button type="button" @click="addGlobalCount">
      global count is: {{ globalCount }}
    </button>
  </div>
</template>
```

> app.vue

```html
<script setup>
import Counter from './components/Counter.vue'
import { useCounter } from './composition/useCounter'

const { globalCount } = useCounter()
</script>

<template>
  <div>
    <p>Global count is {{ globalCount }}</p>
  </div>
  <Counter msg="first" />
  <Counter msg="second" />
</template>
```

<center>

![vite + vue](https://hackmd.io/_uploads/rJectHun5.gif)

</center>

> 完整原始碼請見 [full source code]( https://github.com/benben6515/counters/tree/main/vue-counter)

in **React hook**

> Counter.jsx

```jsx
import { useState, useContext } from 'react'
import { GlobalCounterContext } from './contexts'

const Counter = ({ id }) => {
  const [count, setCount] = useState(0)
  const { globalCount, setGlobalCount } = useContext(GlobalCounterContext)
  return (
    <div>
      <button onClick={() => setCount((count) => count + 1)}>
        {id} count is: {count}
      </button>
      <button onClick={() => setGlobalCount((count) => count + 1)}>
        global count is {globalCount}
      </button>
    </div>
  )
}

export default Counter
```

> App.jsx

```jsx
import { useState } from 'react'
import Counter from './Counter'
import { GlobalCounterContext } from './contexts'

function App() {
  const [globalCount, setGlobalCount] = useState(0)

  return (
    <GlobalCounterContext.Provider value={{ globalCount, setGlobalCount }}>
      <div className="App">
        <h1>Vite + React</h1>
        <p>global count: {globalCount}</p>
        <div className="card">
          <Counter id="first" />
          <Counter id="second" />
        </div>
      </div>
    </GlobalCounterContext.Provider>
  )
}

export default App
```

<center>

![vite + react](https://hackmd.io/_uploads/B1noYS_2c.gif)

</center>

> 完整原始碼請見 [full source code]( https://github.com/benben6515/counters/tree/main/vue-counter)

在這個範例中，React 與 Vue 最大的差別在於：**React 的 hook `不能` 寫在最頂層以外的地方**，而 **Vue3 的 Composition API 可以！**

這就是為什麼有人說 Composition API 可以取代 Vuex（Pinia）。而 React 中的 `useContext` 扮演著同樣的角色。

事實上，在小專案中使用它們完全沒問題。但當你要打造更大的專案時，可以考慮使用 Redux / Vuex（Pinia），它們是更合理的選擇。

React 的 hook 非常有創意。

但在像這個範例的一些情境中，Vue 的 Composition API 更靈活、更直覺。

> 如果想看更多 React 與 Vue 的比較：[I created the exact same app in React and Vue. Here are the differences. | by Sunil Sandhu](https://javascript.plainenglish.io/i-created-the-exact-same-app-in-react-and-vue-here-are-the-differences-e9a1ae8077fd)

## React 與 Vue

我認為 React 與 Vue 亦敵亦友，**React hooks 確實啟發了 Vue 的 Composition API**——這點在 Vue 的文件中有提到，Vue 也承認了。

在我看來，這是良性競爭，而不是「內卷」。

想像一下這個情境：如果世界上只剩下 React，或只剩下 Vue。

也許光只有 React 或 Vue，它們不會這麼強大。但正因為兩者並存，人們才能討論它們、為它們爭辯、喜愛它們。

感謝 React 與 Vue，它們確實讓前端開發變得更簡單。即使是平凡如我，也能打造一些簡單的 web app。

我很慶幸我們活在一個最好的時代。

乾杯，祝 coding 愉快。

## Ref

- [I created the exact same app in React and Vue. Here are the differences. | by Sunil Sandhu](https://javascript.plainenglish.io/i-created-the-exact-same-app-in-react-and-vue-here-are-the-differences-e9a1ae8077fd)
- [A Complete Guide to useEffect — Overreacted | by Dan](https://overreacted.io/a-complete-guide-to-useeffect/)
- [Composition API FAQ | Vue.js](https://vuejs.org/guide/extras/composition-api-faq.html)
- [React Docs Beta](https://beta.reactjs.org/)

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
