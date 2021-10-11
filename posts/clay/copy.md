---
title: 聊聊 JavaScript 中的深拷貝與淺拷貝 (上)
date: 2021-10-08
tags: [JavaScript, Shallow Copy, Deep Copy]
author: clay
layout: layouts/post.njk
---

<!-- summary -->
<!-- 一起探討深淺拷貝中的幾種概念 -->
<!-- summary -->

### 緣起

記得過去剛學習 JavaScript 的時候，最讓我感興趣的，就是在變數為物件型別的賦值上，實際是 call by reference 而不是 call by value，由於 JavaScript 是我第一個學習的程式語言，當時花了不少時間才理解這究竟是怎麼一回事。

在工作一段時間之後，仍然也能在各種不同大小的專案裡面看到物件型別拷貝的幾種用法，自己過去雖然明白這些方法各有其利弊，但一直沒有好好的做個整理與探究背後的原理，所以這一文章的上篇，就是先來看目前我們已知的深拷貝處理上，可能會存在著哪些問題。

> 基礎雖然簡單，卻也最容易藏有陷阱，因此將過程記錄下來，無非是一個最好的方式。

### 基礎

最基本的問題，就是假設我們有一個物件 `obj`，我們現在希望能有另外一個與 `obj` 一模ㄧ樣的 `copyObj`，我們能怎麼做？

```js
const obj = {
  name: 'Clay'
}

const copyObj = obj
```

你知道這樣做是有問題的，因為當我接著修改 `copyObj` 時，`obj` 也會被修改：

```js
const obj = {
  name: 'Clay'
}

const copyObj = obj

copyObj.age = 18

console.log(obj) // { name: 'Clay', age: 18 }
```
聰明的你這時候會想到一個還不錯的方法，就是利用 ES6 的展開運算子幫我們做處理：

```js
const obj = {
  name: 'Clay'
}

const copyObj = { ...obj }

copyObj.age = 18

console.log(obj) // { name: 'Clay' }
```
簡單形容一下上面的做法，上述的做法是給予 `copyObj` 一個新的物件，所以 `copyObj` 會指向一個新的記憶體位置，與 `obj` 不同。展開運算子幫我們將 `obj` 的 key/value 放到 `copyObj` 裏面，所以 `obj` 的記憶體位置與 `copyObj` 的記憶體位置毫不相關，修改上彼此也不會互相影響。

同樣的概念放在 Array 中來實作，也是一樣的結果：

- A 方法
  ```js
  const arr = [1,2,3]

  const copyArr = arr

  copyArr.push(4)

  console.log(arr) // [1, 2, 3, 4]
  ```

- B 方法
  ```js
  const arr = [1,2,3]

  const copyArr = [...arr]

  copyArr.push(4)

  console.log(arr) // [1, 2, 3]
  ```
> 上述的 A 方法，由於 copy 時還是有 copied by reference，所以這樣的行為我們將其稱之為**淺拷貝 (Shallow Copy)**

> 而 B 方法所複製的物件型別 (`copyObj` 或 `copyArr`)，由於已經與原本的 `obj`或 `arr` 沒有共同參考的記憶體位置，此種完整的拷貝，我們稱之為**深拷貝 (Deep Copy)**

但要達成深拷貝，不是只有使用展開運算子才可以做到。事實上，還是有展開運算子無法處理的深拷貝需求，我們可以接著來看。

> 我這裡沒有另外提到 `Object.assign()` 這個方法，因為在這個範例中，它與展開運算子達到的效果會是一樣的 (可能也更適合)，所以就沒有另外做舉例了，讀者可以自己尋找最適合自己的方式。

### 超過一層以上的物件

一樣，我們現在來舉別的例子，我有一個 `obj`，這次的它是一個兩層的物件，我們來看對其使用展開運算子來做深拷貝，會發生什麼樣的事：

```js
const obj = {
  old: {
    name: 'Clay',
    age: 30
  },
  young: {
    name: 'Xen',
    age: 18
  }
}

const copyObj = { ...obj }

copyObj.young.age = 21

console.log(obj) // { old: { name: 'Clay', age: 30 }, young: { name: 'Xen', age: 21 } }
```

我們使用展開運算子方式，期許可以達到與前面一樣的成果，然而，當我修改 `copyObj.young.age` 的內容時，`obj.young.age` 也被修改了。

但有個狀況很有趣，如果你修改的是 `copyObj.young`，`obj.young` 則不會受到影響：

```js
const obj = {
  old: {
    name: 'Clay',
    age: 30
  },
  young: {
    name: 'Xen',
    age: 18
  }
}

const copyObj = { ...obj }

copyObj.young = 123456

console.log(obj) // { old: { name: 'Clay', age: 30 }, young: { name: 'Xen', age: 18 } }
console.log(obj === copyObj) // false
console.log(obj.young === copyObj.young) // false
console.log(obj.young.age === copyObj.young.age) // true
```

即使我們都知道 ES6 的展開運算子無法處理一層以上的深拷貝，但上述的狀況才是讓我覺得最危險的，因為假設我不知道 `copyObj` 是怎麼來的，當我修改 `copyObj.young` 時，我都還可能會以為它是一個被**深拷貝**的物件，但實際上，它仍應算是**淺拷貝**，而直到你找到是哪一層原來是 copied by reference 之前，你很可能都不會知道這件事 (或者你去追源頭，看它是怎麼被拷貝的)。

不過，在大部分情況下，因為淺拷貝所產生出來的 Bug 可能都早過你發現之前先發生，這不是我們所希望的狀況。

## 用 `JSON.parse(JSON.stringify(obj))` 來做深拷貝 ?

`JSON.stringify()` 可以幫我們把物件或是陣列做[序列化處理](https://zh.wikipedia.org/wiki/%E5%BA%8F%E5%88%97%E5%8C%96)，`JSON.parse()` 則可以幫我們做到反序列化。

使用 `JSON.parse(JSON.stringify(obj))` 的組合技，先將物件型別轉為字串，再將字串轉為物件，就可以實現深拷貝：

```js
const obj = {
  old: {
    member : {
      name: 'Clay',
      age: 30
    }
  }
}

const copyObj = JSON.parse(JSON.stringify(obj))

copyObj.old.member.name = 123456

console.log(obj) // { old: { member: { name: 'Clay', age: 30 } } }
console.log(obj === copyObj) // false
console.log(obj.young === copyObj.young) // false
console.log(obj.old.member.name === copyObj.old.member.name) // false
```

但這樣做還是會有問題，而且問題還不小，原因是因為當你物件中有 `function`，`NaN`，或是 `new Date()` 等類型的值時，會無法按照原樣進行拷貝，不論資料結構的深淺都一樣:

```js
const obj = {
  num: 123,
  func: function() { console.log('hello ~') }
}

const copyObj = JSON.parse(JSON.stringify(obj))

console.log(copyObj) // { bar: 123 }
copyObj.func() // copyObj.func is not a function
```

如上案例，`copyObj` 並沒有拷貝到 `obj.func`，實際上，`JSON.stringify(obj)` 執行之後的結果就已經是 `{"num":123}` 了，看不到 `func` 的蹤影。

這與 `JSON.stringify()` 的特性有關，對於無法序列化的值，比如說 `Date`，`undefined` 或是 `Function` 等，會在序列化時被忽略或是轉為 `null`，或是在經由 `JSON.parse()` 轉換時無法呈現原本的形式。

> 整理 `JSON.parse(JSON.stringify())` 時會遇到狀況的幾種類型：
1. `undefined`
2. `null`
3. `Function`
4. `Date`
5. `RegExp`
6. `Symbol`
7. `Error`
8. `NaN`
9. `Infinity`
10. `-Infinity`

因為上述的特性，所以當我們使用 `JSON.parse(JSON.stringify())` 來做深拷貝時，就會多出一些無法掌控，或是你必須先行了解的風險，但 `JSON.parse(JSON.stringify())` 所帶來的問題，可能不止於此。

最近有不少文章在探討 `JSON.parse(JSON.stringify())` 帶來的效能問題，它在處理龐大或深層的資料時，運行速度並不是這麼理想，當我們在一個專案中大量的使用這樣的深拷貝方式，可能會產生一些潛在的效能問題，詳情可以參考[This one line of Javascript made FT.com 10 times slower](https://medium.com/ft-product-technology/this-one-line-of-javascript-made-ft-com-10-times-slower-5afb02bfd93f) 這篇文章，內中鉅細靡遺地描述了他們所遇到的問題，從發現，測試，到找出原因是由於專案中大量使用 `JSON.parse(JSON.stringify())` 造成的效能拖累，非常值得一看。

`JSON.parse(JSON.stringify())` 還有一個問題，由於 `JSON.parse()` 中的對象單純是一個字串，對 `JSON.parse()` 來說，他不會知道內中 `JSON.stringify(obj)` 的前世是什麼樣子，所以如果 `obj` 本身有一些的內容有一些引用，那麼由 `JSON.parse()` 反序列化所產生的物件則完全不會知道這件事。

舉個例子，在 `arr = [obj, obj]` 的狀況下，兩個 `obj` 都是同一個記憶體位置，但是經由深拷貝之後就完全不是這麼回事：

```js
const obj = {
  a: 1
}

const arr = [obj, obj]

const copyArr = JSON.parse(JSON.stringify(arr))

console.log(arr[0] === arr[1]) // true
console.log(copyArr[0] === copyArr[1]) // false
```

`copyArr[0] === copyArr[1]` 為 `false`，這是因為 `JSON.parse()` 在轉換的過程中只看得見字串，這是一個很重要的原因使我們**不能**一看到 `JSON.parse(JSON.stringify())` 就去將其與深拷貝掛在一起做聯想，因為原本的引用關係並沒有連帶被拷貝過來。

只要拆分 `JSON.stringify(obj)` 與 `JSON.parse()` 的執行步驟，就可以發現不少深拷貝相關的問題，以我自己來說，也不建議使用 `JSON.parse(JSON.stringify(obj))` 來做深拷貝，除非我可以很確保我可以預見所有的 side effect。

> 補充：關於 `JSON.stringify()` 的效能優化，現行也有一些相關的開源套件來做取代，比如說 [fast-json-stringify](https://github.com/fastify/fast-json-stringify) 或是 [slow-json-stringify](https://github.com/lucagez/slow-json-stringify)，未來有機會的話也來研究這一塊。

## 回顧與後續

上述遇到 `JSON.parse(JSON.stringify())` 的相關問題，比如說物件型別中有 `undefined`，`new RegExp` 或是 `new Date()` 時的拷貝錯誤，如果使用展開運算子或是 `Object.assign()` 來處理，就可以順利解決，仔細想想真的滿有趣的，有種魚與熊掌難以兼得的感覺，這也讓人不太意外，畢竟 JavaScript 在處理拷貝的這件事情上面，天生就不屬於一件直覺且直接的事情。

在實務上，如果是比較小的專案，當物件或是陣列等資料結構較單純時，我會使用展開運算子或是 `Object.assign()` 來實現
一層的深拷貝，但大多數狀況下我覺得最保險的是使用 `lodash` 的 [`cloneDeep`](https://lodash.com/docs/#cloneDeep)，儘管在效能上可能沒有原生方法來得好 (可以參考這篇 StackOverflow 上的這篇[討論](https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object/61523278#61523278))，但的確是相對保險與經得起驗證的做法。

這篇文章其實可以延伸討論的點滿多的，包括如果我們知道上述的深拷貝部分都有自己的問題，那該如何做最好 (儘管我們知道可以使用 lodash 的 cloneDeep，但它是如何做到的？)，如果自己實現深拷貝，我們應該要注意什麼部分 (原型鏈與 `hasOwnProperty` 的使用)，以及如果 `JSON.stringify()` 的序列化效能若不盡理想，那又是為什麼？

這也是我想把這篇文章拆成上下兩個篇章的原因，先闡述可能遇到的問題，再往我們可以怎麼去解決它，並從中學習到什麼內容的方向邁進。

感謝您的閱讀，如有描述錯誤，請不吝指教。

## 參考資料

- [How do I correctly clone a JavaScript object?](https://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object/61523278#61523278)
- [如何提升JSON.stringify()的性能？](https://segmentfault.com/a/1190000019400854)
- [你不知道的JSON.parse()和JSON.stringify()](https://zhuanlan.zhihu.com/p/67374716)

