---
title: 現代前端開發 - 那些我使用過的 Pattern 和 工具
date: 2021-10-04
tags: [typescript, react, react-hook-form, pattern, Todo-list, Front-end]
author: tian
layout: layouts/post.njk
---

<!-- summary -->

以 React Hook Form + TS 完成一個 Nested Todo List 來舉例

<!-- summary -->
<!-- more -->

不多說先看結果 [Nested Todo List - GitHub Pages](https://futianshen.github.io/nested-todo-list/)
如果說你比較習慣看 Code，可以看這裡 [Source Code](https://github.com/futianshen/nested-todo-list)

## 誰可能比較適合閱讀這篇文章？

- 使用 React v16.6+ 的開發者
- 想看看我是如何學習一個自己從來沒碰過的工具
- 想嘗試使用 React + TS 開發前端
- 想知道基本的 React Hook Form 如何使用？
- 想了解一個 React 專案中有那些常用的 Pattern，以及使用這些 Pattern 背後的原因

如果你不是上述對象，也沒有上述問題，你可以考慮改去讀讀其他夥伴們的 [優秀作品](https://blog.errorbaker.tw/) ～

## 契機

最近工作需要將專案中的表單 Migrate 到 [React Hook Form](https://react-hook-form.com/)，原來是想要看懂它的 [Source Code](https://github.com/react-hook-form/react-hook-form/tree/master/src) 是怎麼實作，來寫一篇分享文，但因為看不懂（明明都是最熟悉的 React + TS 但我就是看不懂），加上拖延症爆發，於是去看了隔壁的 [Xiang 寫的這篇《進階版 To do list》](https://blog.errorbaker.tw/posts/xiang/advanced-todo-list/)，警覺自己還沒學會走就想飛，連 React Hook Form 都還沒學會使用，竟然就妄想看懂 Source Code（？，於是便想用 React Hook Form 加上原來就已經在使用的 React + TS，做做看這個 Side Project，順便熟悉一下 React Hook Form 的使用，於是就有了這篇文章。

## 從 User Story 開始

- 我希望有一個 Todo List 可以紀錄我日常生活中所有需要做的事
- 我希望這個 Todo List 的每一個 Todo 項目都可增、改、勾、刪，這樣我就可以調配我手上要做的事情。
- 我希望每一個 Todo 項目下面，還可以再新增額外的多個子項目，這樣我就可以將一個大項目，拆成更細的幾個步驟。
- 我希望當我勾選 Todo 的時候，每個子 Todo，也會一起被勾選，代表我完成了這整個大項裡面的所有細項。
- 我希望當子 Todo 有任何一個沒有被勾選的時候，上層的 Todo 也要取消勾選，這樣我才知道這個大項還沒有完成。
- 我希望這個 Todo List 能夠被儲存和匯入，這樣我每次進入這個頁面的時候，都能取得這個 Todo List 的資料。
- 我可以一次性的清空所有 Todo，這樣我拖延症爆發的時候，才可以一次忘記所有要做的事情，讓真正重要的事情自己來找我。

成品 [Nested Todo List](https://futianshen.github.io/nested-todo-list/)

## 我是如何開始學習 React Hook Form 的？

雖然已經先用 React + TS 試著實作過 [Nested Todo List](https://github.com/futianshen/ts-react-functional-component-nested-todo-list)
但用的都是 React 內建的 useState，並不熟悉 React Hook Form 的 API，於是我先掃描了 [官方文件的 API](https://react-hook-form.com/api)，然後看了一下 [官方的 Example](https://github.com/react-hook-form/react-hook-form/tree/master/examples)，知道 Nested List 是可以做到的（知道一個東西已經做的到，比不確定做不做的到，在實作上的把握和信心程度會差很多），再知道可以用 useForm 和 useFieldArray 這 2 個 Custom Hook 來做之後，就開始邊看 Example 和 API 文件邊實作邊整理自己的程式碼。

大致的步驟是

1. 完成功能
2. 反覆優化（抽象、樣式）
3. 改完收工

有興趣可以看看我那些笨拙可愛的過程[1]

## 從這個 Over Engineering 的專案，看常見的 React Pattern 和工具使用

以我對前端工程認知，其實就是在開發的過程，不斷的將重複的部分不斷抽象、再組合.不同組合和抽象方式，解決的是不同場景下的問題，值得注意的是，每一次的抽象都會帶來認知上的負擔，良好的架構、Pattern 和命名會讓我們對功能產生正確的預期，這也是他們之所以重要的原因。

從一個專案中，會持續重組大致就是這幾大類

- Type (如果你使用的是 TypeScript)
- Component (Functional Component)
- Logic (React Hook)
- Style (CSS in JS / Utility-First CSS)

對應到整個專案的結構就會是

- `/src`
  - `/types`
  - `/components`
  - `/hooks`
  - `/style.tsx`

### Type 的組合

#### 自定義 Type

```ts
type FormValues = {
  nestedList: {
    value: string;
    isDone: boolean;
    list?: {
      value: string;
      isDone: boolean;
    }[];
  };
};
```

```ts
type FormValues = {
  nestedList: NestedList;
};

type NestedList = (Todo & {
  list?: List;
})[];

type List = Todo[];

type Todo = {
  value: string;
  isDone: boolean;
};
```

```ts
const initialList: NestedList = [
  {
    value: "todo group 2",
    isDone: true,
  },
  {
    value: "todo group 1",
    isDone: false,
    list: [
      {
        value: "group todo 2",
        isDone: false,
      },
      {
        value: "group todo 1",
        isDone: true,
      },
    ],
  },
];
```

#### Library 定義的 Type

```tsx
import React, { ReactElement, FC } from "react"; // from library type definition

const TodoForm: (props: {children: ReactElement}) => ReactElement = () => <form />
const TodoList: React.FC = ({children}) => <ol>{children}</ol>
const Todo: FC = ({children}) => <li>{children}</li>

<TodoForm>
  <TodoList>
    <Todo/>
    <Todo/>
    <Todo/>
    <Todo/>
  </TodoList>
</TodoForm>
```

#### 綜合使用

```tsx
// library type definition
import { FC, ReactElement, ChangeEventHandler } from "react";
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

// self type definition
import { NestedList } from "../types/todo";

const TodoForm: FC = function () {
  const {} = useForm<{ nestedList: NestedList }>();

  return <form />;
};

const Todo: (props: {
  onRegister: (name: "isDone" | "value") => UseFormRegisterReturn;
  children?: ReactElement;
}) => ReactElement = function ({ onRegister, children }) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onRegister?.("isDone").onChange(e);
    onCheck?.();
  };

  return (
    <li>
      <StyledCheckbox onChange={handleChange} />
      <StyledTextInput />
      {children}
    </li>
  );
};
```

### Component 的組合與複用

#### Composition Component

```tsx
const TodoList: FC = function ({ children }) {
  return <ol>{children}</ol>;
};

const Todo: FC & { TodoList: typeof TodoList } = function () {
  return <li>{children}</li>;
};

Todo.TodoList = TodoList;
```

```tsx
<TodoList>
  <Todo>
    <Todo.TodoList>
      <Todo>
    <Todo.TodoList>
  </Todo>
</TodoList>
```

```html
<ol>
  <li>
    <ol>
      <li></li>
    </ol>
  </li>
</ol>
```

#### Props

- value
  ```tsx
  <TodoList name="nestedList" />
  ```
- callback（`onVerb`)

  ```tsx
  <Todo
    onRegister={(name) => name}
    onCheck={() => {}}
    onRemove={() => {}}
  >
  ```

- children

  ```tsx
  <Todo>
    <Todo.TodoList />
  </Todo>
  ```

- render props (`renderNoun`)
  ```tsx
  <TodoList
    renderAddButton={(prepend) => (
      <Button
        onClick={() => {
          prepend({
            value: "",
            isDone: false,
          });
        }}
      />
    )}
  />
  ```

### Style 的組合與複用

#### Utility First CSS (for layout)

> Tailwind, Bootstrap, [etc](https://github.com/search?q=utility+first+css)

```css
@tailwind base;
@tailwind utilities;
```

```tsx
<div className="flex items-center gap-3 mb-3">
  <input type="checkbox" />
  <input type="text" />
  <button />
</div>
```

#### CSS in JS (for customize)

> Styled Component, Emotion, Linaria, [etc](https://github.com/topics/css-in-js).

```tsx
import { Button } from "@geist-ui/react"; // any ui library
import styled from "styled-components"; // any css in js solution

const StyledAddButton = styled(Button)`
  &&& {
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    padding: 0;
    width: 33px;
    height: 33px;
  }
`;
```

```tsx
import styled, { css } from "styled-components";

const ContainerMixin = css`
  margin: 0 auto;
  width: 500px;
`;

const StyledSection = styled.section`
  ${ContainerMixin}
`;
```

### Logic 的複用（React Hooks)

在這個專案中沒有直接用到任何 React 的 Hook（useState, useEffect, useRef...），因為這些 Hook 都藏在 React Hook Form 提供給我們 Custom Hook 裡面，我們可以直接使用，這些 Hook 提供給我們重複出現於表單處理的邏輯做開發。

```tsx
import { useForm, useFieldArray } from "react-hook-form"; // any react hook library or custom hook

const { control, register, getValues, setValue, handleSubmit } = useForm(); // 經常用於表單資料獲取和提交
const { fields, prepend, remove } = useFieldArray({ name, control }); // 經常用於動態新增表單項目
```

### MISC

#### Module

- Before

  `/todo/TodoList.tsx`

  ```tsx
  export default TodoList;
  ```

  `/todo/Todo.tsx`

  ```tsx
  export default Todo;
  ```

  ```tsx
  import Todo from "../components/todo/Todo";
  import TodoList from "../components/todo/TodoList";
  ```

- After

  `/todo/index.tsx`

  ```tsx
  export { default as TodoList } from "../todo/TodoList";
  export { default as Todo } from "../todo/Todo";
  ```

  ```tsx
  import { Todo, TodoList } from "../components/todo";
  ```

## 未來展望

> 那些我還做不到、還沒做、也許未來也不會做的事

- 搜尋功能
- 標籤功能
- 拖拉 Todo 項目功能
- 完成/未完成篩選器
- 清空所有完成的 Todo 項目
- 看懂 React Hook Form
- 更新這篇文章，詳細描述各種 Pattern 的使用場景和理由。

## 感謝

天下文章一大抄，感謝巨人們的肩膀。

### 參考資料

- [進階版 To do list](https://blog.errorbaker.tw/posts/xiang/advanced-todo-list/)
- [React Hook Form Example](https://github.com/react-hook-form/react-hook-form/tree/master/examples)
- [React Hook Form Example - useFieldArray](https://codesandbox.io/s/react-hook-form-usefieldarray-nested-arrays-m8w6j)
- [React Hook Form Api Document](https://react-hook-form.com/api/useform/)
- [Template Literal Types](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-1.html#template-literal-types)
- [Tailwind](https://tailwindcss.com/)
- [Geist UI](https://react.geist-ui.dev/en-us)
- [Styled Component](https://styled-components.com/)
- [Export and Import](https://javascript.info/import-export#re-export)
- [Create React App](https://create-react-app.dev/docs/adding-typescript/)
- [Vite](https://vitejs.dev/guide/#scaffolding-your-first-vite-project)

### 推薦閱讀

[《我是如何開始做不會的事》](https://kimtoday.medium.com/%E6%88%91%E6%98%AF%E5%A6%82%E4%BD%95%E9%96%8B%E5%A7%8B%E5%81%9A-%E4%B8%8D%E6%9C%83-%E7%9A%84%E4%BA%8B-8fe1c92cbe65)

## 備註

[1]紀錄那些我笨拙的時刻
完成功能 https://github.com/futianshen/react-hook-form
不斷優化 https://github.com/futianshen/ts-react-hook-form-nested-todo-list
改完收工 https://github.com/futianshen/nested-todo-list

你有任何處理複雜表單，或學習新工具、新知識的經驗嗎？希望你能留言與我分享～
