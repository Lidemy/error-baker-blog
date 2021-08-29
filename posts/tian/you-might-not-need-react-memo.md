---
title: 你可能不需要 React Memo
date: 2021-08-29
tags: [performance, react, memo]
author: tian
layout: layouts/post.njk
---

## 先說說我的結論
<!-- summary -->
對 React 的 Functional Component 做渲染效能優化，不一定要使用 `memo` 來達成，也可以透過元件的重組或 `useMemo` 來達成。
<!-- summary -->
值得注意的是，每一種優化都會帶來相應的成本（犧牲可讀性以及開發效率），先釐清需求之後再來使用，才能取得綜效。
<!-- more -->


## 誰比較適合閱讀？

- 使用 React v16.6+ 的開發者
- 你知道 `memo` 的存在，但不確定應該在哪些情境下使用它們。


如果你不是上述對象，也沒有上述問題，你可以考慮改去讀讀其他夥伴們的[優秀作品](https://blog.errorbaker.tw/) ～

## 前言

直接寫出效能與可讀性兼具的 React 程式碼，我認為這是在各種前端優化方式中[1]，最容易順手做到的一種，你一定聽過 `memo` ，但你知道怎麼使用它寫出可讀性和效能兼具的程式碼嗎？至少在寫這篇文章前，我沒辦法很肯定的說出我知道...

### 這篇文章之所以存在，是因為我想要解決的自己的幾個問題

- 為什麼需要 `memo`？在什麼情境下需要 `memo`？
- `memo` 背後的 shallow compare 是怎麼運作的 ？
- 使用 `memo` 要付出什麼樣的成本？
- 有了 `useMemo` 之後，還有使用 `memo` 的場景嗎？

### 從情境開始

我相信每個技術，都是解決特定場景下的特定問題，所以要能理解一個技術的使用，我覺得一定要從問題場景開始說起，

如果你也使用 React 開發，你會知道 Component 每次的 state 的改變都會讓下層所有 Component re-render，元件層數少的時候可能還感覺不出來，一旦元件層數和數量增加，每一次的 re-render 都是成倍數的增加，你前端應用程式效能也會一起跟著變慢。有沒有一種元件，是只有 props 改變時，元件才會重新渲染呢？有，那就是 Pure Component。

### 幫自己寫個 User Story

我希望只有當 Component 的 props 和內部的 state 改變的時候，元件才會 re-render，這樣就可以避免不必要的渲染，增加前端應用程式的效能。

## 什麼是 Pure Component ?

借用 Pure Function 這個概念，可能會比較好理解，Pure Function 指的是

> 一個 function return 的 value，只受 function 的 parameter 決定。

同理，你可以想像 Functional Component 也是一個 function

> 一個 Component 當下渲染的結果，只受 props 的影響，只要 props 相同，re-render 的結果就會相同

我們可以利用這個特性，將 Component 上一次渲染的結果記憶起來，當上層 Component 的狀態改變，沒有影響到 props 的時候就不需要 re-render，這樣就可以避免不必要的渲染，那我們就可以稱這樣的 Component 為 Pure Component。

與原來一般的 Component 最大的差別是 Pure Component 只有在上層傳給 Component 的 props 改變的時候，才會 re-render。

### 如何將一個 Functional Component 改造成 Pure Component ？

React 提供了一個 HOC —— `memo` [2]，只要將 `memo` 包在 Functional Component 外面，就可以將 Component 改造成 Pure Component

```tsx
function FunctionalComponent(props) {
  /* render using props */
}
const PureComponent = React.memo(FunctionalComponent) // default shallow compare

export default PureComponent
```

```tsx
function FunctionalComponent(props) {
  /* render using props */
}
function shouldPreventReRendering(prevProps, nextProps) {}

const PureComponentWithCustomCompareFunction = React.memo(
	FunctionalComponent, 
	shouldPreventReRendering // custom compare function
)
export default PureComponentWithCustomCompareFunction
```

## React.memo 幫我們做了什麼 ？

要實現 Pure Component 需要做到兩件事情，記憶和對照

1. 記憶：記憶這次渲染的 props 是什麼
2. 對照：每次上層元件 re-render 的看看記憶中的 `prevProps` 和當下的 `nextProps` 有沒有差別，如果沒有客製化 `compare` function，預設是使用 `shallowEqual` [3] 做對照。

    ```jsx
    const compare =
      shouldPreventReRendering // custom compare function
      || shallowEqual // default compare function
    compare(prevProps, nextProps) // if true prevent rerender
    ```

    ```jsx
    /*
      shallowly compare the component props
      if passing nextProps to render would return the same result as passing prevProps to render,
      return `true`
      otherwise, return false
    */
    function shallowEqual(objA: mixed, objB: mixed): boolean {
      // prevProps 和 nextProps 完全相同
      // P.S. 不太清楚什麼情況下 prevProps 和 nextProps 會完全相同，如果你知道的話可以告訴我嗎？
      if (Object.is(objA, objB)) {
        return true; // not render
      }

      if (
        typeof objA !== 'object' ||
        objA === null || // typeof null === 'object'
        typeof objB !== 'object' ||
        objB === null
      ) {
        return false;
      }

      // pervProps 和 nextProps 都是 object
      // props 改變：prop 數量增減
      const keysA = Object.keys(objA);
      const keysB = Object.keys(objB);
      if (keysA.length !== keysB.length) {
        return false; // re-render
      }
      
      // Test for A's keys different from B.
      // props 改變： prop 不相同
      for (let i = 0; i < keysA.length; i++) {
        if (
          // nextProps 的 key 和 prevProps 上的 key 不完全相同
          !Object.hasOwnProperty.call(objB, keysA[i]) ||
          // nextProps 上 key 的 value 和 prevProps 上 key 的 value 不相同
          !Object.is(objA[keysA[i]], objB[keysA[i]])
        ) {
          return false; // re-render
        }
      }
      
      return true; // not render
    }
    ```

## Trade-Off 在使用 memo 之前 ？

> 任何的優化都有成本，只有在 Z > B 的時候才使用 memo [4]

總得來說，我想要盡量的找到可讀性和效能兼具的模式，並且熟練的運用這些模式

### You might not need `memo` —— 透過組合的方式，將 state 和不想被 re-render 的區塊拆開[5]

每次 setText 都會讓 `<ExpensiveCalculation />` 重新渲染，為了避免不必要的 re-render，我們可以用一下兩種重組元件的方式來避免。
```tsx
const App = () => {
	const [text, setText] = useState('')
	return <>
		<input 
			value={text}
			onClick={e => setText(e.target.value)}
		/>
		<ExpensiveCalculation />
	</>
}
```

1. 將元件拆小，減少 state 的影響範圍，來避免 re-render

    ```tsx
    const App = () => {
    	return <>
    		<TextInput />
    		<ExpensiveCalculation />
    	</>
    }

    const TextInput = () => {
    	const [text, setText] = useState('')
    	return <input 
    		value={text}
    		onClick={e => setText(e.target.value)}
    	/>
    }
    ```

2. 透過 children，來避免 re-render

    ```tsx
    const App = () => {
    	return <TextInput>
    		<ExpensiveCalculation />
    	</TextInput>
    }

    const TextInput = ({ children }) => {
    	const [text, setText] = useState('')
    	return <>
    		<input 
    			value={text}
    			onClick={e => setText(e.target.value)}
    		/>
    		{children}
      </>
    }
    ```

## 既然靠重組就可以簡單解決效能問題，那有沒有什麼非用 memo 不可的情況 ？

確實單靠重組就可以解決大部分的 re-render 問題，但每多拆一個元件，就需要多一個元件命名，將元件拆的太細，額外帶來的是元件命名和程式閱讀上的負擔。

如果非使用 `memo` 不可，我會建議使用這種顯式的作法來增加可讀性

```jsx
const App = () => {
	const [text, setText] = useState('')
	const PureExpensiveCalculation = memo(ExpensiveCalculation)
	return <>
		<input 
			value={text}
			onClick={e => setText(e.target.value)}
		/>
		<PureExpensiveCalculation />
	</>
}
```

### 如何判斷要不要使用 memo？我所能考慮到的 3 個面向

如果今天這份 Code 只是一個短期的個人 Side Project，其實用或不用都不會造成太大的影響。

那我們實際在使用 `memo` 前究竟要考慮什麼呢？

`memo` 只能解決程式效能的問題，但會延伸出降低開發效率和增加溝通成本的問題，下面是我所能想到的 3 個面向

- 開發效率：
    - 加上 memo 是否會增加開發的時程？
    - 重組的過程中，是否會增加元件命名上的困難？
- 溝通（程式碼可讀性）：

    如何讓其他人或未來的自己，很快的就能得知我所使用的元件是一個 Pure Component？

- 程式效能：
    - 這部分的程式碼是否影響足夠多的使用者？
    - 使用重組元件的方式優化渲染之後，是否仍然有使用相同的 props 來重複渲染的 Component

### 如何判斷一個使用相同 `props` 的 Component 經常渲染 ？

可以使用 `Profiler API` [6] 來測量，再來決定要不要優化渲染。

## React 繼 `memo` 之後，出現了一個 `useMemo` hook，它是做什麼用的，有了 `useMemo` 之後，我們還有使用 `memo` 的必要嗎？

`useMemo` [7] 是一個很猛的 Hook！不僅可以做自己 memorize value，還可以當 `useCallback` 和 `memo` 使用，學 1 個會 3 個，3 個願望一次滿足。

memorize value:

```tsx
const computeExpensiveValue = (parameter) => {}
const memorizedValue = useMemo(() => computeExpensiveValue(argument), [argument])
```

memorize function:

```tsx
// useCallback(fn, []) = usemMemo(() => fn, [])
const memorizedFn = useMemo(() => () => state, [state])
const memorizedFn = useCallback(() => state, [state])

memorizedFn()
```

memorize component: 

```tsx
const Component = ({ prop }) => {}
----
const App = ({ state }) => {
	const element = useMemo(() => <Component prop={state} />, [state])
	return element
}
----
const PureFunctionalComponent = memo(Component)
const App = ({ state }) => <PureFunctionalComponent prop={state} />
```

從技術上來說 `useMemo` 能應用於所有 React 渲染優化的場景，但由於 hook 天生的侷限，沒辦法在渲染的時候使用，一般除非特殊理由，我們不會默認一個 Functional Component 是 Pure Component，就只是一般元件。所以如果要凸顯這部分的 Code 是做效能優化的 Code，我更傾向用 memo 處理。

```jsx
const App = ({ list }) => {
  return list.map((itemName, i) => <FunctionalComponent key={i} itemName={itemName} />)
}

const FunctionalComponent = ({ itemName }) => {
  const element = useMemo(() => <span>{itemName}</span>, [itemName])
  return element
}
```

```jsx
const App = ({ list }) => {
  return list.map((itemName, i) => <PureFunctionalComponent key={i} itemName={itemName} />)
}

const PureFunctionalComponent = memo(({ itemName }) => {
  return <span>{itemName}</span>
})
```

```jsx
const App = ({ list }) => {
  return list.map((itemName, i) => {
    const PureFunctionalComponent = memo(FunctionalComponent) // 顯式使用

    return <PureFunctionalComponent key={i} itemName={itemName} />
  })
}
```

## 結論

對 React 的 Functional Component 做渲染效能優化，不一定要使用 `memo` 來達成，也可以透過元件的重組或 `useMemo` 來達成，值得注意的是，每一種優化都會帶來相應的成本（犧牲可讀性或開發效率），先釐清需求之後再來使用，才能取得綜效。

## 感謝

天下文章一大抄，感謝巨人們的肩膀。

[1] [今晚，我想來點 Web 前端效能優化大補帖！](https://medium.com/starbugs/%E4%BB%8A%E6%99%9A-%E6%88%91%E6%83%B3%E4%BE%86%E9%BB%9E-web-%E5%89%8D%E7%AB%AF%E6%95%88%E8%83%BD%E5%84%AA%E5%8C%96%E5%A4%A7%E8%A3%9C%E5%B8%96-e1a5805c1ca2)
[2] [React.memo](https://reactjs.org/docs/react-api.html#reactmemo)
[3] [`shallowEqual.js`](https://github.com/facebook/react/blob/main/packages/shared/shallowEqual.js)
[4] [When to useMemo and useCallback](https://kentcdodds.com/blog/usememo-and-usecallback)
[5] [Before You memo()](https://overreacted.io/before-you-memo/)
[6] [Profiler API](https://reactjs.org/docs/profiler.html#gatsby-focus-wrapper)
[7] [React.useMemo](https://reactjs.org/docs/hooks-reference.html#usememo)

你有遇過什麼非使用 memo 不可的情境嗎？歡迎留言與我討論 ～
