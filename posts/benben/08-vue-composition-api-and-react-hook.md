---
title: Vue3 Composition API & React hooks
date: 2022-07-30
tags: [Front-end, react, vue]
author: benben
layout: layouts/post.njk
image: https://dev-to-uploads.s3.amazonaws.com/i/296z018ivuyy4p3954at.png
---

<!-- summary -->
<!-- One side can't reach this altitude without another side. -->
<!-- summary -->

**! this article is about usage of Vue Composition API and React hooks. And assumes that you have knew some basic about one of them.**

![vue/react](https://dev-to-uploads.s3.amazonaws.com/i/296z018ivuyy4p3954at.png)

> [image resource](https://dev.to/vuesomedev/write-vue-like-you-write-react-23p9)

## Preface

Hi, there!

I'm Benben and this is my first time trying to write article with full English(Maybe the last time XD).

Why I wrote this article?

: I am still learning React and Vue, and very love both of them!

Why I wrote this article in English?

: Also I'm still learning English. Actually, My mother tongue is Mandarin(Tradition Chinese Specifically). But in real world, English is the most used language for software developer. There are so many many documents wrote in English or English only.

I'm not show off I'm good at English or something. In fact, I only got 550 points TOEIC (full score is 990), sounded incredible? But don't be, maybe this article just like a shit for someone. I have no argue with that. But you know what? Maybe 1 ~ 3 years later, this shit article could make me successful in my field, who knows?

Alright, bullshit enough. Let's do some coding.

## Before start

So, when you joined the fight between Vue and React framework. You chose one side which is probably your favorite one. For most people, maybe that framework is the one and only they have learned.

But some developers will try to understand each other (Angular: I'm not made of plastic.). That is a good but rare situation. Most people like religious war and fight for their personal religion.

It's hard to acknowledge these fighting is not very helpful for anyone. Because in software field, there is **no silver bullet**. That say there is no the best tool can be used in any scenario.

You must take a long views. Not because old things change rapidly or because new things are hard to learn, but because **everything fails all the time**.

> everything fails all the time - Werner Vogels (Amazon vice president and CTO)

## Basic Usage

Let's see a basic usage - `Counter`!

A simple counter is always the best example to learn new Front-End framework. It show us how to definite reactive data and how reactive data drives the view layer.

Here are simple examples.

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

Both of them are not very different, right?

But still there are in different spirit.

I'm not talking about `MVC`, `MVVM` model or something like that.  This topic really make many people confused, I guess. Take `MVC` for instance, what is `M`? what is `V`? what is `C`? And how do you implement them? There's no standard answer.

> Read more: [What is the difference between MVC and MVVM? - Stack Overflow](https://stackoverflow.com/questions/667781/what-is-the-difference-between-mvc-and-mvvm)

Let's keep simple and see what we got.

In React, you build a component more like writing everything in JavaScript(CSS also can be in JavaScript, like CSS-in-JS).

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

In Vue, you build a component more like a mini HTML/JS/CSS instance.

> vue

```html
<script setup>
  // JS/TS here! like logic, composition API etc.
</script>

<template>
  <!-- Template here! -->
</template>
```

In the another hand, CSS is the different story. There are a lot of solutions, you can choose what you need or just follow your religion, but that's kind of out of this topic.

In my opinion, I think Vue has a very open mindset about other competitor.

> Read more: <https://vuejs.org/guide/extras/composition-api-faq.html#comparison-with-react-hooks>

Moreover, I think React's document is some kind of out-dated. I sure that there are lots of people when they try to learn React (particular after 16.8) first time with a question: "Should learn Class component or Hooks first?"

In 2022, I would say learn Hooks first, but keep learning some Class component which you maybe need to maintain some legacy code written in it. In addition, class component contains a lot of good programming concepts like `classes`, `inherit`, `this` ...etc.

Recently React also renovate their document (2022.06). That is a good news for everyone.

> Read more: <https://beta.reactjs.org/learn>

As we can see, React Hooks feature released early than Vue Composition API. But the new document of Vue Composition API very early release than React's new document.

I bet this renovation been inspired by Vue. Vue3's new document released in 2022.02(about Chinese New Year) and it is very amazing. Both of two new document have dark mode, more newbie friendly, and more code example ...etc. I think it is a healthy competition and we developers take advantage of it. One side can't reach this altitude without another side.

## Composition API and Hooks

Let's explore more in Composition API and React Hooks.

Here is an example like Counter but we add a `global` counter feature in it.

We will just use in **plain React's or Vue's API**, instead of using State management library like Redux/Zustand or Vuex/Pinia or something like that.

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

![vite + vue](https://hackmd.io/_uploads/rJectHun5.gif)

> Check out [full source code]( https://github.com/benben6515/counters/tree/main/vue-counter)

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

![vite + react](https://hackmd.io/_uploads/B1noYS_2c.gif)

> Check out [full source code]( https://github.com/benben6515/counters/tree/main/vue-counter)

At this example, the most different between React and Vue is that the **React's hook can `NOT` to write in the top level** while **Vue3's Composition API can do this!**

That why some people say composition API could replace Vuex(Pinia). And the `useContext` play a same role in React.

In fact, you can use them in a small project and that's no problem. But when you build a bigger project considering to use Redux/Vuex(Pinia) which are more reasonable option.

React's hook is very creative.

But in some cases like this example, Vue's Composition API is more flexible and intuitive.

> if you want see more about React and Vue: [I created the exact same app in React and Vue. Here are the differences. | by Sunil Sandhu](https://javascript.plainenglish.io/i-created-the-exact-same-app-in-react-and-vue-here-are-the-differences-e9a1ae8077fd)

## React and Vue

I think React and Vue are like friend and enemy, the **React hooks do inspired Vue's Composition API** which mention it in Vue's document and admitted it.

In my opinion, that is a healthy competition rather than "Involution".

Image the scenario which if only remain just React or just Vue in the world.

Maybe just React or Vue would not so powerful, but because there are both of them so people can discuss for them, argue for them, love  them.

Thank React and Vue, they do make front-end development easier. Even ordinary me can build some simple web app.

I'm gratified that we are living in a best era.

Cheer and be happy codding.

## Ref

- [I created the exact same app in React and Vue. Here are the differences. | by Sunil Sandhu](https://javascript.plainenglish.io/i-created-the-exact-same-app-in-react-and-vue-here-are-the-differences-e9a1ae8077fd)
- [A Complete Guide to useEffect — Overreacted | by Dan](https://overreacted.io/a-complete-guide-to-useeffect/)
- [Composition API FAQ | Vue.js](https://vuejs.org/guide/extras/composition-api-faq.html)
- [React Docs Beta](https://beta.reactjs.org/)

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at <benben.me>
