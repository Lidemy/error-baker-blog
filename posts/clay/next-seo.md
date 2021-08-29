---
title: next-seo 初體驗
date: 2021-08-30
tags: [JavaScript, next.js, SEO, schema]
author: clay
layout: layouts/post.njk
---


<!-- summary -->
<!-- 想要為 next.js 開發的網站做 SEO 嗎？或許你可以先考慮 next-seo -->
<!-- summary -->

### 緣起
前陣子曾經在處理公司網站上的 SEO，原本只是要修復一個小小的 bug，但因為過去沒有接觸過太多有關網站 SEO 的經驗，就決定從頭開始查詢研究

由於網站是用 next.js 框架建構的，最初的處理方式，是將我們使用到一些會影響 SEO 的 `<meta>` 或是 `<link>` 加進去 next.js 提供的 `<Head>` Component，大概就是像以下這種形式：

```js
const Page = () => (
  <>
    <Head>
      <title>Error Baker</title>
      <meta property="og:title" content="Error Baker" />
      <meta property="og:url" content="https://blog.errorbaker.tw/" />
      <meta property="og:image" content="https://blog.errorbaker.tw/official-smo.jpg" /> 
      <meta property="og:description" content="Welcome to Error Baker" />
      <link rel="canonical" href="https://blog.errorbaker.tw/" />
      <link href="https://blog.errorbaker.tw/media/favicon.png" rel="icon" />
    </Head>
    <Component>
      ...
    </Component>
  </>
)

```

上面是單單一頁的寫法，看似沒什麼問題，然而我們之所以會選用 next.js 框架，就代表我們絕對會有各式各樣的 page

如果這些 SEO 相關 tag 都由同一位工程師負責，那倒也沒什麼太大問題，但是當各個頁面都要做自己的 SEO 相關 meta，或者當一個專案中的各種 page 都各自由不同工程師開發時，就可能會有開發模式紊亂的狀況。

或許你會想問，單單就幾個 `meta` 與 `link` tag，即使放置錯誤也不會影響到功能，似乎日後再行標準化也沒什麼關係，是嗎？

從功能面上來看，的確是不會影響到網站本身的功能，我原本也是這樣以為的，直到我有一日瞥見了 *next-seo* 這個套件，才發現事情似乎沒有我想的這麼簡單。

### next-seo 的 `<NextSeo>` Component

*next-seo*是一套專門處理 next.js 網站的 SEO 套件工具，若要簡單描述它的使用方式，就是使用套件為我們準備好的 Component，將一些我們需要的 props 帶入其中，它就會幫我們 render 出我們需要的 HTML tag。

如果將上面包在 `<Head>` 內的 tag 改為使用 next-seo 處理，就會如下方呈現：

![](/img/posts/clay/next-seo/12.jpg)

`<NextSeo>` 會幫我們 render 出與 props 相對應的 HTML tag，並且我們不用再將 `<NextSeo>` 包在 `<Head>` 裡面，next-seo 已經幫我們處理好了這件事。

這麼做有一個好處，就是如果在各頁面我們單純只用 `<Head>` 來處理上述等 SEO 相關 tag 的話，我們就可以不用它了。`<Head>` 在 next.js 中的使用會需要特別留意，這裡未來有機會再寫一篇文章來講述 `<Head>` 的正確使用方式。

`<NextSeo>` 還有另外一個好用的地方，就是當我們會需要自定義一些 `<NextSeo>` 沒有提供的方法時，可以使用 `additionalLinkTags` 與 `additionalMetaTags` 來加上 `<link>` 與 `<meta>`：


![](/img/posts/clay/next-seo/13.jpg)

可以用簡單的對應方法來比對，在 `<NextSeo />` 中，`openGraph` 這個 props 內的 `url`、`title`、`description` 與 `images`，分別對應了以下四個 HTML tag：

```js
  <meta property="og:title" content="Error Baker" />
  <meta property="og:url" content="https://blog.errorbaker.tw/" />
  <meta property="og:image" content="https://blog.errorbaker.tw/official-smo.jpg" /> 
  <meta property="og:description" content="Welcome to Error Baker" />
```

如果接著來看官方的範例，可以看到更多 props，如果你是像我一樣剛接觸 SEO 的新手，應該會對 `<NextSeo>` 內還有 `twitter` 這個 props 滿驚喜的，我也是看到文件的描述才知道原來我們也可以做一些友善其他社群平台的 SEO 標籤：

![](/img/posts/clay/next-seo/1.jpg)

`<NextSeo>` 這個 Component 幫我們處理掉了一些基本 SEO 所需要的 tag，也包括了網頁標題與 icon 等等

另外，我覺得更棒的一點是由於 next-seo 支持 TypeScript 型別檢查，所以當你沒有按照規範輸入 props 或是少寫了某些必要的 props，就會跳出 TS Error：

![](/img/posts/clay/next-seo/2.jpg)

如此一來可以更有效的標準化不同開發者的開發內容，若是搭配 ESLint 或是 husky 等檢查工具，更能使開發過程不易出錯。

### 初探 JSON-LD

在繼續介紹 next-seo 之前，我們先來簡單描述什麼是 JSON-LD

JSON-LD 全名為 JSON for Link Data，它是結構化資料的一種，的目的是讓我們網站上一些關鍵字，有了這些關鍵字，就能更好的被搜尋引擎爬到資料，增加網站的曝光率，並能讓搜尋引擎更好地判斷我們網站中的內容，

當然結構化資料有很多，有微資料 (micro data) 與 RDFa 等等，加上要好好講解 JSON-LD 又可以另外再寫一篇了 XD，這裡就留個小伏筆，先來看範例

我這裡隨便找了一個網站中的[商品](https://drop.com/buy/drop-sennheiser-hd-8xx-headphones)，並在網站中開啟 devtool，搜尋 `ld+json`，來看一下它的 JSON-LD Script：

![](/img/posts/clay/next-seo/03.jpg)

將其展開看看：

```html
<script type="application/ld+json">
{
  "@context":"http://schema.org/",
  "@type":"Product",
  "name":"Drop + Sennheiser HD 8XX Headphones",
  "image":"https://massdrop-s3.imgix.net/product-images/drop-sennheiser-hd-8xx-headphones/FP/CFpa6gMaTgoQryuKz9CQ_PC.png?bg=f0f0f0",
  "description":"The HD 8XX is based on the HD 800S; a flagship audiophile headphone produced by our partners at Sennheiser. Like the HD 800S, the HD 8XX is made in Germany at Sennheiser’s HQ factory. Based on community requests, we worked with Sennheiser to tune the housing resonance to add low end extension...",
  "sku":"drop-sennheiser-hd-8xx-headphones",
  "gtin12":"810027786159",
  "brand":{
    "@type":"Brand",
    "name":"Drop + Sennheiser"
  },
  "offers":[{
    "sku":"MDX-35505-1",
    "name":"Drop + Sennheiser HD 8XX Headphones",
    "price":1100,"availability":"http://schema.org/InStock",
    "gtin12":"810027786159",
    "@type":"Offer",
    "url":"https://drop.com/buy/drop-sennheiser-hd-8xx-headphones",
    "priceCurrency":"USD",
    "itemCondition":"http://schema.org/NewCondition",
    "priceValidUntil":"2021-11-25T07:59:00Z",
    "validThrough":"2021-11-25T07:59:00Z",
    "validFrom":"2021-02-18T17:00:00Z"
  }]
}
</script>
```

哇，看起來密密麻麻的，好像很複雜的樣子，不過如果仔細看內容，會發現好像也沒有到很難理解，比如說 `name` 就是對應到商品的名字，`description` 就是產品描述，`gtin12` 就是商品序號，以此類推

這些 JSON 資料被放在 `<script>` 裡面，讓搜尋引擎可以更好的辨識我們的產品，要實作的話也不難，只要在網站中寫一個 function 來生成 JSON 檔案就好：

```js

const convertProductToJsonLd = (product) => {
  const ldJSON = {
    name: product.name,
    '@context': 'https://schema.org/',
    '@type': 'Product',
    image: product.image,
    description: product.description,
    brand: {
      '@type': 'Brand',
      name: 'Drop + Sennheiser',
    },
    gtin12: product.id,
    offers: {
      '@type': 'Offer',
      url: product.url,
      priceCurrency: 'USD',
      price: product.price,
      priceValidUntil: '2021-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
    },
  }

  try {
    return JSON.stringify(ldJSON)
  } catch(err) {
    console.log(err)
  }
}
```

生成之後，將其內容放入 `<script>` tag 中，這樣就算是完成了，概念上並不難理解，

但除此之外，這些資料的內容其實是有規範的，我們可以在 https://schema.org/ 中閱讀相關文件，至於 Schema.org 的核心概念，就如同網站首頁中所敘述的一樣，重點是在以下這句：

> Founded by Google, Microsoft, Yahoo and Yandex, Schema.org vocabularies are developed by an open community process, using the public-schemaorg@w3.org mailing list and through GitHub.

Schema.org 中的文件規範是由 Google、Microsoft 與 Yahoo 等知名公司共同制定的一套規範，如果再深入探討，可以看到內中有不少給開發者的開發建議，撰寫更有意義的語義化標籤等等，這份文件目前也有[中文版](https://schema.org/) (雖然是簡體)，有興趣的讀者可以好好研究裡面的內容，

而 JSON-LD 的一些建議欄位在 schema.org 中其實也有跡可循，但本篇就先不帶大家看文件了，我們換個方式，先來看看 next-seo 是如何處理 JSON-LD。

## 使用 next-seo 提供的 JSON-LD Component：

JSON-LD 是 next-seo 另外一個主打的重點項目，如果查閱文件，你會看到其中有不少範例：

![](/img/posts/clay/next-seo/4.png)

當初第一次研讀文件時，我本來以為這些 Component 都只是官方舉出的範例，但實際比對過之後發現並非如此。

如同之前提到的，JSON-LD 的內容是已經經過標準化的內容，以目前最大的搜尋引擎 Google 來說，就定義了如下圖紅框處各種情境的 JSON-LD 格式：

![](/img/posts/clay/next-seo/5.png)

我們挑選 [Product](https://developers.google.com/search/docs/advanced/structured-data/product) 這個結構化資料，並查閱其內容，可以看到 Google 這裡已經建議我們可以如何生成與商品相關的 JSON-LD：

![](/img/posts/clay/next-seo/6.jpg)

再回頭來比對 next-seo 提供的 [`<ProductJsonLd >`](https://github.com/garmeeh/next-seo#product) Component，你會發現一個驚人的巧合：

```js
import { ProductJsonLd } from 'next-seo';

const Page = () => (
  <>
    <h1>Product JSON-LD</h1>
    <ProductJsonLd
      productName="Executive Anvil"
      images={[
        'https://example.com/photos/1x1/photo.jpg',
        'https://example.com/photos/4x3/photo.jpg',
        'https://example.com/photos/16x9/photo.jpg',
      ]}
      description="Sleeker than ACME's Classic Anvil, the Executive Anvil is perfect for the business traveler looking for something to drop from a height."
      brand="ACME"
      color="blue"
      manufacturerName="Gary Meehan"
      manufacturerLogo="https://www.example.com/photos/logo.jpg"
      material="steel"
      slogan="For the business traveller looking for something to drop from a height."
      disambiguatingDescription="Executive Anvil, perfect for the business traveller."
      releaseDate="2014-02-05T08:00:00+08:00"
      productionDate="2015-02-05T08:00:00+08:00"
      purchaseDate="2015-02-06T08:00:00+08:00"
      award="Best Executive Anvil Award."
      reviews={[
        {
          author: {
            type: 'Person',
            name: 'Jim',
          },
          datePublished: '2017-01-06T03:37:40Z',
          reviewBody:
            'This is my favorite product yet! Thanks Nate for the example products and reviews.',
          name: 'So awesome!!!',
          reviewRating: {
            bestRating: '5',
            ratingValue: '5',
            worstRating: '1',
          },
          publisher: {
            type: 'Organization',
            name: 'TwoVit',
          },
        },
      ]}
      aggregateRating={
        ratingValue: '4.4',
        reviewCount: '89',
      }
      offers={[
        {
          price: '119.99',
          priceCurrency: 'USD',
          priceValidUntil: '2020-11-05',
          itemCondition: 'https://schema.org/UsedCondition',
          availability: 'https://schema.org/InStock',
          url: 'https://www.example.com/executive-anvil',
          seller: {
            name: 'Executive Objects',
          },
        },
        {
          price: '139.99',
          priceCurrency: 'CAD',
          priceValidUntil: '2020-09-05',
          itemCondition: 'https://schema.org/UsedCondition',
          availability: 'https://schema.org/InStock',
          url: 'https://www.example.ca/executive-anvil',
          seller: {
            name: 'Executive Objects',
          },
        },
      ]}
      mpn="925872"
    />
  </>
);

export default Page;
```

將上述程式碼與 Google 官方文件的提供的格式一比對，你會發現兩者近乎相同，這就代表在大多數情況下，next-seo 已經幫我們都規範好了相關內容，為什麼這樣說呢？

還記得我們稍早有提到的 TS Error 嗎？在 `<NextSeo>` 中看似還不太有用，但是在使用 LD-JSON Component 時幫助可就大了，當我們輸入了一些不符合的 LD-JSON 欄位或是少加一些必要的資料，TypeScript 就會報錯：

![](/img/posts/clay/next-seo/7.jpg)

看看是哪裡錯誤：

![](/img/posts/clay/next-seo/8.jpg)

另外，我們可以從這一點推斷，next-seo 應該也會隨著 Google or Schema 的規範變動而跟著更新，

舉個例子，之前在使用 `next-seo 4.25.0` 版本的時候，我在 `<ProductJsonLd />` 中的 `aggregateOffer` props 中增加 `offers`，卻一直噴錯：

![](/img/posts/clay/next-seo/9.jpg)

但這裡百思不得其解，因為去追 next-seo 上的原始碼，是有定義 `offers` 的，直到再看仔細一點，才發現這個 `offers` 其實是在兩個月前剛加上去的：

![](/img/posts/clay/next-seo/10.png)

查找相關 issue，以 `aggregateOffer` 為關鍵字可以查到[這一則](https://github.com/garmeeh/next-seo/issues/766)，我猜應該就是這篇 issue 促使了這次改動，這裡我在更新到了 `4.26.0` 版本獲得了解決

附帶一提，該 issue 提到 `offers` 應該是可以被包含在 `aggregateOffer` 之中，而這個規範我們可以在 schema.org 中可以找得到：

![](/img/posts/clay/next-seo/11.jpg)

綜上所述，有了 next-seo 內建的型別判斷，可以讓我們標準化不同開發人員撰寫 SEO 程式碼的風格，也可以藉由 next-seo 提供的各種 Template Component，防止我們寫出錯誤的資料格式，也幫助我們更方便地 render 出 LD-JSON，而且一樣不需要自己撰寫 `<script>` 並將其包在 `<Head>` 之中，使整體程式碼與架構更加純粹。

## 結語

開頭有說到，開始研究 next-seo 之後，才發現事情並沒有自己想像得這麼簡單，主要的原因是看完文件的使用之後，才發現自己原本認知的網站 SEO 知識實在是太微不足道了。

試想，在競爭激烈的市場中，如果我們今天我們開發的是購物網站或是形象網站，那麼關於 SEO 的優化就會非常看重，沒有好好處理這一塊，輕則客戶沒辦法很好搜尋到你的網站，重則可能會被 Google 搜尋引擎列為拒絕往來戶 (比如說一些不當的操作或是給予錯誤的結構化資料)。

而處理 SEO 麻煩的地方在於，他很難光靠本機的開發測試就能去得到一個百分之百確定的結果，我只能說我的 SEO 可以相對變好，但很難去保證絕對會被客戶搜尋到，這也是一個很深的坑。

另外，關於 next-seo，還有一些細節沒有提到，比如一些特殊的 props 與 `DefaultSeo` 等等，但基本的入門應該已經足夠了，藉由此次練習 next-seo 的使用，讓我有以下的收穫：

1. 了解 next-seo 套件可以更好的標準化我們處理網站中 SEO
2. 學習如何使用 next-seo (局部)
3. 了解 Google 已經為結構化資料有建議使用的 schema，可以照其規範實作

另外，自己也曾與同事討論過，當 schema.org 更新規範內容時，next-seo 是否可以跟上規範並持續更新？

後來想想，只要掌握 next-seo 的概念，其實我們也可以自己寫一些 library 或是函式來處理，一些套件可以解決的，我們使用套件，套件解決不了的，就自己動手即可

最後，不論各位是選擇自己建構 LD-JSON 或是使用 next-seo，都可以使用以下兩個工具來檢測生成的資料格式是否符合搜尋引擎的需求：

1. Google Rich Result Test: https://search.google.com/test/rich-results?hl=zh-tw
2. https://validator.schema.org/

感謝您閱讀完上述的文章，如果有描述錯誤或資訊不齊的部分，請再麻煩留言給我，十分感謝你光臨 Error Baker 🙏

## 參考資料
- https://developers.google.com/search/docs/advanced/structured-data/product
- https://schema.org/
- https://github.com/garmeeh/next-seo
- [JSON-LD, 決定未來 SEO 的 25 項標準與通訊協定系列 II](https://ithelp.ithome.com.tw/articles/10186398)