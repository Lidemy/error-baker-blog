---
title: 為什麼要使用框架 - 你聽過最好的答案是什麼？
date: 2021-09-19
tags: [framework]
author: benben
layout: layouts/post.njk
image: https://www.saaspegasus.com/static/images/web/modern-javascript/2008-vs-2021.png
---

<!-- summary -->
<!-- 框架百百種，但有想過為什麼要用框架嗎？ -->
<!-- summary -->

![modern-javascript](https://www.saaspegasus.com/static/images/web/modern-javascript/2008-vs-2021.png)

> 圖片來源：[https://www.saaspegasus.com/guides/](https://www.saaspegasus.com/guides/)

## 前言

大家安安！2021 的 Web 前端也是一如往常的五花八門！當然，我們也是學的落花流水的。

最近也是筆者程式導師計劃第五期的尾聲了，不知道大家的學習路徑是如何，也許有大前門輩是一路從原生 JavaScript 、到 jQuery 、再到三分框架的時代，而當中框架也經歷不少更新（2016 - 2021），但很多的 `前端快速上手班` 的學習過程，可能剛學完 JavaScript 就直接學 React hooks、Vue 3 ...等，我敢說有人（可能還不少）不知道 JavaScript 的作者是誰，甚至也沒聽過網景，所以更別說框架了，為什麼要學 JavaScript ？可能都沒辨法回答的很好。

像這種 `為什麼` 類型的問題，筆者喜歡去找歷史，因為歷史會告訴你前人的時空背景，通常在理解並稍加分析後，就會推導出自己答案了，這種答案比起那種塘塞給面試管的答案，更能說服自己。

筆者這邊會以前端的框架的角度，去思考為什麼我要使用框架。但有時候或許可以不用這麼糾結，有些可能是哲學問題，例如：人是為了什麼而活？然後就開始疑懷人生。

## JavaScript 簡史

**1995 年，Brendan Eich 大大發明了 JavaScript** ，今年（2021）的 7 月 4 號也是他的六十歲大壽，我們懷念他，不是！是祝福他，感他，感謝他發明了 JavaScript 讓我們有工作可以做、而且還有很多東西很難懂，但如果可以搞懂了大部分人不懂的東西，就可以跟別人區隔開來，老實說這樣鑑別度蠻好的，所以面試考這些，好像就很合理了。

![Thanks for JS - meme](https://res.cloudinary.com/practicaldev/image/fetch/s--ZDtqrBOj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://github.com/damiancipolat/js_vs_memes/blob/master/doc/js_thanks.png%3Fraw%3Dtrue)

> 圖片來源：[https://dev.to/damxipo/javascript-versus-memes-explaining-various-funny-memes-2o8c](https://dev.to/damxipo/javascript-versus-memes-explaining-various-funny-memes-2o8c)

謝了！Brendan Eich 大大發明 JavaScript！對了，如果你不知道，他就是圖中的辣個男人。

當時的時空背景是：**需要一個可以在瀏覽器中執行的程式**，當時的 **網景** ( Netscape ) 指派給 Brendan Eich 這個任務，正好 Java 正火紅，他就把這個程式語言取名為 `JavaScript` 想蹭一點知名度，其實跟 Java 完全沒有關係（沒有那種會了其中一個，另一個就差不多會了的事），但又不是完全沒有關係，確實他發明的時候也 "參考" 了 Java ，但後來各個語言也是互相 "參考" 來的，很多寫法確實有一曲同工之妙，這裡讓大家自行體會了。

後來 Brendan Eich 引起了一些爭議又是另外一個故事了。

這時的 JavaScript 還很純很純，好！JavaScript 的簡史先到這。

## jQuery 霸主與百家爭嗚的瀏覽器

JavaScript 發明完後，網景的市佔率也順勢起飛，還曾經一度獨站鱉頭，後來其他群雄當然也眼紅了，因為當時用網路的人還不多，不用我說，小孩子都知道這絕對是一片大藍海啊！不用多久，隨便就生出了一堆瀏覽器：Internet Explorer, Chrome, Firefox, Safari, Opera, ...等，於是瀏覽器混戰就開始了！小孩子才做選擇，我都用 IE ！

但是好景不常，工程師面臨的問題是：**要如何解決跨瀏覽器** 的問題，最一開始是，每一懂寫法都寫好寫滿，當然這很累人，但又創造了不少工作機會，是吧？有需求就有機會。

**2006 年 jQuery 推出了**，曾經全球前 10,000 個存取最高的網站中，有 65% 使用了 jQuery ，他完美解決了跨瀏覽器問題，一種寫法就可以轉成各瀏覽器都能用的程式碼，好 library，不用嗎？那時候可能也還沒有 library, framework 的概念，反正問題解決了，客戶開心、老闆開心，當然你也發大財，所以你也開心。

簡單 jQuery 寫法如下：

```javascript
// jQuery
$("#hello")

// 原生 JavaScript
document.getElementById(hello)
```

為什麼要用 jQuery ，當然也就不明而喻了，除了可以少打很多字以外，最重要的一點就是可以解決上述的跨瀏覽器問題，但其實你不需要 jQuery ，除了現在的瀏覽器支援度都很好以外，另人垢病的就是效能問題，以前的專案還不大所以沒感覺，但當你一件簡單的事都想用 jQuery ，這就不對了，例如：原生 document.getElementById 遠大於 jQuery，當你專案越來越大，也就越來越慢。

> 延伸閱讀：[You Might Not Need jQuery](https://youmightnotneedjquery.com/)

## Framework & Library

隨著時間推進，2013 年 Facebook 推出了 React ，是非常新的技術，當然在台灣要有一定的開發者使用，少說也要 3 年，筆者那時候也還在唸書，當然學校怎麼可能會教這麼潮的東西，但是面試的門檻就要你會框架（阿我就沒學過啊），也確實在那個時候（2016），許多的 `前端速成班` 如雨後春筍般出現，打著無經驗轉職的招牌，阿貓阿狗都收，但實際上的狀況是：我們無從得知那些所有的阿貓阿狗後來怎麼了，反正人進來發大財。

這裡不是說要限制什麼樣的人就不能當工程師，而是要說這條路可能沒你表面看到的容易，那些轉職成功的人都是付出相當大的時間精力，都是你沒看到的，如果你意志還堅定，那麼可以試試看，了不起也就浪費 3 ~ 6 個月。

在回來看到 React 框架，許多人看到 [React 的官網](https://reactjs.org/) 中寫道：`A JavaScript library for building user interfaces`，喔！原來 React 不是框架啊，是一個 "Library"，是整個生態系合成才是一個框架。嗯嗯，這樣你就懂了吧！但是！新手如我，看到這還是充滿一堆問號啊，好了，我的問題又來了：那什麼是 Library？

Library，其實可以源自於西元前 2600 ，由蘇美人的楔形石板打造而成，喔！不是，那是圖書館（library），其實是我找不到合理的解釋，因為這個詞已經很抽像了又有很多意思，也可以看一下 [Wiki 的中文頁面](https://zh.wikipedia.org/wiki/%E5%87%BD%E5%BC%8F%E5%BA%AB) 有多麼少的內容，Library 又分為 Computing Library 跟 Digital Library，但這邊要講的是 Digital Library 裡的放程式碼的 Library，等等！你搞得我好亂啊！但我想你懂我意思。

再換一個角度，如果你是一位 Web 工程師，我敢說你一定用過 `npm` ，好吧，如果沒有，那我也認了。npm 是於 2010 年誕生的，library 一詞，估且說是那個時間點才廣為流傳的，好像也不為過，但大部分的新手對 Library 的認識，不就是用 `npm install XXX` 下載你要使用的套件，對，我就是這樣認識的 library 一詞的，對於這個熟悉又陌生的一詞僅此而已。

其實會寫 function 就會寫 Library 了喔，例如：

```javascript
function add(a, b) {
  return a + b
}

// 或是已經沒這麼潮的寫法
const add = (a, b) => a + b
```

恭喜你，你已經寫了一個加法的 Library 了，對這一詞的概念就是這麼簡單。

Library 跟 Framework 簡單說都是可以使用別人寫好的程式碼，但差別在於 `自由度`，這個概念有點抽像的概念，拿餐廳舉例來說：

1. Library 的寫法：像是可以自由的選擇你要的吃的食物，也可以只喝飲料。
2. Framework 的寫法：則像是配好的套餐，可以選擇某些主食，但甜點不能選擇。

這樣應該有比較懂兩者的差別，但其實自由度一詞也很主觀，像是：如果說 React 的自由度高於 Angular ，大家應該都可以接受，但是他們都是還是框架（準確來說是 React 生態系跟 Angular）

> 延伸閱讀：[The Difference Between a Framework and a Library](https://www.freecodecamp.org/news/the-difference-between-a-framework-and-a-library-bd133054023f/)

既然 React 不是一個框架（準確來說），那麼可以思考一下：**React 裡還要再加哪些東西才算一個框架？**

如果你用過 `create-react-app` ，而且你也有把 `package.json` 來看，會看到 `react`, `react-dom` 還有一些測試套件等，看起來好像也沒有很多東西啊，但是如果你跟我一樣好奇，可以打開 `node_modules` 看看裡面有多少套件，會看到一些知名的如：`webpack`, `babel`, `jest` ...等，也有一些好用的小套件：`uuid`, `dotenv`, `fast` ... 等。

是因為有了 webpack, babel, jest 這些大的 Library 才算框架嗎？可能是也可能不是，我不知道。

> 延伸閱讀：[Is React a Library or a Framework? Here's Why it Matters](https://www.freecodecamp.org/news/is-react-a-library-or-a-framework/)

### 使用框架的好處

常見的答案有：

- 同樣的功能可以重複利用，易擴充也易維護
- Component & 模組化
- 畫面與資料的分離
- React 可以被用來寫 SPA
- React 的生態系已經很成熟，網路上的資源也非常的多
- 保持程式的單一入口點
- 因為社群比較多人用，所以資源也會比較多
- ... 等

但仔細想想上面的答案，可能都只是 **結果** 並不是原因，這需要把前因後果搞清楚，邏輯才會清晰，例如：最上面的兩點，跟框架一點關係都沒有，這兩點只要是寫程式都要都應該要注意的。

如之前所說的，應該要關注的點是框架解決了什麼問題，先來看看這時候什麼問題出現了吧！

當時的時空背景是：**2010 iPhone 4 上市，使用者大量的轉移到移動裝置**，這時候的 web 除了要適應裝置的大小（RWD）之外，還要面對更貼近的商業市場，這代表著 UI/UX 越來越重要，因為使用者越來越多，必須有更好的體驗才能留住使用者，前後端分離的概念也隨之萌芽，確實這個神奇的時間點（2010）開始，大量的工具推出，還記得最上面那張圖嗎，你點發現時間軸是一致的。

這時的分工可能還沒有前後端分離，為了要因應這個巨大的轉變，框架的雛形就誕生了，但是分離的做法當然不只一種，常見的有：MVC、MVP、MVVM 模型，所以框架也是有一些小區別的，但都是為了解決 **前後端分離** 這件事。

到這邊答案就漸漸浮現了，為什麼會需要框架？因為要需前後端分離。為什麼要前後端分離？因為專案規模大。

現行的大型專案幾乎都會用到框架，所以公司要求你至少學一個框架，好像也是挺合理的，因為公司等級的專案通常都很大。既然現在的框架都可以解決前後端分離的問題，再來就是挑選框架了，可以依你喜歡的模型、效能、檔案大小、語法 ...等，去使用任何你喜歡的框架，當然最重要的還是看公司需求 XD

## 總結

現在前端新的東西一直出，舊的東西也一直更新，都快學不完啦！

回顧前端技術的發展，不難發現新技術和新工具總是圍繞著問題而生。但其實近幾年有趨緩的趨勢，其實也如同手機一般的飽合，代表著前端已經逐漸成形了，未來可能不會有太大的改動，可以趁現在把握機會，能掌握技術的時候，就不要讓他溜走！

最後希望大家可以一同進步！如果有說錯或是講得不夠清楚的地方歡迎指正，感謝您的閱讀。

## Ref

- [You Might Not Need jQuery](https://youmightnotneedjquery.com/)
- [The Difference Between a Framework and a Library](https://www.freecodecamp.org/news/the-difference-between-a-framework-and-a-library-bd133054023f/)
- [Is React a Library or a Framework? Here's Why it Matters](https://www.freecodecamp.org/news/is-react-a-library-or-a-framework/)

> 免責聲名

以上均為筆者自身經驗，難免小有主觀意見，供讀者們參考，也歡迎分享經驗交流。
如果有錯誤的地方還請大大們指正，筆者會立刻修改，再次感謝大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作係採用 [創用 CC 姓名標示 4.0 國際授權條款](https://creativecommons.org/licenses/by/4.0/) 授權。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
