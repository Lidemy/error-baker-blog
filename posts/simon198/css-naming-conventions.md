---
title: 探討幾種常見的 CSS 命名慣例
date: 2021-08-29
tags: [Front-end, CSS]
author: simon198
layout: layouts/post.njk
---

<!-- summary -->

## 前言

工作一陣子之後發現其實大部分的工作時間都不是從 0 開始寫程式，而是在維護或整理之前的 code。這個時候遇到的困難常常不是這個 bug 該怎麼解，而花費很多的心力在看前人留下的 code。這時候就會發現其實每個人對 class 的命名都有些不一樣，常常有種雖然好像看的懂但卻沒有一個規則的感覺，所以今天就來探討一些 CSS 的命名慣例來讓我們的 class 更加淺顯易懂卻又不失實用性吧！

<!-- summary -->
<!-- more -->

### 先說說一些大部分慣例都共通的地方

##### 命名必須有語意

首先呢！跟其他程式語言的變數一樣的是給自己的 class 一個有語意的名字，而且不要隨意進行縮寫，如果真的要縮寫的話要注意那個縮寫會是大家都看得懂的，如果不確定的話就不要用。例如他是一個按鈕那就叫他 `button` ，頂多縮寫成約定俗成的 `btn`，不要縮寫成沒人知道是什麼東西的 `b` 之類的。

##### 注意 case 的問題

就是 case 的問題，在前端另外一個常用的語言 JavaScript 裡面，他的命名慣例會用 `camelCase`，但這不適用於 CSS。在 CSS 裡面比較常用 `-` 或是 `_` 來串連兩個字，至於到底要用 - 還是 \_ 我等等會在多討論一些。

##### 抽象化命名

有的時候我們會因為它是一個會紅色的的 button 所以想要把他的 class 取名叫 `button-red` ，這個命名就很直觀可以看出來，但試想看看如果有一天專案想要把這個紅色的 button 改成藍色，那是不是就會發生不只要改 style，連 class 的命名也都要改變了！

所以這個時候其實可以把整個專案最常用的顏色設為 primary color，這樣那個 button 的命名就可以叫 `button-primary`，之後在改顏色的時候就只需要改 style 就好，不需要更動到 class 的名字。

另外一個範例是 layout 相關的，有的時候我們會因為他在 navbar 的左邊所以就把他取名字叫做 `nav-left`。但問題來了！當我們遇到 rwd 的時候他可能就會跑到下面去了！那這個時候 `nav-left` 的命名不夠精確，所以我們就可以用它的功能來命名，例如他是 logo 的話就可以叫 `nav-logo` 或直接叫 `logo` ，這樣不管 rwd 怎麼改都不會有不精確的情況發生了！

### 常見的命名慣例

### OOCSS

全名是 Object Orientied CSS，是在 2008 年的時候由網頁工程師 Nicole Sullivan 提出的！他的核心概念有兩個

1. The separation of “structure” from “skin”
2. The separation of “container” from “content”

翻成中文就是

1. 結構與樣式分離
2. 內容與容器分離

這樣的好處就是可以大大的增加 `CSS 的可覆用性` 跟 `CSS 的可擴展性`，就可以讓原本動輒幾百行的 CSS 變得更加精簡又好讀。

##### 結構與樣式分離

一般來說在寫 CSS 的時候我們會把樣式跟形狀寫在一起，但在 OOCSS 裡面可以把看得到的歸類成樣式，看不到的分類成結構，一樣用 button 來舉例：

![](/img/posts/simon198/buttons.png)

這三個按鈕如果要做成結構與樣式分離的話就可以這樣寫：

```css
.btn {
  border-radius: 8px;
  border: 0;
  font-size: 24px;
  margin: 12px;
  padding: 12px 24px;
}
.btn-success {
  background-color: green;
  color: white;
}
.btn-warning {
  background-color: orange;
  color: white;
}
.btn-danger {
  background-color: red;
  color: white;
}
```

我們用 btn 這一個 class 來管理這個 button 的結構，包含 padding，border 等等，其他會因為不同使用情境而有不同外觀的，我們就再各自用一個 class 來寫。這就是所謂的把結構和樣式分離。

##### 把容器和內容分離

另一個概念我們用一個跟 coding 比較不相關的車子來舉例好了，大家印象中的車子大概就是有四顆了輪子然後用引擎或馬達當動力在路上跑的。這個既定的印象其實就像是車子的容器，在這個容器裡面的內容卻會因為每一台車的需求不同會有所不一樣。

舉例來說一般的車子講求的是好開省油，所以裝的會是馬力比較小的引擎 ；但如果今天是賽車的話，就會需要馬力大的引擎來讓車子更快。這就是在一樣的容器內裝入不一樣的內容而產生出不一樣的產出。

### BEM

BEM 是由 Yandex 公司所推出的一套命名規則，他是 Block, Element, Modifier 這三個單字的字首所組成的。他的優點同樣是增加 class 的可重用性和擴充性，但和 OOCSS 相比缺點就使他的 class 名字容易顯得比較冗長。至於到底是不是利大於弊就等大家看完我的介紹之後再自己判斷啦！

##### 基本架構

BEM 的基礎 CSS 架構大概是長這個樣子：

```css
.block {
}
.block__element {
}
.block__element--modifier {
}
```

##### B - Block

可以想成網頁是由一個又一個的 Block 所組成的，而在 BEM 中的的 block 會有以下的規範來幫助他達到可以重複使用且可以互相嵌入的特性。

1. 不能使用 CSS 標籤選擇器和 ID 選擇器。
2. Block 名稱需能清晰的表達出，其用途、功能或意義，且具有唯一性。
3. 每個塊在邏輯上和功能上都相互獨立，在頁面上不能相依其他 Blocks 或元素。

##### E - Element

Element 是 Block 的字元素，可以看作是整個 Block 的內容們，命名原則為 `＿＿`（兩個下底線）之接 Element 的名稱，他有著以下的特性：

1. 沒有辦法獨立於 block 之外生存，換句話說 block 可以沒有 element，但 element 不可以沒有 block
2. 表達的是目的，而不是狀態

##### M - Modifier

Modifier 則是作為表達 block 或是 element 的屬性或是狀態使用，命名原則為在 block 或是 element 之後加上 `--` 之後再加上 modifier 的名稱。他的特性如下：

1. 不能脱離 Block 或 Element 使用。
2. 應該改變的是實體的外觀，行為或狀態，而不是替換它。
3. 不能同時使用兩個相同屬性卻不同值的 modifier

#### 實例

那就讓我們用下面這張 card 來舉例 BEM 的實作

![](/img/posts/simon198/card.png)

首先這張卡片的 html 是長這樣子的：

```html
<div class="card">
  <h2 class="card__title">我是標題</h2>
  <p class="card__content">
    很多內容很多內容....
    <span class="card__content--important"> 重要的內容 </span>
    還是很多內容很多內容....
  </p>
</div>
```

這邊可以看到在 `card` 這一個 block 裡面存在著 `card__title` 和 `card__content` 這兩個 element 而在 card**content 裡面又有一個 `card**content--important` 這一個 modifier。

##### block

```css
.card {
  border: 1px solid black;
  border-radius: 8px;
  box-shadow: 2px 2px rgba(0, 0, 0, 0.6);
  margin: 24px;
  height: 120px;
  width: 250px;
}
```

在這張卡片裡面 block 決定的整個區塊的大小和形狀，並且不影響外部的 style，使他可以很容易地與其他的 block 並且不會互相干擾。

##### Element

```css
.card__title {
  font-size: 24px;
  padding: 12px;
}
.card__content {
  font-size: 14px;
  padding: 4px 12px;
}
```

在這裡因為我們希望這個張卡片裡面有一個標題跟一段內容，所以就加入了兩個 element。

這兩個 element 只有定義一下他基本的 style 而沒有詳細的屬性，並且如果把他單獨放到外面的話就只是兩行文字，就失去了 title 跟 content 的作用。

##### modifiter

```css
.card__content--important {
  background-color: red;
  color: white;
}
```

這邊我們加了一個 modifier 來讓重要的文字反紅，如果想要在 block 或是 element 上面加上屬性或是狀態的話就利用 modifier 來加！

## 總結

其實要要把 CSS 寫得好，不外乎是想要增加 class 可重複利用性以及可擴充性，這兩套命名慣例也都可以很好的達到這兩個目的。所以如果開發前先規劃遵循的命名規則就可以有效的增加自己的效率，也可以讓之後在閱讀的人可以更有效率的上手哦！

## 參考資料

- [Best Practice in CSS: Organisation and Naming Conventions](https://hackernoon.com/best-practice-in-css-organisation-and-naming-conventions-4d103ujy)
- [鐵人賽 2 - OOCSS 結構與樣式、容器與內容](https://wcc723.github.io/css/2016/12/02/oocss-one/)
- [BEM](http://getbem.com/)
