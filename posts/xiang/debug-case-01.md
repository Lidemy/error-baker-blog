---
title: Debug 系列 01
date: 2021-10-10
tags: [Front-end, JavaScript]
author: Xiang
layout: layouts/post.njk
image:
---

<!-- summary -->

<!-- # 這個系列文要來分享工作上 debug 的案例 -->

<!-- summary -->
<!-- more -->

## 前言

工作上時不時會遇到一些有趣的 bug，它可能技術含量不見得那麼高，沒辦法獨立寫成一篇文章，但卻又值得拿來跟大家分享。
於是我決定打算把這些小 bug 們累積起來，一次多分享幾個，讓內容可以更貼近工作上遇到的實際狀況，也可以當作自己處理完問題後留下來的一次紀錄。

## 本篇內容

- dispatchEvent 的烏龍事件
- tab 導致的頁面跑版
- font-weight 無法控制的粗細問題
- 表單 tab 無法跳至下一題

#### ☞ 案例一： dispatchEvent 的烏龍事件

這個案例是在實作一個 **拖曳式檔案上傳**(Dropzone) 元件遇到的，當我們將第一個檔案拖曳進去上傳時一切都很正常，但是再將另一個檔案拖曳進來後，會使第一次上傳的檔案又被重複上傳，明明只拖曳兩次，卻上傳了三個檔案。由於是在測試階段發現的問題，所以回頭去看程式碼有沒有什麼問題。

當下的程式碼是這樣寫的：

```js
this.addEventListener("drop", this._onFileDrop);

private _onFileDrop = (e: DragEvent & { dataTransfer?: any }) => {
  e.stopPropagation();
  e.preventDefault();

  this._value = e.dataTransfer.files;

  // 因為這個元件要給其他專案引入後使用，所以會打一個事件出去給外面接收
  this.dispatchEvent(new Event("drop", e));
};
```

只有一個事件監聽，而且也做了 `stopPropagation` 跟 `preventDefault`，那為何檔案上傳會跟預期的不一樣？
我們在呼叫 `_onFileDrop` 的時候把 `e` 印出來看看：

```js
// 這邊是 devtool 底下的 console： 我只有進一次拖曳檔案的動作，但是 _onFileDrop 被呼叫了兩次，而且出現了兩個不同的 event

event DragEvent {isTrusted: true, _constructor-name_: 'DragEvent', dataTransfer: DataTransfer, screenX: -1, screenY: -605, …}

event Event {isTrusted: false, _constructor-name_: 'Event', type: 'drop', target: wc-upload-dropzone, currentTarget: wc-upload-dropzone, …}
```

原來最下面的 `this.dispatchEvent(new Event("drop", e));` 導致 drop event 又被觸發了一次，也就是說我們打出了一個 new Event，而這個 event 又被自己的 addEventListener 給接收到了，才使這個 function 被重複呼叫了。

所以第一次的 `DragEvent` 是瀏覽器觸發的，第二次的 `Event` 是我們自己讓元件觸發的，才導致這次重複上傳的烏龍。
這件事情就是在告訴我，撰寫程式時，事件的監聽，以及事件的觸發，要小心不要讓彼此互相干擾了。

#### ☞ 案例二： tab 導致的頁面跑版

這個案例很有趣，也很感謝辛苦的 PM 詳細的測試抓出了這次的錯誤。
這個頁面本身是一個外部無法滾動，但中間元件可以滾動的頁面（就像 gmail 一樣），

上方的 Navbar 是 `fix` 的，所以會固定在螢幕上方，中間的表單是 `overflow: scroll` 的，所以可以滾動。那外層的背景呢，它的高度其實有超過 view height，但是我不想讓它滾動，所以我設置了 `overflow: hidden` 來防止滾動，依照我們正常的理解，這樣子的設定可以讓整個頁面只有中間的表單是可以滾的，其他都不會動。

當 PM 在測試中間的表單時，按下了鍵盤上的 tab 希望能快速跳至下一題，結果背景的位置竟然滑動了，向上偏移了一段距離後它就卡在 Navbar 底下了，因為外層沒辦法滾動，所以它就卡死在那裡，也沒辦法滾動，反正就是出不來。

（影片當中因為是 gif，所以看似它有脫困，但那是因為 gif 在重播的關係，實際上它真的就是給它卡死了，完全出不來也動不了）

![](https://blog.errorbaker.tw/img/posts/xiang/debug-case-01a.gif)

回頭去查了一下 tab 為何可以讓一個不能滾動的元件產生位移，找到了 [這篇討論](https://stackoverflow.com/questions/18520956/tabbing-causes-overflow-content-to-shift-up) 提到當我們按下 tab，可能會導致 `overflow: hidden` 的元件位置跑掉。原因就是該元件本身的高度其實是大過螢幕高度的，只是我們透過 CSS 來把多餘的部分隱藏了，不代表它高度有變小。所以雖然使用者無法上下滾動，但是按下 tab 後經過了瀏覽器的調整，元件還是有機會滑動的，而且一但滑動後就回不來了，所以卡在那邊。

處理方式是我將外部元件的高度經過計算，讓它可以維持在一個小於螢幕高度的狀態，然後移除 `overflow: hidden` 的設定，也就是讓它不可能再有滑動的機會。

#### ☞ 案例三： font-weight 無法控制的粗細問題

這是一次測試時 PM 說我表單的 textarea 文字設定錯了，placeholder 變成粗體，讓我改成跟 input 的 placeholder 相同是細的字體。

![](https://blog.errorbaker.tw/img/posts/xiang/debug-case-01b.png)

我看看這個簡單，直接在 textarea 按右鍵檢查看看它 font-weight 的設定，看看是不是真的設定錯誤。

```css
:host > textarea {
    display: flex;
    padding: 9px 12px;
    border-width: 1px;
    border-style: solid;
    border-color: var(--textarea-border_color);
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    font-style: normal;
    line-height: 24px;
    letter-spacing: normal;
    color: var(--textarea-color);
    outline: none;
    width: 100%;
    font-family: var(--font-family);
    box-sizing: inherit;
```

看了一下 `font-weight: normal;` 咦？設定沒有錯誤啊！
還是我把它改成 `font-weight: 100;` 看看

![](https://blog.errorbaker.tw/img/posts/xiang/debug-case-01c.gif)

怎麼改都一樣粗？我眼睛業障重？
所以現在已經是最細的字體囉？那要怎麼讓它更細？變得跟 input 一樣細？
人家 input 的設定也是 `font-weight: normal;` 啊！所以我的 `font-weight` 壞掉了嗎？

> 愛因斯坦說過：
> Insanity: doing the same thing over and over again and expecting different results.
> （不負責任翻譯： 做一樣的事卻期待能有不同的結果，是智障！）

不然，我來試試看改別的地方好了～

![](https://blog.errorbaker.tw/img/posts/xiang/debug-case-01d.gif)

啊哈！果真被我找到了，原來是字體的問題導致粗細上面的差異。
前陣子調整過幾個元件的字體，但是 textarea 沒有吃到調整過後的字體，才導致了粗細跟 input 不同。
一開始認為是 `font-weight` 的問題，才會找不出原因，所以其實 `font-family` 是會影響字的粗細的，下次檢查粗細時要特別提醒自己一下。

#### ☞ 案例四： 表單 tab 無法跳至下一題

沒錯，又是 tab 的坑！
我們一般都知道，我們在填表單的時候，可以透過鍵盤的 tab 鍵快速跳至下一個輸入欄位。
可是 PM 今天說更改密碼頁面的 tab 失靈了，沒辦法正常跳至下一題。

issue 描述內容如下：
輸入舊密碼後，點選 Tab，但沒有成功跳掉下一個輸入欄。
再次點選 Tab 才進入下一個輸入欄。（目前都要點兩次才會進入下一格）

![](https://blog.errorbaker.tw/img/posts/xiang/debug-case-01e.png)

怪了，這元件在其他頁面也有用，怎麼其他頁面就沒這個問題？
去餵 google 看看有沒有人遇到同樣的問題，不曉得 tab 鍵是不是有什麼神奇的設定，不然我怎麼一直踩 tab 的坑？
結果查不太到類似的情況，但是看過了 [這邊](https://developers.google.com/web/fundamentals/accessibility/focus/using-tabindex?hl=zh-tw) 的說明後，我察覺到一件事情，我們一般認為 tab 會移至下一個輸入欄，但是如果輸入欄跟輸入欄之間有 button 存在，按下第一次 tab 就會先 focus 在 button 上面，按了第二次，才會 focus 在第二個輸入欄！

所以因為我的 password 輸入欄，最右邊會有一個 button 可以點選，用來讓使用者切換顯示的密碼。
由於這個 button 存在於 tab 的排序之中的，所以按了 tab 後其實會先 focus 在 button，點第二次才能正確跳至下一題。

知道原因就好辦了，讓這個 button 脫離 tab 的順序就可以了，透過一個 `tabindex="-1"` 的設定 。(這下可以擺脫 tab 的糾纏了吧 ><)

## 總結

今天分享了四個工作上遇到的 debug 案例，雖說提到的內容很淺，但有時候小小的問題，也有可能像擱淺的船隻一樣卡死在那裡，重點在於提醒自己換一個角度去思考，debug 有時候也可以很好玩，甚至有些時候很敬佩測試者能夠測出很多意料之外的問題，有這些專業的測試在後頭協助把關，也讓開發者可以更放膽去揮灑（笑
歡迎大家針對這次分享的案例提出自己的解決方法，或者分享自己工作上遇到過類似的問題。
之後時不時會整理更多工作的 debug 案例，持續在 ErrorBaker 上面分享。
