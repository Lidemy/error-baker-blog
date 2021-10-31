---
title: 用 11ty 寫部落格的心得
date: 2021-10-31
tags: ["Eleventy", "JavaScript"]
author: Lavi
layout: layouts/post.njk
---

## TD;LR
<!-- summary -->

從規劃、設計、開發到部署，簡單談談用 eleventy 架設部落的心得。

<!-- summary -->


---


最近一個月左右的時間都在架設部洛格，利用這篇回顧一下過程，也記錄一下心得。

在正式開始前先提一下為什麼決定自己架部落格好了。

自己過去有在 Medium 還有 CoderBridge 放一些內容，在 Medium 平台上寫技術文章的問題，在網路上有已經有非常多的討論，可以左轉 Huli 的[在 Medium 上寫技術文章，你確定嗎？](https://hulitw.medium.com/do-you-really-want-to-write-tech-blog-on-medium-3dd25640f26c)或其他文章。

不過對於自己而言問題 Medium 主要體現在兩個部分：寫文章體驗、沒有文章列表和分類。

寫文章體驗部分，如果單純分享純文字內容可能沒有那麼不便，但對於工程師而言想要寫技術文章內容很難避開程式碼，在  Medium 上面放程式碼絕對是體驗很糟的選擇，還有自己習慣使使用 Markdown 來寫文章然後再上傳 Medium，即使有了轉換器也還是很麻煩。

此外可能出於商業考量， Medium 的文章列表非常難用，整體並沒有一個能夠一目了然看到自己 PO 了多少篇文章的功能，還有如果不是 Publication 的話，目前似乎還沒有分類的功能。

Medium 這個平台的推力對於自己主要就是這兩項，其他比較常提到的 SEO、搬家麻煩等等的問題其實對我而言也沒有那麼嚴重。自己本來文章就不多，搬家的過程其實並沒有想像中的那麼困難（後面會提到如何搬家），SEO 部分沒什麼流量所以還不需要擔心。

再來是 CoderBridge ，CoderBridge 的確是蠻方便的平台，功能上也很完整，沒甚麼好挑剔的，蠻推薦初期想要寫自己的技術文章但是還沒有能力或懶得建立自己部落格的人，自己大多的技術文章也都放在上面。

不過做為工程師到了一個程度之後就會開始想要架設自己的部落格，一方面可以累積一些內容，還有之前在面試的時候就有被問到為什麼沒有自己架設，這樣的問題不管怎麼回答都是滿滿的尷尬。

另外一點是，總覺得自己的部落格算是一個工程師技術能力上的證明，在處理部落格的過程中，從前端、~~後端~~（不，根本沒有）、部署都能夠接觸到，也能夠踩到一些坑還有處理問題，也算是不錯的經歷。有個平台

好了，建立部落格的原因大概講到這裡，正文開始。


## 工具棧

整個部落格大概有五個步驟：規劃、設計、開發、搬家、部署，這篇文章也大概會依照這樣的脈絡下去敘述。

規劃部分，一開始初步思考一下部落格的定位，可以找找常看的部落格，參考有哪些頁面和功能是想要放進部落格的。思考完定位後，最重要的是列出資訊架構，包含說每個頁面中需要放入哪些內容，需要哪些功能。

這裡簡單列出一些自己列出的項目：

- 主頁：文章列表，列表項目需要
	- 標題
	- 概要
	- 發文時間
	- 閱讀時長
	- 標籤
- archive 文章列表
- post 文章頁面

另外，除了頁面之後，也需要列出每一頁共同區塊。像是最基本的 Footer 和 Header 的資訊架構。列出資訊架構後，在後面的設計與開發，基本上會依照這些頁面和區塊作為基本單位去執行。

## 設計

在軟體上是用 Figma。至於設計的流程部分，自己不是什麼正統的設計師，並沒有非常嚴謹清楚的方法論，只是分享下個人經驗。

自己在設計上的順序是這樣：

1. 顏色和字體：自己覺得會決定整個網頁的調性
2. 文章中的出現的元素
3. 將元素微調，組合成各個頁面需要的功能

### 色彩和字體

起初是希望走比較乾淨的風格，但又不要太嚴肅（希望有做到）。所以在字體上就先決定用無襯線體作為主要的文字，在小部分預計用襯線體則作點綴。

色彩部分，定義了這些顏色：

- Primary：主色
- Secondary：輔色
- Text：主要字體顏色
- Text-secondary：輔助字體顏色
- Text-highlight：強調字體顏色
- background：背景色
- background-secondary：次背景色

因為還有 Dark-mode，所以需要兩套配色。當然，每一個部落格設計都不同，很有可能在顏色上有增減，但基本一定需要定義的是字體和背景色（不然要怎麼看內容...），下面是自己這個階段定義出來的色盤：

![](/img/posts/lavi/blog-log/Pasted%20image%2020211026222438.png)

在這個階段會先做一個非非常簡單的文章 Mockup，能夠比較好想像顏色組合的結果，也可以先在這個階段初步的避免掉易讀性的問題。

![](/img/posts/lavi/blog-log/Pasted%20image%2020211026222708.png)

在這個階段自己顏色只是抓一個方向，在最後開發的時候還會在明度、彩度上根據易讀性作更精細的調整。

### 元素

設計過程比較特別部分在於，自己是先從文章內容中的元素開始設計，文章中有哪些元素呢？這並不是太難的問題，基本上 Markdown 裡面有哪些元素，文章中就有哪些，可以找一些 markdown-demo 來確定有哪些元素。這邊簡單列舉

行內元素樣式：**粗體**、*斜體*、~~橫線~~、[連結]()、`code`等

區塊元素樣式：
- 內文段落 paragraph
- 標題：h1~h6
- order list, unordered list
- 引用區塊 quoteblock
- codeblock
- 分隔線
- Table

在設計區塊樣式時，除了要滿足單一元素的使用情境，而凸顯元素使用情境的方式在於和其他元素之間做出區別。

在設計的時候可以先把最簡單的內文段落（paragraph）樣式設定出來（包含字距、行距等），然後把內文作為最基礎的樣式來做變化。

像是清單（order list/ unordered list） 主要的目的是要能夠清楚的列出項目，那在行距上就需要再大一點，來和內文做出區別。

還有像引用區塊的文字，本身視覺上是不是真的帶來「引用」的感覺（通常的設計在左邊會有直線，或者是放在方框裡面），並和普通的段落有所區別。都是在設計的時候需要思考的。

除了個別的樣式外，在區塊會有兩不同類型的互動，一種是相鄰，另一種是嵌套。

在兩相鄰區塊的設計上，就必須要注意區塊間距的拿捏，需要在比行距還要大、但又不能過大導致太分離難以閱讀。而在嵌套上，像是 list 和 quoteblock 能夠再包住其他區塊像是其他 list，這時如何同時內外兩層元素樣式的融合是需要思考的部分。

在使用 Figma 設計時有一個訣竅，可以上述每個元素都做成 Figma 的 Component，並在旁邊直接互相組合排列，模擬真實的文章，來檢視自己的設計。

![](/img/posts/lavi/blog-log/Pasted%20image%2020211026231304.png)

### 頁面和區塊

當個別元素完成後，就能夠以頁面為單位來進行設計了。在設計每個頁面時，會以先前的元素作為基礎，進行調整及組合後，來構成頁面上面的元件。舉例來說，這是主頁面的文章列表，基本上就是由多個文章項目排列而成

![](/img/posts/lavi/blog-log/Pasted%20image%2020211027220350.png)

而在每個文章項目都是由原本文章中的元素（標題、內文段落等等）做樣式上的調整後再進行組合。

- 在文章標題上，就直接採用 H1 標題的樣式
- 標籤則是連結的樣式，所以帶有 `hever:underline` 的效果
- 時間上，基本上是內文段落的樣式（顏色、字距）但使用襯線體的字型做出區別
- 概要也是內文段落的樣式，但運用顏色做出區別
- 分隔線就直接採用文章的分隔線


除此之外不同頁面之間的元件，如果資訊架構上相似的話，也是可以共用的。像是自己的主頁文章列表和標籤文章列表的樣式基本上就沒有太大差異，只是缺少了上方的 tag 而已。

![標籤頁文章列表](/img/posts/lavi/blog-log/Pasted%20image%2020211027232241.png)

將元素重組的好處一來是省時間，二來是整體的樣式會比較一致，當然缺點就是看起來會比較呆板無變化。相信好的設計還是能夠在樣式和一致性上取得平衡，但自己能力有限，也希望讀者把注意放在文章上，樣式的變化就比較次之。


## 開發

再來是開發，這裡先提一下使用到的開發上使用的工具。自己在開發上是用 eleventy 這個 stactic site generator（後面簡稱 11ty）。一開始其實沒想過這個選擇，身為 React 仔，一開始的方案其實是朝 Gatsby 或者是 Next，覺得還可以順便寫熟悉的 React 根本是一舉兩得，不過拖延症卻讓自己遲遲還沒開始動工。

後來因為在 [Errorbaker](https://blog.errorbaker.tw/) 上參與共筆部落格，而部落格本身也是用 11ty 寫的。了解後發現是個輕量的選擇，想想與其要花時間在學習新的框架，那不如就先採用個簡單的方案，看看能不能在短時間內就把部落格架起來（寫完之後，自己的答案是不太行🥲）。

那在這部分也會提一下自己使用 11ty 和 [  
eleventy-high-performance-blog](https://github.com/google/eleventy-high-performance-blog) 這個 template 的心得，以及自己額外做的處理。



### Eleventy

消毒一下，這裡是非常個人的心得，好不好用本身和每個人的道行很有關係。

如果想要多了解 11ty 可以先參考前輩的這兩篇

- [除了 hexo，也可以考慮用 eleventy 來寫技術部落格](https://blog.huli.tw/2021/08/22/eleventy-over-hexo/)
- [為什麼我離開 Medium 用 eleventy 做一個 blog](https://jason-memo.dev/posts/why-i-leave-medium-and-build-blog-with-eleventy/)

11ty 基本的用法需要搭配 template language 來 compile 出 html，標配是 nunjucks，不過也可以用自己喜歡的 template language 像是 Pug, ejs, Mustache 等等，或者官方也有提到可以直接使用 JS 來 compile。

那除了利用 template language 外，寫文章的部分

在 build 的過程中，11ty 可以自由選要用什麼樣的 parser 來解析語法，在[官方的 base-blog 中](https://github.com/11ty/eleventy-base-blog/blob/master/.eleventy.js#L68)使用 [markdown-it](https://github.com/markdown-it/markdown-it) 做為 markdown parser（hight-preformance 也是），所以如果想要調整 markdown 解析出來的 html 或者新增功能，就只需要更改 config 或者新增 plugin 上去即可。

### Nunjucks

Nunjucks 本身語法不算複雜，如果有接觸過模板語言或者只是作一些內容的調整非常容易。但畢竟還是有學習曲線，再一些複雜的調整還是需要更深入的理解語法，而且語法本身寫起來稍微比較像早期的 PHP，比起平常常接觸的 JSX 起來並沒有那麼自然。但這可能不是好的比較，也才寫過幾天的 PHP。

Nunjucks 本身也有提供一些非常基本的操作，用這些操作來組合成需要的頁面功能如果比較複雜的話自己覺得頗有難度。在 11ty 中如果要操作模板引擎很方便，有提供 API 來統一操作。這樣一來就能夠在 `eleventy.js` 這個檔案中使用 JS 寫出需要的 filter ，再拿到 Nunjucks 裡面做使用。

這樣一來比起單純使用 11ty 和 Nunjucks 的語法組合功能會方便非常多。像是利用正則就可以做到像是下方的 summary （參考自 [Errorbaker source code](https://github.com/Lidemy/error-baker-blog/blob/main/_11ty/summary.js) ）

```text
&lt;!-- summary --&gt;
這邊是摘要 
&lt;!-- summary --&gt;

這邊開始才是本文
```
 
在撰寫 Nunjucks 就能時使用下面的 custom filter 來做到渲染 tag 內部的內容：
 
```text
&lt;p&gt;&#123;&#123;post | summary &#125;&#125;&lt;/p&gt;
```
 
產生出的 HTML：
 
```text
&lt;p>這邊是摘要&lt;/p&gt;
```

不過在寫 custom filter 的時候需要知道 11ty 本身給的資料結構，自己在文件裡面一直找不到一份齊全的資料，只能在 custom filter 內部 print 出來後輸出到 log 裡面看，導致花了蠻多的時間的。

此外 Nunjucks 可能太少使用者，有一點蠻影響開發體驗的是 VScode 似乎沒有對應的 Formatter（有 extension 但無法使用），這個時代還要要手動 Prettier 真的非常之惱人，還有 syntax highlight 常常也有問題。

### eleventy-high-performance-blog

自己是基於 [eleventy-high-performance-blog](https://github.com/google/eleventy-high-performance-blog) 這個 template 來改造搭建的。既然都叫 high-performance 了，那當然做好做滿的就是性能優化，先附上 lighthouse。

![圖片來源：https://github.com/google/eleventy-high-performance-blog](/img/posts/lavi/blog-log/Pasted%20image%2020211028230922.png)
![自己部落格的 lighthouse 評分](/img/posts/lavi/blog-log/Pasted%20image%2020211028230907.png)

可以看到滿滿的綠燈，就算自己改過不少內容，Performance 還是達到 99 分。可以看到 github 上面的介紹：

> -   Perfect score in applicable lighthouse audits (including accessibility).
> -   Single HTTP request to [First Contentful Paint](https://web.dev/first-contentful-paint/).
> -   Very optimized [Largest Contentful Paint](https://web.dev/lcp/) (score depends on image usage, but images are optimized).
> -   0 [Cumulative Layout Shift](https://web.dev/cls/).
> -   ~0 [First Input Delay](https://web.dev/fid/).

果然是 Google 內部開發的 template，優化真的是完全做好做滿。在這個 template 覺得最大的優點在圖片方面處理的非常之好，對於 Blog 這種本身沒有 SPA 也不用另外 fetch 資料的網站來說，處理好圖片幾乎就解決效能上 90% 的問題了。這邊簡單提一下自己使用這個 template 的心得。

#### 圖片優化

會把 markdown 中以網址插入的圖片 fetch 下來 local，還會做響應式圖片，以及載入的優化，像是：

1. 多寬度圖片大小
2. 優化
3. async decode, lazy loading 以及 `content-visibility: auto`
4. 轉檔（webp, avif）
5. loading 時的 blurred placeholder

尤其是第四點自己還是第一次看到把 jpg 檔案再轉換成模糊的 svg 的做法，做出來的 placeholder 一來體積小，還可以利用 baseUrl 直接放進 HTML，二來又能增進 Web vital 的 [**CLS**](https://support.google.com/webmasters/answer/9205520?hl=en#cls_description) 分數，而且因為是模糊的圖片，體驗上會比單純的 image placeholder 優雅許多。

但也是有對應的 tradeoff 就是，這個 template 最大的問題就是在 server 上 building 時，可能因為規格較弱，所以常常在轉換圖片卡住導致 building error，對應的處理會在後面部署的部分提到。

#### CSP

template 本身有透過 `<meta>` 來做 [CSP](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)，可以限制網頁上各種資源的來源，來避免 XSS 等攻擊。 

如果要引用外部資源，像透過 uri 來存取像是 CSS, script 或者是字型時，在 CSP 就要另外做設定。行內 inline script 也要記得加上指定的 attribute 來建立 hash。 

#### CSS

在 CSS 部份的優化方式上，是使用 [Bahunya CSS](https://kimeiga.github.io/bahunya/). 這個  classless framework，Bahunya CSS 本身沒有用到 class，只使用 element selector 來減少 CSSOM 解析負擔。

除此之外 CSS 你可以看到 template 裡面並沒有用 link 來載入 url 檔案。所有的 style 會先經過 purge CSS 來做 tree shake，去掉頁面不需要的 css 之後，再利用 style 插入到 `<head>` 裡面來減少 request 的次數。

不過這樣也造成一點問題就是，一個問題是基於 Bahunya CSS 上再做 customize 不太方便，最後幾乎原本的 CSS 都刪光光了...，還有預設的 purge CSS 會清除掉冗餘的 css variable 還有 font-face，不過自己在使用時有點問題，如果是多層 reference 的 variable 使用似乎就不會被解析而被刪掉。

另外這個時代還要寫純 CSS 真的 非 常 痛 苦，後來加入了 postcss 使用 import 還有 nesting 的功能。個人看法在 CSS 上只要有這兩樣功能在開發體驗上就會好非常非常多，沒有必要一定得用 Scss。

---

關於這個 template 不知不覺提了很多，自己也還沒有研究的非常完全，像 SEO 的部分自己還是不太熟悉。如果你是剛好再用 11ty，還是很推薦說可以看看這個 template 做了哪些事情，用了那些套件去做到的。

## 搬家

開發完之後就可以搬家囉

我的原本的發佈平台主要有兩個： CoderBridge 以及 Medium。Coderbridge 本身有提供輸出 markdown 的功能，非常的方便，但是 Medium 竟然只能下載整包的 HTML 😕。

自己使用 [Medium to markdown](https://www.npmjs.com/package/medium-to-markdown) 這個小工具來做轉換，先到 Medium 上面把自己的備份下載下來，然後再轉換就可以。但轉換後的 Markdown 也依然要做整理，沒辦法做到無腦轉換。幸好自己的文章內容不算多，比起常常在 PO 文的作者整理起來還不算太複雜。

## 部署

最後是部署，自己是參考[文中](https://jason-memo.dev/posts/why-i-leave-medium-and-build-blog-with-eleventy/) 的方式，利用 [vercel](https://vercel.com/dashboard) 來做部署。

第一次使用 vercel 的體驗蠻好的，介面很清楚使用起來也蠻簡單。但是就像前面提到的，在圖片轉換部分一直 build失敗，後來的做法是直接把整個網頁 build 出來並加入 git，而且並不使用內建的 11ty setting，而是當作 static site 來部署。

![](/img/posts/lavi/blog-log/Pasted%20image%2020211031021955.png)

這樣一來就暫時避免掉 build 的問題，雖然解法似乎不是很優雅就是了。

## 未來
在完成這個部落格的時其實算是抱著完成 MVP 的心態去做的，這邊列下自己在這次的部落格中沒有做到，或者是未來可能希望再重新的部分：

- CSS 原本想用 tailwind 來處理，
- SEO 部分，目前還不太了解怎麼實作
- 這次 Logo 模仿~~抄襲~~ vercel 暫時先弄個三角形，之後有想法再補上
- 認真做個 og image

除此之外也還有一些樣式上的 bug 要處理就是。不過總算是有一個自己的平台可以開始累積內容 🙂。

Big guy is john，感謝大家的觀看。




