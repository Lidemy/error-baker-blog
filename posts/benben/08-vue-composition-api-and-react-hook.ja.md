---
title: Vue3 Composition API & React hooks
date: 2022-07-30
tags: [Front-end, react, vue]
author: benben
layout: layouts/post.njk
image: https://dev-to-uploads.s3.amazonaws.com/i/296z018ivuyy4p3954at.png
lang: ja
sourceLang: zh-TW
translationKey: benben/08-vue-composition-api-and-react-hook
permalink: /ja/posts/benben/08-vue-composition-api-and-react-hook/
draft: true
sourceHash: 1247b7500dea748147b2f8145eea3f7e91de09f0037b894694eced47dbb319fc
---

<!-- summary -->
<!-- 片方だけでは、この高みには届かない。 -->
<!-- summary -->

**！本記事では Vue Composition API と React hooks の使い方を紹介します。どちらか一方について基本的なことを知っていることを前提としています。**

<center>

![vue/react](https://dev-to-uploads.s3.amazonaws.com/i/296z018ivuyy4p3954at.png)

</center>

> [画像出典](https://dev.to/vuesomedev/write-vue-like-you-write-react-23p9)

## はじめに

やあ！

Benben です。今回は初めて全文英語で記事を書いてみました（もしかすると最後かもしれません XD）。

なぜこの記事を書いたのか？

：私はまだ React と Vue を学習中で、両方とも大好きです！

ではなぜ英語で書いたのか？

：英語もまだ学習中だからです。実は私の母語は北京語（正確には繁体字中国語）です。でも現実世界では、ソフトウェア開発者にとって最も使われる言語は英語で、非常に多くのドキュメントが英語で書かれているか、英語しか存在しません。

私は英語が得意だからといって自慢しているわけではありません。実際、TOEIC は 550 点（満点 990）しか取れておらず、信じられないでしょう？でも驚くことではありません。この記事は誰かにとってはクソ記事かもしれませんし、それには反論しません。でもどうでしょうか、1〜3 年後にはこのクソ記事が私をこの分野で成功させるかもしれません。誰に分かるでしょうか？

さて、冗談はこの辺にして、コードを書きましょう。

## 始める前に

Vue と React フレームワークの戦いにあなたが参加したとき、おそらく好きな方を選びます。ほとんどの人にとって、そのフレームワークは自分が学んだ唯一のものかもしれません。

でも一部の開発者は、もう一方を理解しようとします（Angular：私はプラスチック製じゃないんだけど）。これは素晴らしいけれど珍しいケースです。ほとんどの人は宗教戦争が好きで、自分の信仰のために戦います。

こうした争いが誰にとってもあまり役に立たないと認めるのは難しいものです。なぜならソフトウェアの世界には **銀の弾丸はない** からです。どんな場面でも最強というツールは存在しません。

長い目で見なければなりません。古いものが急速に変わるからでも、新しいものが学びにくいからでもなく、**everything fails all the time（あらゆるものは常に壊れる）** からです。

> everything fails all the time - Werner Vogels（Amazon 副社長兼 CTO）

## 基本的な使い方

基本的な使い方を見てみましょう —— `Counter`！

シンプルなカウンターは、新しいフロントエンドフレームワークを学ぶ際に常に最良の例です。リアクティブなデータをどう定義するか、そしてリアクティブなデータがどうビュー層を駆動するかを示してくれます。

シンプルな例を以下に示します。

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

両者に大きな違いはありませんよね？

でも背後にある精神は違います。

`MVC` や `MVVM` モデルの話をするわけではありません。この話題は多くの人を混乱させると思います。`MVC` を例に挙げると、`M` とは？`V` とは？`C` とは？そしてどう実装するのか？標準答えはありません。

> 関連読書：[What is the difference between MVC and MVVM? - Stack Overflow](https://stackoverflow.com/questions/667781/what-is-the-difference-between-mvc-and-mvvm)

シンプルに進めましょう。

React では、コンポーネントを書くのは、すべてを JavaScript の中に書くようなものです（CSS も JavaScript の中に入れられます。CSS-in-JS のように）。

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

Vue では、コンポーネントを書くのは、ミニチュアの HTML/JS/CSS インスタンスのようなものです。

> vue

```html
<script setup>
  // JS/TS here! like logic, composition API etc.
</script>

<template>
  <!-- Template here! -->
</template>
```

一方で、CSS は別の話です。たくさんの解決策があり、必要なものを選ぶか、自分の信仰に従うかできますが、これは本題から外れます。

私の見解では、Vue は他の競合に対して非常にオープンな姿勢を持っています。

> 関連読書：<https://vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks>

さらに、React のドキュメントはいくぶん古いと思います。React を初めて学ぶ（特に 16.8 以降）多くの人が「Class component を先に学ぶべきか、Hooks を先に学ぶべきか？」という疑問を持つはずです。

2022 年の時点では、まず Hooks を学ぶことをお勧めします。でも Class component もいくらか学んでください。なぜなら Class component で書かれたレガシーコードを保守する必要があるかもしれないからです。また、Class component には `classes`、`inherit`、`this` など、良いプログラミングの概念が多く含まれています。

最近 React もドキュメントを刷新しました（2022.06）。これはすべての人にとって良いニュースです。

> 関連読書：<https://beta.reactjs.org/learn>

見ての通り、React Hooks 機能は Vue Composition API より先にリリースされました。でも Vue Composition API の新しいドキュメントは、React の新しいドキュメントよりずっと早くリリースされました。

私はこの刷新が Vue にインスピレーションを受けたものだと賭けてもいいと思います。Vue3 の新ドキュメントは 2022.02（旧正月頃）にリリースされ、非常に素晴らしいものです。二つの新ドキュメントは両方ともダークモードを備え、初心者に優しく、コード例も豊富です。これは健全な競争であり、私たち開発者はその恩恵を受けています。片方だけでは、この高みには届かなかったでしょう。

## Composition API と Hooks

Composition API と React Hooks についてさらに掘り下げてみましょう。

ここに Counter に似た例がありますが、`global` カウンター機能を追加しています。

Redux/Zustand や Vuex/Pinia のようなステート管理ライブラリは使わず、**React または Vue のネイティブ API** だけを使います。

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

> 完全なソースコードは [full source code]( https://github.com/benben6515/counters/tree/main/vue-counter) を参照

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

> 完全なソースコードは [full source code]( https://github.com/benben6515/counters/tree/main/vue-counter) を参照

この例で React と Vue の最も大きな違いは、**React の hook はトップレベル以外の場所に書いてはいけない（`NOT`）** のに対し、**Vue3 の Composition API はそれができる！** という点です。

だから Composition API は Vuex（Pinia）を置き換えられると言う人もいます。そして React では `useContext` が同じ役割を果たします。

実際、小さなプロジェクトでこれらを使うのは問題ありません。でも大きなプロジェクトでは、Redux / Vuex（Pinia）などを使うのがより合理的な選択肢になります。

React の hook は非常に創造的です。

でもこの例のようなケースでは、Vue の Composition API の方が柔軟で直感的です。

> React と Vue についてもっと見たい場合：[I created the exact same app in React and Vue. Here are the differences. | by Sunil Sandhu](https://javascript.plainenglish.io/i-created-the-exact-same-app-in-react-and-vue-here-are-the-differences-e9a1ae8077fd)

## React と Vue

React と Vue は友達でもあり敵でもあると私は思っています。**React hooks は確かに Vue の Composition API にインスピレーションを与えました**。これは Vue のドキュメントでも言及され、認められています。

私の見解では、これは「内巻（Involution）」ではなく健全な競争です。

世界に React だけ、あるいは Vue だけしか残っていないシナリオを想像してみてください。

もしかすると React だけ、あるいは Vue だけでは、これほど強力ではなかったかもしれません。でも両方あるからこそ、人々は議論し、議論し、愛せるのです。

React と Vue に感謝します。彼らは確かにフロントエンド開発を简単にしてくれました。平凡な私でさえ、简単な web アプリを作れます。

私たちは最良の時代に生きていることを嬉しく思います。

乾杯、そして楽しくコーディングを。

## Ref

- [I created the exact same app in React and Vue. Here are the differences. | by Sunil Sandhu](https://javascript.plainenglish.io/i-created-the-exact-same-app-in-react-and-vue-here-are-the-differences-e9a1ae8077fd)
- [A Complete Guide to useEffect — Overreacted | by Dan](https://overreacted.io/a-complete-guide-to-useeffect/)
- [Composition API FAQ | Vue.js](https://vuejs.org/guide/extras/composition-api-faq.html)
- [React Docs Beta](https://beta.reactjs.org/)

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
