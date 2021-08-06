---
title: 用 Web Component 製作客製化表格元件
date: 2021-08-15
tags: [Front-end, JavaScript]
author: Xiang
layout: layouts/post.njk
image: https://static.coderbridge.com/img/posts/xiang/wc-table.png
---

<!-- summary -->

## 前言

目前團隊在規劃建立一個元件庫，希望未來能在各個專案上快速套用自己所寫的元件。由於各項專案使用的框架可能有所不同，所以元件庫必須支援不同框架的使用情境。例如說 VueFormGenerator 當中的 custom field 是可以自由客製化表單中的元件，我們就能引用這個元件庫的元件，將其使用於 Vue 的表單之中。

大部分元件在實作上沒有太大的困難，像是按鈕這個元件就很單純，開幾個欄位提供使用者改改顏色或改改樣式基本上就沒太大問題了。
不過有幾項元件就不是那麼好實作了，例如本篇文章想要探討的 table 這個元件，它不光是改樣式這麼簡單而已，像是每個欄位需要如何抓取資料，各自的行為是什麼？還有表格所衍生出來的各項功能如何去實作？以及如何讓使用者自由客製化...等等。這些都需要提前設計好，才不會在使用的時候感到不方便。

以往在 HTML 使用到 table 這個標籤時，每個頁面的表格都會是分開來做的，A 頁面的表格直接寫在 A 頁面的檔案底下，B 頁面的表格也直接寫在 B 頁面的檔案底下，所以每個頁面的表格需要幾個 column 都可以分別定義好的，有幾個功能也可以分別放上去。

但是現在要達成的目標變成是，做出一個 table 元件，不管是 A 頁面還是 B 頁面，都可以直接使用這個元件，這也是第一次研究如何可以做出讓不同頁面一起使用的 table 元件。

由於這邊的 table 元件是透過 Web Component 來實作的，所以上半部的篇幅會先提到關於 Web Component 最簡單的概念（已經了解的大大們可以跳過這部分），下半部才會是分享 table 元件的實作。

<!-- summary -->
<!-- more -->

## 目標

第一，要能讓使用者在使用當下，透過設定的方式來帶入它需要幾個 column，且分別需要顯示什麼資料。

第二，要能讓使用者自由定義要綁上去的功能有哪些

## 初探 Web Component

考量到希望引入元件是獨立的，不會與專案當中其他的程式碼相互干擾而發生悲劇，所以參考了利用 web component 的方法來實作元件。它可以讓我們自定義元件，包含 HTML 結構、CSS 樣式、JavaScript，並且取一個自己喜歡的標籤名稱（例如：`<wc-table></wc-table`），插入到頁面上就能得到一個封裝好的組件。

由於 Web Component 是利用 Browser 原生支援的 Custom Elements 來渲染共用元件的，所以能共用在任何前端框架上，非常符合我們對於元件庫的需求。它的概念其實跟 React 的 class component 有幾分類似，都能讓我們自定義一個元件的架構跟樣式，並使用在其他地方，只是它還有一些需要另外去熟悉的特性，例如 shadow DOM 的概念。

shadow DOM 允許我們創建一些完全獨立於其他元素的 sub-DOM trees，什麼意思呢？有點像我們組裝模型一樣，有一個可以組裝用的接口，讓我們裝上別的手臂或武器之類的，而且裝上去的部位跟模型本身不會相互影響。

可以參考下圖：我們可以利用 shadow-host 這個節點，裝上一個 shadow-tree

![](https://static.coderbridge.com/img/posts/xiang/shadow-tree.png)

(圖片來源： https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM)

Shadow DOM 的操作方式跟一般我們常操作的 DOM 是相同的，可以新增屬性、增加 child node...等等，但是我們沒辦法直接透過外部來修改 Shadow DOM 底下的元件。

比如說下面這個 HTML 的架構:

```html
<div class=".wrapper">
  <wc-element>
    #shadow-root
    <!---->
    <button class="wc-btn">...</button>
    <!---->
  </wc-element>
</div>
```

如果我們想要透過外部的 `.wrapper` 來調整底下 `.wc-btn` 的顏色是無法調整的：

```css
.wrapper .wc-btn {
  color: red;
}
```

相反的 Shadow DOM 内部的元素也不會影響到外部。

由於這個特性，使得我們可以封裝一個具有獨立功能的 `<wc-table>` 元件，並且可以保證不會引用到專案的同時影響到其它 DOM 元素。shadow DOM 和標準的 DOM 一樣，可以設置它的樣式，也可以用 JavaScript 操作它的行為。DOM 和 shadow DOM 創建的獨立組件之間的互不干擾，有利於組件在各個專案的復用。

## 初探 Slot

上面提到了可以透過 Web component 來封裝組件，提供別的專案來使用，不過還有一個問題是，我只是提供一個固定樣式的組件，這樣使用者怎麼客製化？總得要讓使用者可以做一些調整，不然每次要調整都要回去 Web Component 調，這樣也不是很好。

**第一個辦法：開一些 attribute 的欄位讓使用者帶入**

```html
<wc-button btn-color="primary" hidden="true"> 按鈕 </wc-button>
```

我們只要在 Web Component 預先定義好去接收這個 attribute，並且決定當使用者帶入的 btn-color 為某些值的時候，要做出什麼樣的反應，就可以讓使用者去挑選自己想要的顏色。

```js
get color() {
  return this.getAttribute('btn-color');
}
```

不過這樣有一個困擾，就是使用者一定只能使用我開好的欄位，且只能局限於我所提供的設定。重點是使用者沒辦法自由的客製化底下的標籤。比如說我的按鈕需要加上 icon

```html
<wc-button>
  <i class="pen"></i>
  按鈕
</wc-button>
```

像上面需要加上客製化的標籤 `<i class="pen"></i>`，這就沒辦法透過 attribute 的欄位來設定了，於是我們可以透過第二種辦法。

**第二個辦法： Slot**
Slot 可以想像為 Web Component 的 placeholder，當外部想要傳 Value 或者 HTML 的標籤進來時，可以透過 Slot 來達成：

先在 Web Component 底下定義好 slot 跟它的 name

```html
<!-- 我們定義的 Web Component -->
<div>
  <slot name="avatar"><slot>
</div>
```

使用者可以將資料或標籤帶入，使用時透過一個 slot 的 attribute 傳入上面要對應的 name

```html
<!-- 使用者在引入使用元件的時候 -->
<user-data>
  <span slot="avatar">Value</span>
</user-data>
```

瀏覽器會將我們的標籤根據對應到的 name 把它置入於 template 之中

```html
<!-- 瀏覽器最終渲染出來的樣子 -->
<div>
  <slot name="avatar">
    <span slot="avatar">Value</span>
  <slot>
</div>
```

如此一來，除了可以傳入想要的顏色或 attribute 之外，如果需要客製化標籤，也可以達成了。
下一步要開始來設計我們要製作的元件 table。

## 自訂 table

製作 table 元件以前最重要的就是先把資料給定義清楚，資料確定了以後，後面就只差如何去顯示而已。
因為表格會是有很多組資料組合而成的，所以我們可以想像資料會長的像下面這個樣子

```js
const tableData = [
  {
    id: 1,
    value: "第一筆資料",
  },
  {
    id: 2,
    value: "第二筆資料",
  },
  {
    id: 3,
    value: "第三筆資料",
  },
];
```

由於表格資料它不含有 HTML 的標籤，所以我們可以想像讓使用者直接利用 attribute 的方式來傳入 Web Component

```html
<wc-table data="{tableData}"></wc-table>
```

接下來就要來思考如何去讓使用者定義 column 要對應到哪些資料

## 自訂 column

在討論 Web Component 當中的 column 要怎麼實做之前，我們先來決定要怎麼讓使用者來傳入 column，可能有幾種方式：

**☞ 第一種方法：由 table 定義好規格，使用者透過 attribute 傳入設定值**
只要在我們的 `<wc-table>` 先定義好 table 的規格，再給使用者自己傳入相關的設定，使用上可能會像下面這個樣子：

- data：是整個表個的資料
- columnCount：是表格會有幾個 column
- config：可以傳入每個 column 要抓哪筆資料，或者其他設定

```html
<wc-table data="{tableData}" columnCount="{n}" config="{fitData}"></wc-table>
```

這個方法的好處是，我很好管控規格，使用者只能完全按照規格來走，
缺點也很明顯，使用上很不直觀，也缺少客製化的空間。

**☞ 第二種方法：直接讓使用者帶入標籤**
我們直接透過傳入 slot 的方式，讓使用者在使用時直接塞入所有標籤，使用上會像下面這個樣子：

```html
<wc-table data="{tableData}">
  <thead>
    <tr>
      ...
    </tr>
  </thead>
  <tbody>
    <tr>
      ...
    </tr>
    <tr>
      ...
    </tr>
  </tbody>
</wc-table>
```

使用者直接在 `<wc-table>` 底下傳入它想要客製化的所有標籤進來，web component 再把整個 slot 渲染出來。優點是具備非常強大的客製化空間，缺點是完全沒辦法控制使用者傳入什麼進來，也沒辦法去把規格給定義出來。而且這樣子的寫法跟直接使用一般的 `<table>` 實在差不了多少，缺少了把它模組化的價值。

上述兩種方式其實都可以達成我們想要的目的，但是有沒有能夠擷取各自優點得折衷方法，既能夠有一定的客製化空間，又能夠限制住規格呢？
我們能不能再定義出一個特殊的元件，它不是用來渲染的，而是用來讓使用者帶入資料？然後再去辨別這個元件並且把它的資料擷取出來？既然不想要使用者傳入這麼繁雜的 HTML 標籤，那就定義一種規格的標籤讓使用者使用吧！

**☞ 第三種方法：定義新的標籤來使用**
我們來自定義出一個新的標籤 `<wc-table-column>`，它是用來讓使用者設定 column 用的，使用上會像下面這個樣子

- path：每個 column 個別要抓取的資料
- headName：每個 column 標題的資料

```html
<!-- 使用者在引入使用元件的時候 -->
<wc-table data="{tableData}">
  <wc-table-column path="{id}" headName="{name}">
  <wc-table-column path="{value}" headName="{name}">
</wc-table>
```

然後我們在 Web Component 底下特別去把 slot 當中的 `<wc-table-column>` 挑選出來：

```js
// Web Component 擷取元件的時候
function findColumnNodes(slot) {
  const nodes = [];
  for (const element of slot.assignedNodes({ flatten: true })) {
    if (element.matches(element, "wc-table-column")) {
      nodes.push(element);
    }
  }
  return nodes;
}
```

我們將 slot 底下的 `<wc-table-column>` 整理成一個新的陣列 nodes，這樣一來我們就會有一組 column 的資料，印出來看的話它會是兩個 HTMLElement

![](https://static.coderbridge.com/img/posts/xiang/console-wc-table-column.png)

到目前為止，Web Component 有 tableData 的資料，以及使用者 column 的設定，我們只要把它們拼接起來，就可以繪製出我們所想要的表格出來了。

```js
// Web Component 繪製 HTML 的時候
const tableHTML = `
  <table>
    <thead>
      ${this.nodes.map(
        ({ headerName }) =>
          `
            <th>
              ${headerName}
            </th>
          `
      )}
    </thead>
    <tbody>
      ${this.tableData.map(
        (item, i) => `
          <tr>
            ${this.nodes.map(
              ({ path }) =>
                `
                  <td>
                    ${getDataFromPath(item, path)}
                  </td>
                `
            )}
          </tr>
        `
      )}      
    </tbody>
  </table>
`;
```

最後將這組 HTML render 出來，就完成了 table 的繪製了，第三個方法既達到讓使用者客製化 column 的內容，同時也管控到元件該有的規格。最後剩下的就是 action 的客製化。

## 自訂 action

先提一下 action 是什麼，我這邊指的 action 代表提供給使用者，可以對每個 row 進行哪些操作，比如說：想要複製、刪除 row，或者想要點開來閱讀詳細資料。這些都是對於 row 操作的行為。

由於這些行為在不同的頁面的表格會有所不同，所以一定也是需要客製化的。比如說 A 頁面需要有編輯跟刪除功能，Ｂ頁面可能需要有複製、切換狀態、分享...等等更多功能。也就是說，action 該怎麼設定，是需要讓使用者自行選擇的。

想到這邊會發現，其實實作的方式可以利用跟 column 類似的方法，我們可以一樣可以建立一個特別的元件 `<wc-table-action>`，並且一樣透過 slot 擷取傳進來的 action，並整理成一個陣列。

不過有一個地方需要注意到的是，操作的按鈕也是要讓使用者客製化的，比如說 A 頁面的編輯按鈕用的是「編輯」這個文字，但 Ｂ頁面的編輯按鈕要用像鉛筆一樣的 icon 來表示，所以需要在 `<wc-table-action>` 底下去接使用者傳進來的 slot，才能讓使用者去客製化這個按鈕的樣式：

- action：傳入一個 callback function 當這個 action 觸發時要發生什麼行為
- slot：傳入這個 action 想要客製化的樣式（HTML 標籤）

```html
<!-- 使用者在引入使用元件的時候 -->
<wc-table data="{tableData}">
  <wc-table-column path="{id}" headName="{name}">
  <wc-table-column path="{value}" headName="{name}">
  <wc-table-action action="handleUpdate()">
    <i class="pen">編輯</i>
  </wc-table-action>
  <wc-table-action action="handleDelete()">
    <i class="trash-can">刪除</i>
  </wc-table-action>
</wc-table>
```

由於 `<wc-table-action>` 底下的內容，我們是沒有要讓他渲染的，所以整個 `<wc-table-action>` 元件要設定 `display: none;` 來讓它不會顯示，我們要做的是擷取這些內容，把它們組裝起來之後，動態產生在對應的位置。
所以我們先在 table 底下挖好一個位置，最後組合起來的 actions 標籤就會把它放在這裡：

```js
// Web Component 繪製 HTML 的時候
const tableHTML = `
  <table>
    <thead>...</thead>
    <tbody>
      ${this.tableData.map(
        (item, i) => `
          <tr>
            ${
              this.actionNodes
                ? `
                <td class="tooltip">
                  ${this.setActions()}
                </td>
              `
                : null
            }
          </tr>
        `
      )}
    </tbody>
  </table>
`;
```

這邊的 `setActions()` 是待會才要定義的 function，我們要利用它來回傳組合好的 HTML 標籤。
我們先在 Web Component 利用相同的方式來擷取 slot 底下的 `<wc-table-action>`

```js
// Web Component 擷取元件的時候
function findColumnNodes(slot) {
  const actionNodes = [];
  for (const element of slot.assignedNodes({ flatten: true })) {
    if (element.matches(element, "wc-table-action")) {
      nodes.push(element);
    }
  }
  return actionNodes;
}
```

有了這組 actionNodes 的資料以後，我們還需要去取出每個 action node 底下的 slot，這些 slot 就是使用者傳進來的 action 樣式：

```js
function getActions(actionNodes) {
  const actions = [];
  actionNodes.forEach((item) => {
    const slot = item.shadowRoot?.querySelector("slot");
    const childNodes = slot.assignedNodes({ flatten: true });
    action.push(childNodes);
  });
  return actions;
}
```

我們將 action 樣式整理完成之後，就要開始定義稍早講到的 `setActions()` 這個函式了，它會將每個 action 的樣式組合起來並回傳完整的 HTML 標籤出去。而這邊這個動作除了會繪製 action 的標籤以外，還會呼叫 \_handleClickAction 將 action 的 click 事件綁上去。

```js
private setActions() {
  const actionsHTML = `
    ${getActions(actionNodes)
      .map(
        (item, i) =>
          `
            <div click-event-index="${i}">
              ${item[0] ? item[0].outerHTML : ""}
            </div>
          `
      )
      .join("")}
  `;
  const actionsElement = this.shadowRoot?.querySelectorAll("tr .action");
  actionsElement.forEach((element) => {
    element.innerHTML = "";
    element.insertAdjacentHTML("beforeend", actionHTML);

    const actionItems = element.querySelectorAll("div[click-event-index]");
    actionItems.forEach((_, i) => {
      actionItems[i].addEventListener("click", this._handleClickAction);
    });
  });
}

private _handleClickAction = (e) => {
  const currentTargetIndex = e.currentTarget.getAttribute('click-event-index')
  const rowIndex = e.currentTarget.parentNode.parentNode.getAttribute('aria-rowindex');
  const currentData = this.data[Number(rowIndex)];
  this.actionNodes[Number(currentTargetIndex)]._click(currentData);
}
```

如此一來，只要 call 了 `setActions()` 這個 function 就可以拿到整組的 actions 標籤，而且已經綁定了對應的 click 事件。
所以 table 就透過了 `<wc-table-column>` 及 `<wc-table-action>` 兩個特殊標籤，來達成了讓使用者自訂表個的目的了。

## 結語

以上的程式碼示範主要要傳達實作的概念，以往在切版時都是按照設計稿，定義標籤，定義樣式。這次因為接觸到了元件庫的建立，才有機會從「複用」的角度來思考怎麼設計出一個可以讓使用者客製化的元件。雖然目前這個表格非常的陽春只有顯示資料跟簡單的操作功能，沒辦法支援很多厲害的操作或設定。不過也讓我理解到原來透過 Web Component 自訂義標籤可以有這些變化性的玩法。

之後會再把整個表格的功能變得更加完善，目前也在討論規格當中。在這邊提供一個不錯的套件 [vaadin](https://vaadin.com/components/vaadin-grid/html-examples/grid-basic-demos)，它也是能夠用類似的方式建立客製化表格，而且功能相對於完善許多，如果有人有類似的需求，希望 vaadin 可以幫助到你們。

## 參考資料

- https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM
- https://the-allstars.com/blog/website-information/what-is-web-components-why-is-it-so-important.html
- https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_templates_and_slots
- https://vaadin.com/components/vaadin-grid/html-examples/grid-basic-demos
