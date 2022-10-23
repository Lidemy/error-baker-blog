---
title: 進階版 To do list
date: 2021-09-12
tags: [Front-end, JavaScript, Todo-list]
author: Xiang
layout: layouts/post.njk
image: https://blog.errorbaker.tw/img/posts/xiang/todo-03.png
---

<!-- summary -->

<!-- # 你想過自己改造出新的進階版 To do list 嗎？ -->

<!-- summary -->
<!-- more -->

## 前言

To do list 一直都是大家剛開始熟悉一項新技術時，會用來練習的主題。擁有基本的 CRUD 四大要素，讓我們對於新的工具該如何去操作資料，有最直接的體悟。

但是 To do list 真的只能用來練習這些東西而已嗎？我能不能再將功能變得更加完善呢？剛好內心曾萌生出這樣子的想法，所以想來嘗試看看，製作出新的進階版 To do list。

此篇文章只會拋出一個概念，跟提到一些規劃的思考方向，不會示範完整的程式碼，所以大家也可以把這篇作為一個練習題目，自己實作出這些進階的功能出來。

## 目標

一般我們常看到的 To do list 它是一行行的新增下去，每一項事項它可以選擇完成或未完成，或者去編輯裡面的內容，但是不同的事項之間不會有任何的關聯。

生活中有很多的代辦事項，常常是一組一組的，比如說工作代辦事項、採買代辦事項、甚至是閱讀清單、學習清單...等等，他們會有所謂類別的概念。在原有的 To do list 我們沒辦法把它歸類。

所以我想來嘗試做一個能加入群組概念的 To do list，這樣工作相關的 to do，就會在工作群組底下，採買相關的 to do 就會建立在採買的群組底下，能方便知道各個群組剩下哪些事項，也更符合日常生活中面對到的情況。

所以新的 To do list 的規格如下：

- 第一，新增 To do 時要能選擇是要 `新增一個 To do`，或者 `新增一個群組`
- 第二，每個群組我要能夠給它一個名稱
- 第三，要滿足基本的 To do list 的需求（ 要能編輯內容、選擇完成 / 未完成、刪除 to do ）

備註：此次的 To do list 主要是想實現群組的概念，所以先不把 Filter 放入功能當中，如果有想實作的朋友，也可以將這項功能給完善化。

## User flow

直接用 wireframe 來說明大家會更好明白，所以直接上圖！

- 一開始未設定 To do 時的起始頁面，可以把它當作是一個 Home page，未來優化的方向會希望這邊會依照日期來呈現每天的 To do。點選個別的日期之後可以看到當天的所有 To do list（但這個功能不列入此次的範疇），當點選了 `新增 To do ` 按鈕以後，會進到 To do list 的編輯頁
  ![](https://blog.errorbaker.tw/img/posts/xiang/todo-homepage.png)

- To do list 的編輯頁，畫面上會預設會先給一個 To do，左側會是輸入框，可以自由編輯 To do 的內容，右側會是下拉式選單，可以選取該項 To do 當天是否有完成。最右邊垃圾桶可以將該筆 To do 刪除。然後 To do 的下方會有兩個按鈕 `新增 To do` 跟 `新增群組`，顧名思義我們可以選擇要在底下加入一個新的 To do 或者加入一個新的群組
  ![](https://blog.errorbaker.tw/img/posts/xiang/todo-01.png)

- 當我們加入一個新的群組，就會看到底下的畫面，新的群組上方會有新的群組名稱，群組底下也會有一個 `新增 To do` 按鈕，讓可以在此群組底下繼續新增 To do
  ![](https://blog.errorbaker.tw/img/posts/xiang/todo-02.png)

- 群組底下的 To do 就可以一直長下去
  ![](https://blog.errorbaker.tw/img/posts/xiang/todo-03.png)

- 如果有兩個不同的群組，就可以各別在底下新增多個 To do
  ![](https://blog.errorbaker.tw/img/posts/xiang/todo-04.png)

所以這次要達成的功能，就像上面提到的那樣，有興趣直接挑戰的朋友，可以直接把它當作一份題目，自己用來練習，或者再把這些功能延伸的更完整，改造成自己的一份 side project。

從這邊開始，底下就會針對這一份需求，來做基本的資料規劃，還有實作方向的討論。

## 資料規劃

先回憶一下一般的 To do list 資料規劃方式，我們會用一個陣列包著多個 To do 物件，像下面這樣：
當新增 to do 時，就會在陣列底下多一個物件，刪除 to do 時，就會將對應的物件移除。

```js
const todos = [
  {
    id: 1,
    value: "todo01",
    isDone: false,
  },
  {
    id: 2,
    value: "todo02",
    isDone: false,
  },
];
```

但我們現在多了群組的概念，資料內容勢必會再複雜一些。
至於會需要新增哪些參數進到我們的資料結構，可以先從能想到的一個一個加進去。

最先想到的呢，就是界定好使用者要新增的會是一個 to do，還是一個群組，我們可以用一個簡單的 `isGroup` 變數來代表，

一旦我們能區分它是一個 to do 還是一個群組了，就可以來分別將群組需要的資料欄位加上去，像是群組名稱、群組 id、以及群組內容：

```js
// 一個 to do 的資料結構

{
  id: 1,
  value: "todo01",
  isDone: false,
}


// 一個群組的資料結構

{
  id: 2,
  isGroup: true,
  name: '第一個群組',
  data: []
}

```

群組底下的功能，就會跟一般 to do list 的功能一模一樣，所以群組底下的 `data` 資料格式跟一般的 to do list 相同就可以囉

```js
// 一個群組的資料結構

{
  id: 2,
  isGroup: true,
  name: '第一個群組',
  data: [
    {
      value: "todo01",
      isDone: false,
    },
    {
      value: "todo02",
      isDone: false,
    }
  ]
}

```

這邊我把 data 底下 to do 資料的 id 拿掉了，因為我覺得可以透過外面群組的 id 加上 data 的 index 來取得各個 to do，所以就算我不定義每個 to do 的 id，還是可以準確的取得我要的那筆資料。

所以一個完整的資料格式就會像下面這樣：

```js
const todos = [
  {
    id: 1,
    value: "todo-01",
    isDone: false,
  },
  {
    id: 2,
    isGroup: true,
    name: "第一個群組",
    data: [
      {
        value: "group-todo-01",
        isDone: false,
      },
      {
        value: "group-todo-02",
        isDone: false,
      },
    ],
  },
  {
    id: 3,
    isGroup: true,
    name: "第二個群組",
    data: [
      {
        value: "group-todo-03",
        isDone: false,
      },
      {
        value: "group-todo-04",
        isDone: false,
      },
    ],
  },
];
```

## 畫面渲染

資料結構出來了以後，接下來的重點就是如何把資料渲染到畫面上，以及如何達成我們要的操作功能：

渲染的動作，應該會跟一般 to do list 概念類似，遍歷整個 `todos` 陣列，利用 map 的方式回傳 HTML 的 template。
不過由於現在多了群組的資料格式，所以 HTML 的 template 也會變成兩種：

```js
// 單一個 to do
<todo
  id={id}
  value={value}
></todo>

// 單一個群組
<todo-group
  id={id}
  name={name}
  data={data}
></todo-group>
```

```js
todos.map((item) => {
  if (!item.isGroup) {
    return <todo id={item.id} value={item.value}></todo>;
  }
  return (
    <todo-group id={item.id} name={item.name} data={item.data}></todo-group>
  );
});
```

由於渲染的部分跟一般的 to do list 差異不大，就是分成兩種不同情況的 template，剩下的就是一些切版的功夫，所以容我快速帶過，直接進入操作功能的實作吧。

## 操作功能

重點操作項目如下：

- 新增 to do
- 新增群組
- 群組下新增 to do
- 刪除 to do
- 群組下刪除 to do

☞ 新增 to do 跟新增群組，雖然分成不同的按鈕，但是我們僅需要定義一個 function 來達成這兩個功能：

```js
function handleCreate(isGroup) {
  setTodos(() => {
    if (!isGroup) {
      return [
        ...todos,
        {
          id: id++,
          value: "",
          isDone: false,
        },
      ];
    }
    return [
      ...todos,
      {
        id: id++,
        isGroup: true,
        name: "",
        data: [
          {
            value: "",
            isDone: false,
          },
        ],
      },
    ];
  });
}
```

☞ 群組下新增 to do，我們需要接到群組的 id，並且更新資料：

```js
function handleCreateGroupTodo(id) {
  setTodos(() => {
    todos.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        data: [
          ...item.data,
          {
            value: "",
            isDone: false,
          },
        ],
      };
    });
  });
}
```

☞ 刪除 to do 跟群組下刪除 to do 我選擇一起寫，它會比較複雜一點，需要先判斷現在要刪除的 to do 它是不是在群組底下，如果是，需要再判斷這個群組底下的 data 是否為空，如果是的話要直接把群組刪除：

```js
function handleDelete(id, index) {
  setTodos(() => {
    // 如果刪除的不是群組下的 to do，index 為 undefined
    if (index === undefined) {
      return todos.filter((item) => item.id !== id);
    }

    // 如果刪除的是群組下的 to do，先利用 id 找到該群組，再去將底下對應 index 的 to do 移除
    return todos.map((item) => {
      if (item.id !== id) return item;
      return {
        ...item,
        data: item.data.filter((_, i) => i !== index),
      };
    });
  });
}
```

如此一來新增、刪除都有了，編輯的話直接利用 input 的方式來處理，所以可以不用特別寫一個 function。
所以 CRUD 的四項功能就都完成啦！

## 結語

這次的進階版 To do list，我個人認為非常適合在第一次學習框架的時候作為一項 `挑戰題`。它除了基本的功能以外，資料更為複雜，功能也需要考慮到更多細節，而且更趨近於工作上會遇到的情形。

工作上往往是以前開發了某項專案，未來會針對這項專案開發更複雜的功能。所以這次的練習，也可以把它當作是將原先寫好的 To do list 嘗試做一次改造，讓大家體會將自己的舊專案翻新的感覺。
