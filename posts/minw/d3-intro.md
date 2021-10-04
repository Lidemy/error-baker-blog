---
title: 再看 D3.js
date: 2021-10-03
tags: [data-vis]
author: minw
layout: layouts/post.njk
---

<!-- summary -->

從以前就很喜歡資料視覺化，經過半年比較沒有接觸到數據相關的服務，終於在近期一口氣做好做滿，趁著機會整理一下之前寫過對於資料視覺化的想法，把關於開發的部分補上，作為 D3 使用的紀錄。

<!-- summary -->
<!-- more -->

## 關於資料視覺化

生活中充斥著資料，但是看看這些資料原始的樣貌：看到了一堆數字，但沒有任何的「感覺」，甚至覺得頭很大，很難在一秒之內找到最大的數字、最小的數字、也不知道變化多大、甚至要從裡面看看這個資料是對是錯都很困難。

為了讓這些資料不要躺著生灰塵、可以讓人們可以更方便的討論、理解它們，有人先從花時間用表格替這些資料對齊、分類變得更好閱讀，到後來大家找到更好的方法：把這些資料變成有助於人們看懂的圖。

資料視覺化就是在把這些「象徵」轉換成「圖像」的過程，這件事是在任何媒體上都可以發生的事情。

從目的上，這件事可以沒有特別的功能性，以藝術表現為主，像是 Generative Art，也可以為了傳遞資訊來設計，像是狹義的資料視覺化，產生各種圖表。甚至這兩者本身的界線就不是這麼明確，例如：[Variable 工作室](https://variable.io/) 的 Data Art 作品。或我不要視覺化，我要「物體化」！沒問題，當然可以在實體物體上發生，像是：Data Physicalization [^5]。

但一般印象裡，圖像是連續的、一體的，資料是離散的、分開的，這兩件事要怎麼轉換在一起？

除了思考資料與圖像的轉換外，還需要的是透過程式把資料轉換成網站可以懂的語言。剎那間，有各式各樣的工具百花齊放，例如：Highchart.js, Chart.js ... 它們都是從更高層的 function 來打包各種圖表，意思類似於：你呼叫一個 function 設定一些參數、就跑出基於網頁元素的一張圖。

這樣很方便沒有錯，但這樣距離原本轉換的概念太遙遠了。如果要客製化、還要學習新套件的標準而且也沒有效率，而 D3 的美學在於，我們可以基於我們對 DOM 的理解、直接控制 DOM 元素，直接對應了一般對資料視覺化的想像。

## 資料跟圖像

既然圖像是完整的那就分解它，既然資料是分散的那就聚合它，前人替我們將視覺分析成一系列的元素，並替資料們分了幾大類，於是乎這兩件事就可以對應在一起了 [^3]。

### Visual Encoding

![](https://www.oreilly.com/library/view/designing-data-visualizations/9781449314774/httpatomoreillycomsourceoreillyimages898026.png)

Visual Encoding 將圖像分解，拆解可以由點到面，分別可以有尺寸、形狀、色相、飽和度、亮度及方向上的變化，更進階的我們可以讓視覺元素重複，便呈現出了樣式、或調整視覺元素與週遭的關係。

但當將圖像拆解到基本組成時，會發現各種圖像都有其特質，例如：線條可以有粗細、方向性、樣式，適合呈現關聯性、粗細可以表達等級，但不適合用來呈現類別，這創造了無限多種適合與不適合的元素去對應數據。

### Data Type

同樣的，分散的資料可以聚合成最基本幾種分類 [^4]：

- 類別 (nominal)：這種資料之間沒有數值關係、也沒有順序關係，只是項目之間有不同，例如：性別、宗教。
- 等級 (ordinal)：這類型的資料之間有順序關係，但不是基於數值，也不能運算，例如：不同意、同意、非常同意。
- 等距 (interval)：這類型的資料之間有順序、也有實質數據上的意義，但不能代表真實世界的意義，只是一種指標，例如：溫度（0 度不等於沒有溫度）。
- 等比 (ratio)：這類型的資料不但有順序、有數據上的意義、也有真實世界的意義，例如：人數、收入、年齡。

資料看起來只有上述四種，卻已經足夠複雜，因為我們可以將許多數據疊加在同一個圖表上，

而資料視覺化就是在挑戰資料與視覺之間的可能性的一個領域，了解什麼樣的轉換最能達成不同的目的？並隨著有越來越多元的資料被揭露出來，從無意義的資料、到有意義的、數據分析、預測...，搭配更多的呈現手法，例如：動畫、互動、甚至走向沈浸 VR... 資料視覺化依舊是一個欣欣向榮的領域。

## D3 怎麼做到的

講了許許多多的資料視覺化，回歸到我們焦點 - 網站怎麼實現這檔事？

除了思考資料與圖像的轉換外，還需要的是透過程式把資料轉換成網站可以懂的語言。剎那間，有各式各樣的工具百花齊放，例如：Highchart, Chart ... 它們都是從更高層的 function 來打包各種圖表，意思類似於：你呼叫一個 function 設定一些參數、就跑出基於網頁元素的一張圖：

這樣很方便沒有錯，但這樣距離原本轉換的概念太遙遠了。如果要客製化、還要學習新套件的標準而且也沒有效率，而 D3 的美學在於，我們可以基於我們對 DOM 的理解、直接控制 DOM 元素，直接對應了一般對資料視覺化的想像：

D3 透過四個系列工具來處理資料的轉換：

- Data：將資料轉換成 D3 Modules 需要的形式。
- Modules：將資料轉成 SVG 需要的內容。
- Selections：將轉換後的資料塞進 DOM 元素之中。
- Interaction and Animation：透過時間跟互動來更新資料的變化。

而這是 2011 年時 D3 提出時的架構 [^1]，回到 2021 的現代，前端框架已經流行了好幾年，去年很幸運看到 Shirley Xu 在 React + D3 的分享 [^2]，從此打破了我過去看到大多數教學推薦的 D3 使用方法，也讓我開始更容易了解 D3 在做什麼。

## 在開始 D3 之前

約略知道了 D3 的轉換過程，會發現這個過程中對 SVG 的了解很重要，因為最終轉換會轉成 SVG Element，所以要了解我們轉換的結果要如何對應到 SVG 之中，不過 SVG 的說明很瑣碎，所以接下來的說明不會再贅述關於 svg, rect, path, line 等等的不同跟使用方法，所幸 SVG 的使用也很直覺，可以直接參考 MDN 的介紹。

### D3 original : Data In, Data Out 

接下來就先從最常見的，利用 D3 內建的 function 來看轉換的過程是怎麼成立的，以下是一個很簡單的數據：

```csv
category,value
1,12394
2,6148
3,1653
4,2162
5,1214
```

這是一個有五筆的 category 對應 value 的數據，category 屬於類別資料，value 可能屬於等比或等距資料，視資料含義而定。 接著我們要使用上面的數據建立一個最簡單的 Bar Chart，在建立轉換之前，我們要做的是範圍對範圍的轉換，簡言之，定義數據跟圖之間的縮放關係，讓我們知道數字的值會讓圖像的座標、長寬轉換成對應畫布上的多少：

```js
const margin = ({top: 30, right: 30, bottom: 70, left: 60});
const height = 300
const width = 600
const xRange = [margin.left, width - margin.right];
const yRange = [height - margin.bottom, margin.top];
```

首先先定義最後要轉換出來的畫布的邊界大小。

```js
const xExtent = [0, data.length]
const yExtent = d3.extent(data, d => Number(d.value))
```

接著定義數據的邊界大小，通常是數據的最大最小值。這兩個步驟是為了讓我們做到這件事情：

![](https://imgur.com/T40fZnA)

```js
const x = d3.scaleBand()
      .domain([0, data.length])
      .rangeRound(xRange)
      .padding(0.1)
      
const y = d3.scaleLinear()
        .domain([0, yExtent[1]])
        .range(yRange);
```

接著透過 D3 提供的 scale 代入兩者的邊界轉換關係，D3 有提供不同的 Scale 類型，剛好處理的就是我們提到的數據種類的議題，舉例來說：分類資料的縮放就會是離散的、一個個的、有邊界的，而線性資料就會是連續的對應，而這邊的這個轉換方程式就可以用於將數據對應到圖像資訊：

![](https://imgur.com/6vqRAAb)

當我們把數據轉換器設定好後，接下來透過 D3 提供的 data method 來將數據狀態對應到剛剛的 svg 元素中，並執行轉換：

```js
const svg = d3.select("svg")
      .attr("viewBox", [0, 0, width, height]);

svg.append("g")
      .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.category))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth());

```

使用 D3 選取 svg 後，因為是柱狀圖，我們先設定選取 rect 這類型 svg 元素，接著 `data(data)` 塞入資料，可以理解成把數據狀態丟進去作為原料，接著使用 `join` 指示這筆資料最終要與 rect 作轉換，但怎麼轉換呢，在 rect 會有的 attribute x, y, height, width 中丟進轉換公式跟對應的資料，這樣就能產生出 Bar Chart 中的一個個 Bar 了。

這邊 join 的功用除了指示外，join 其實幫我們去比對目前的資料與 svg element 之間的狀況，若有多會新增更多 element，若有少則減去 element，這邊可以看下列這個實驗。

最後在並非一對一數據對應而是呈現數據概況的 axis 部分，D3 提供了方便的 function 來產生出完整的圖樣：

```js
const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    
const xAxis = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    
svg.append("g")
      .call(xAxis);

svg.append("g")
      .call(yAxis);
```

我們可以透過：d3.axisLeft, d3.axisBottom 產生出想要的 svg element 最後直接 append 進 svg 就有熱騰騰的 axis 可以使用。透過以上我們大概了解了最簡單的 d3 chart 流程，但可以發現有很多動作其實是前端中早有工具在解決的問題，舉例一直反覆用到的 append, select ... 這些不是 jQuery 甚至可以由原生 JS 取代的嗎？

### D3 DOM 操作

還記得大家的好朋友 jQuery 嗎？今天 DOM 處理並非 D3 獨有，甚至 D3 data join (聽起來超像什麼獨立樂團 XD) 的概念與現今 state change，我們現在來逐漸剝奪 D3 在 DOM 處理的環節，由原生 JS 取代看看差異。以上的轉換器不變，今天如果要處理塞入資料以及選取元素，我們可以直接透過熟悉的 DOM 處理來替代 D3 提供的 method 會更直覺。

```js
const svg = document.querySelector('svg')
svg.setAttribute("viewBox", [0, 0, width, height]);

const chartStr = data.reduce((str, d) => {
  str += `
    <rect 
      x="${x(d.category)}" 
      y="${y(d.value)}"
      height="${y(0) - y(d.value)}"
      width="${x.bandwidth()}"
    ></rect>
  `
  return str;
},"")

svg.innerHTML = `
  <g fill="steelblue">${chartStr}</g>
`
```

透過將數據利用轉換器轉為一系列的 HTML str 塞進 svg 之中，現在轉換的流程更直覺了，D3 負責數據轉換器，而 DOM 操作被拆到原生 JS 來處理，每當數據改變的時候就重新產生新的 HTML String，再丟進 SVG 中就可以了。

### D3 in Framework e.g. React & Vue

數據改變、重繪，聽到這兩個關鍵字啊哈，發現 Framework 結合的地方了，今天我們讓 DOM 處理跟著狀態走，D3 持續在 state 跟 DOM 元素之間負責轉換，於是無論 react 還是 vue 我們都可以很直覺的使用 D3，而不是透過常見的 ref 處理方式，讓 D3 從轉換到 DOM 操作一條龍的處理。

以 React 為例：

```js
const Chart = () => {
  const [data, setData] = useState(data);
  const xExtent = [0, data.length];
  const x = d3.scaleBand()
      .domain([0, data.length])
      .rangeRound(xRange)
      .padding(0.1)
  ...
  return (
    <svg>
       <g fill="steelblue">
         { data.map((d, idx) => 
	         <rect 
	           key={idx}
	           x={x(d.category)} 
	           y={y(d.value)} 
	           width={x.bandwidth()} 
	           height={y(0) - y(d.value)}
	        ></rect>
	   )}
       </g>
    </svg>
  )
}
```

我們把 rect 的 DOM 操作直接透過 data map 去做對應，而今天 data 這個 state 有改變，下面的圖表區塊也會重新渲染，element 的比對也會在 virtual DOM 的階段被優化，同樣的以 Vue 為例也是類似的邏輯：

p.s. 由於 elevently 使用的 highlight 沒有支援 vue，使用 js 來顯示：

```js
<template>
  <svg>
    <g fill="steelblue">
      <rect
        v-for="(d, idx) in chartData"
        :key="idx"
        :x="d.x"
        :y="d.y"
        :height="d.height"
        :width="d.x"
      />
    </g>
  </svg>
</template>
<script>
import { ref } from 'vue';
import * as d3 from 'd3';

export default {
    setup(props) {
      const chartData = ref([]);
      const xExtent = [0, exampleData];
      const x = d3.scaleBand()
	      .domain([0, exampleData.length])
	      .rangeRound(xRange)
	      .padding(0.1)
	  ...
      chartData.value = exampleData.map((d, idx) => ({
          x: x(idx),
          y: y(d.value),
          height: height - y(d.value),
          width: x.bandWidth()
        }));
      return {
        chartData
      }
    }
}
</script>
```

等等，那 Axis 這種元素也要這樣處理嗎？沒錯，並非說能用 state 就不用 ref 處理，我們還是可以使用 ref，尤其在 Element 複雜且互動變化少的 Axis 適合。以 React 為例：

```js
const Chart = () => {
  const [data, setData] = useState(data);
  const svg = useRef();
  const xAxisGenerator = g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x))
    
  ...
  useEffect(() => {
     svg.append("g")
        .call(xAxisGenerator)
  }, [data])
   
  return (
    <svg ref={svg}>
       <g fill="steelblue">
         { data.map((d, idx) => 
	         <rect 
	           key={idx}
	           x={x(d.category)} 
	           y={y(d.value)} 
	           width={x.bandwidth()} 
	           height={y(0) - y(d.value)}
	        ></rect>
	   )}
       </g>
    </svg>
  )
}
```

這樣就可以快速處理 SVG 複雜的 Axis 圖形了。

## 小結

每每接觸 D3 Layout 有一種看一個是一個的感覺嗎？現在重新從轉換的角度看，要接觸 D3 Layout 應該要先知道怎麼轉：

1. 了解每一個 Layout Method 需要輸入的資料型態與輸出的對應 SVG
2. 知道哪一些圖表元素適合直接 DOM 操作、哪些不。

舉個例子，假設今天突然經歷到比較少見的甜甜圈圖，我會先去 [Graph Gallery](https://www.d3-graph-gallery.com/) 或 [Observable](https://observablehq.com/) 比較直覺地看對應到 D3 的哪一種 Layout：

接著釐清這個 Layout 最終對應的 SVG 為何，需要的資料型態為何，以甜甜圈圖為例，最終產出的資料區塊會是 path，而 path 需要的 input 資料是 path 的路徑，

![](https://imgur.com/iFGqS7d)

另外對應在 D3 的 Layout 是 arc，arc 會產出 path 對應的路徑資料，更前置 arc 需要的 input 是 d3.pie data，pie data 則需要 Array 形式的 key value object ... etc，一路轉換逆推就可以形成這樣的架構。

```js
// example data should be [{ key: ..., value: ... }, ...]

// pie data transform 
const arcData = d3.pie().value(d => d.value);

// pir to arc path transform function
const arc =  d3.arc();
 
const radius = Math.min(width, height) / 4 ;
  chartData = arcData(data).map(d => arc({
  innerRadius: radius + 30,
  outerRadius: radius,
  ...d, // path input 
}));
```

綜合以上拆解就能有系統的上手各式各樣的圖表，

## 參考資料

- [Graph Gallery](https://www.d3-graph-gallery.com/)
- [Observable](https://observablehq.com/)
- [^1] : [2011-D3-InfoVis.pdf](http://vis.stanford.edu/files/2011-D3-InfoVis.pdf)
- [^2] : [Shirley Wu: D3 and React, Together — ReactNext 2017 - YouTube](https://www.youtube.com/watch?v=w493jXg5D8o&ab_channel=ReactNext)
- [^3] : [CSE512-DataAndImageModels](https://courses.cs.washington.edu/courses/cse512/21sp/lectures/CSE512-DataAndImageModels.pdf)
- [^4] : [Variable - new ways of experiencing data](https://variable.io/)
- [^5] : [Opportunities and Challenges for Data Physicalization - YouTube](https://www.youtube.com/watch?v=-ITadxbL8Wk&ab_channel=AssociationforComputingMachinery%28ACM%29)
