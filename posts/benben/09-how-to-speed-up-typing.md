---
title: 如何提升打字速度 - 從初心者轉職超級初心者
date: 2022-10-16
tags: [typing, vs-code-plugin]
author: benben
layout: layouts/post.njk
image: https://hackmd.io/_uploads/rJWJgRQ1i.gif
---

<!-- summary -->
<!-- 如何提升打字效率，從劍士、法師、盜賊的方面來說 ... -->
<!-- summary -->

**! 這一篇文章主要會講要提升打 Code 的速度，從各方面來說，包含物理、心理、視覺的方面，希望對大家有幫助！。**

![typing](https://hackmd.io/_uploads/rJWJgRQ1i.gif)

## 前言

大家安安，我終於又回來了，前陣子也是小忙，這次要跟大家分享是「打字效率」！

「打字快速」絕對是一門值得投資的技術，尤其是是做為長時間使用盤輸入的人，如：開發者、文字工作者，甚至仍至於 **速錄師** 等，如果你的打字速度非常快，別當 ~~爆肝~~ 工程師了，去當速錄師吧（有興趣的讀者可以去查看看速錄師的薪水）！筆者在學習的過程中，上過很多的線上課跟直播等等，發現有很多的優秀高手、大神，打字速度都非常快，手短如我，每每看到都很羨慕，要是自己的打字速快能有這麼快該有多好！然後就開始幻想快速 Coding ，下略 3000 字 ...

要先說明的是，注意我這邊講的是 **效率** ，而非速度，而效率也是主觀的感覺，所以我除了會介紹一些不錯的打字練習網站來提升速度，還會透過其他方式來增加 **打字很快的感覺**，如果你也有興趣就繼續看下去吧！

## 初心者篇

有人說最棒的 IDE （Integrated Development Environment） 是 VScode、有人說是 Notepad++ 、有人說是 VIM，有人說是 Office Word ，來聽看看前 FaceBook 的工程師說說為什麼是 Office Word。

[![Best IDE](https://img.youtube.com/vi/X34ZmkeZDos/0.jpg)](https://www.youtube.com/watch?v=X34ZmkeZDos)

> Why Microsoft Word is the best IDE for programming | Joma Tech

來試試看最棒的 IDE Microsoft Word 吧！等等！我依習慣打個 `! + tab`, `.wrapper > .item * 3`(emment 語法), 怎麼沒東西！應該會直接產生一個 html 的 template 的啊，窩不會寫扣了。

雖然表面上很好笑，但細思極恐，沒錯，我們都被現在的 IDE 寵壞了。

筆者認為 Word 很大，呃，不是！是 Word 很貴，要買正版的 Word 也是不便宜，看來要使用最棒的 IDE 也是要付出代價的！

還是說 ... 先使用純白的 txt 看看吧！

筆者真的幹過這種事，每次看完大神的技術分享後，滿腔熱血地打開一個空白記事本，直接進入心流狀態猛敲鍵盤，回過神來，已是一串 `console.log('Hello World')` ，筆者自己都不敢相信。

就讓我們回歸到最初的起點吧，只打開記事本，看看能不能在不 google 下就自己寫點什麼，如最簡單的：Counter, TotoList 等等。

---

## 劍士篇

技能：*雙手鍵使用熟練度**

最基本要提升打字速度的方法，沒什麼就是多練就對了！

打字練習的網站有很多，這邊就不依依介紹了，分享一些覺得不錯的網站，有些也是朋友介紹的，這邊就全部公開不私藏。

英打推薦網站：

- <https://www.ratatype.com/>
- <https://www.typing.com>
- <https://10fastfingers.com/typing-test/english>
- <https://qwerty.kaiyi.cool/>

小建議是跟學習正確的指法一起練習，雖然短期來說可能打字會變慢，但習慣之類會發現，會比之卡住的瓶頸還要快。

技能：**自動拼字防禦**

再來是自動防禦的部分，字打的快，錯的也越多，這時候就可以試試 VScode 的插件：[Code Spell Check](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

雖然這也是講到爛掉的插件，但因為真的很實用，尤其是打字快的時候，因為有時候自己再寫 function 的時候命名拼錯，結果整個 code base 的命名全部都錯，這時候想改可以就一個頭兩個大了，如果是個人專案還好，反正自己雷自己踩，踩久了就習慣了。

但如果是合作的專案可就不是開玩笑的了，例如：開發時程很趕，產生某個 typo ，結果就一直延用下去，環境變數也延用，後端也很延用，DateBase 也延用，這就不是自己改好就好的問題了。所以千萬不要 typo ，甚至用 typo 於雷到別人好嗎？自動防禦開下去就對了！

技能：不要使用 **Tab 狂擊**

再來是 **不要使用 Tab (auto complete)** 、還有一直按 "上" 只為了找一段 `npm run dev`，也這是很多新手開發者遇到的雷，反正現在的 IDE 都很強了，可以一路「Tab」到底，當一個 Tab 工程師開發上是也快沒錯，但隨之而來的是：打字就是不快、甚至連常用的 Api 都記不起來（如：document.getElementById('#app')），測試自己看看不使用 Tab 能完成嗎？如果能完成那是花了多少秒？

有些讀者可能會認為，有必要嗎？用 Tab 不是很好嗎？筆者一開始也同意，但後來在一次的上課中，有同學請教了 [胡立](https://blog.huli.tw/about/) 大大，英打如何打字跟老師一樣快，其中一建議就是「不用使用 Auto complete」從那一刻開始，我就很很少使用 Auto complete 了，我也覺得很有幫助，所以這邊也再分享這樣想法！

先說筆者同意使用 Tab 的好處，也很多資深開發者也是 Tab 按好按滿，但前題是這些資深的開發者，大多 Api 都非常熟練、打字都非常快速了，使用 Tab 真的只是純粹幫他們節省時間。而就我看來，大多的新手開發者使用的 Tab 就不太一樣了，是啦，有節省到時間，但也省下了思考的機會、練習打字的機會。

使用 Tab ，但只在你真的了解每個 Tab 下的意義。

## 法師篇

技能：**隕石術**

講了這麼多 hard core 的部分，是改來點魔法了，試試 VScode 插件：[Power Mode](https://marketplace.visualstudio.com/items?itemName=hoovercj.vscode-power-mode)

裝了之後，直接習得「隕石術」畫面真的很炫，可以直接看官網，這邊就不再轉貼一次了。

用了之後寫 Code 都 100 分，連隕石砸下來都不怕了呢！沒 ... 老闆先不要再砸隕石下來了，團隊快不行了。

一開始使用一下下，會覺得隕石術很棒，但可不可不要有地震術的效果？

有的，只要去設定的地方：

VScode 設定 -> 輸入「powermode」 -> 往下滑，找到「Shake:Enabled」 -> 把勾勾取消勾選

這樣就完成啦！

之後就是隕石連發起來（不是開發的隕石喔）！打字直接 500x, 1000x 爽度一百啊！

## 盜賊篇

技能：**殘影**

到了盜賊篇，來點被動技能「殘影」吧！

這邊什麼都不用安裝，因為這是原生 VScode 的隱藏設定，因為預設是關，好像也很多人不知道這個功能，筆也是在某個大神直播中發中的，分享給朋友後每個都讚不絕口呢！

就來教大家如何學習殘影：

- 使用 VScode 的設定 `Cursor Smooth Create Animation`
  1. 打開 VScode 的設定檔畫面（`cmd` + `,`/`ctrl` + `,`）。
  2. 搜詢：`smooth`。
  3. 找到 `Editor: Cursor Smooth Create Animation`，並將它打勾。

![Cursor Smooth Create Animation](https://hackmd.io/_uploads/B1GLPaXJi.png)

> 使用前

![before](https://hackmd.io/_uploads/rJWJgRQ1i.gif)

> 使用後

![after](https://hackmd.io/_uploads/SkDylRQJs.gif)

但好像 GIF 的截圖，因為有壓縮過，所以不明顯 QQ

## 翻外篇：商人篇

技能：**買啦！哪次不買！**

這邊就是裝備篇的部分了，一個好的工程師，一定找一個自己喜歡的鍵盤配上軸體之類的，還有自己喜歡的手感，但這部分真的很因人而異。簡單說就是多試試就對了，才知道自己喜歡的軸體、材質手感等等，還有一個很重要的就是看你的需求，沒有攜帶的需求，RGB 登之類的。

我這邊也簡單分享自己的心得，因為喜歡手維持在鍵盤中保持效率，所以考慮的就會是 87%、66% 的鍵盤，因為數字鍵擺著也是佔位置，可以省下更多空間，再來是軸體的部分，也這也很看個人，因為我一開始也不熟悉各軸體的差別，所以第一把就買了萬用的茶軸，一開始感覺也還不錯，但用久了發現我的小指頭會有點痛，後來才改成紅軸，比較省力也比較安靜一點。

市面上常見的軸體，簡單來說：

- 力道：紅軸 < 茶軸 < 青軸
- 音量：紅軸 < 茶軸 < 青軸

但還是因各家的產品略有不同，簡單介紹給想入門的（~~但如果金錢不是問題的話，可以試試 HHKB ~~），還有盤冒材質的部分，我自己是黃油手，材質的部分就可以試差 PBT 或是更好的材質之類的，這部分也很多人做介紹了，就自己作點功課吧！

## 總結：超級初心者篇

技能：**我全都要**

技術點數有限，前端學海無涯，回頭是岸啊，施主！

但是我全都要！所以上述的方法可以依照個人的需求全部一起試試。

因為打字效率這個技能是會隨著使用者一起成長的，報酬率也是很高的！不要低估這個軟技能，有的公司就要求了開發者的打字速度，這個技能也可以說是區分了新手開發者跟中高階的開發者，很值得投值一點時間在上面的！

另外這些技能好像某的經典遊戲的內容，直接曝露年齡了（QQ），就別認了吧。

最後希望大家都能離理想中的駭客更進一步，但請當個道德駭客吧！

Happy Typing, Happy Hacking!

## Ref

- [YouTube | VS Code tips — Enabling smoothly animated cursor movement](https://www.youtube.com/watch?v=FCUi_dRU0tY)
- <https://www.ratatype.com/>
- <https://www.typing.com>
- <https://10fastfingers.com/typing-test/english>
- <https://qwerty.kaiyi.cool/>
- [VScode Plugin | Code Spell Check](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [VScode Plugin | Power Mode](https://marketplace.visualstudio.com/items?itemName=hoovercj.vscode-power-mode)

> 免責聲名

以上均為筆者自身經驗，難免小有主觀意見，供讀者們參考，也歡迎分享經驗交流。
如果有錯誤的地方還請大大們指正，筆者會立刻修改，再次感謝大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作係採用 [創用 CC 姓名標示 4.0 國際授權條款](https://creativecommons.org/licenses/by/4.0/) 授權。您可以在 <benben.me> 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at <benben.me>
