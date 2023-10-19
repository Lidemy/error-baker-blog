---
title: Scroll-driven Animations
date: 2023-10-19
tags: [Front-end]
author: Ruofan
layout: layouts/post.njk
---

<!-- summary -->

大家好！這篇文章想帶大家認識透過新的滾動驅動動畫 API 實作出絲滑流暢的動畫。


<!-- summary -->

<!-- more -->

## scroll-driven animations
什麼是捲動畫面時會驅動的動畫呢？
這邊帶大家來看兩個影片讓大家可以從畫面上瞭解到動畫被執行的時間點。

第一個影片是當使用者在滑動畫面時可以看到最上方跟最下方的物件會有一個 translate 跟 fade 的效果
![](/img/posts/ruofan/animation-1.gif)

第二個影片是當使用者在滑動畫面時可以在最上方看到進度條的動畫效果
![](/img/posts/ruofan/animation-2.gif)

這兩個範例呢都有捲動畫面時會驅動的動畫。

接著帶大家看一下滾動驅動的動畫常見的實作。

## Classic way

```html
  <body>
    <div id="progressBar"></div>

    <script>
        const progressBar = document.getElementById('progressBar');

        window.addEventListener('scroll', function() {
            // Calculate the scroll progress in percentage
            const totalHeight = document.body.scrollHeight - window.innerHeight;
            const scrollPosition = window.scrollY;
            const scrollPercentage = (scrollPosition / totalHeight) * 100;

            progressBar.style.width = scrollPercentage + '%';
        });
    </script>
</body>
```
上方的程式碼表達的是
當使用者在滾動頁面時，進度條的寬度會根據滾動的百分比而增加或減少。
可以看到使用 addEventListener 來監聽滾動事件，這個事件監聽器的 callback function 會在 main thread 上被調用和執行。

可能會產生什麼問題嗎？
如果動畫在連續的幀 frame 之間錯過了渲染，那麼頁面會出現不流暢的效果，稱為 "janky"。

![](/img/posts/ruofan/jank.png)

## new in web animations

Chrome 的新 API 允許開發者以 declarative way 實作滾動驅動的動畫，並確保動畫在非 main thread 上運行。
滾動進度時間線和視圖進度時間線允許開發者更細緻地控制動畫的播放。

### 滾動進度時間線

下方的程式碼效果是使用者在滑動畫面時可以在最上方看到進度條的動畫效果。
使用 scroll-timeline 建立 --page-scroll 的滾動進度時間線

```html
<body>
	<div id="progress"></div>
	…
</body>
html {
	scroll-timeline: --page-scroll block;
}

@keyframes grow-progress {
	from { transform: scaleX(0); }
	to { transform: scaleX(1); }
}

#progress {
	position: fixed;
	left: 0; top: 0;
	width: 100%; height: 1em;
	background: red;

	transform-origin: 0 50%;
	animation: grow-progress auto linear;
	animation-timeline: --page-scroll;
}
```
### 視圖進度時間線

下方的程式碼效果是列表項目進入或離開滾動 view port 時，會進行相應的滑動和淡入/淡出效果。

```css
@keyframes animate-in-and-out {
	entry 0%  {
		opacity: 0; transform: translateY(100%);
	}
	entry 100%  {
		opacity: 1; transform: translateY(0);
	}

	exit 0% {
		opacity: 1; transform: translateY(0);
	}
	exit 100% {
		opacity: 0; transform: translateY(-100%);
	}
}

#list-view li {
	animation: linear animate-in-and-out;
	animation-timeline: view();
}
```

### Recap

使用新的滾動驅動動畫 API 可以讓我們更輕鬆的實作絲滑的動畫，但是目前看起來並不是所有瀏覽器都支援。


![](/img/posts/ruofan/animation-3.png)

## 小結

在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃

## 參考資料

- [Blog](Animate elements on scroll with Scroll-driven animations)
- [Blog](Inside look at modern web browser (part 3))
- [Document](Scroll-driven Animations)
