---
title: 为什么要使用框架 —— 你听过最好的答案是什么？
date: 2021-09-19
tags: [Framework]
author: benben
layout: layouts/post.njk
image: https://www.saaspegasus.com/static/images/web/modern-javascript/2008-vs-2021.png
lang: zh-CN
sourceLang: zh-TW
translationKey: benben/02-framework
permalink: /zh-CN/posts/benben/02-framework/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: 84fa49b4397c0aca6b674b44ec27b0a2267d8d2ce97c03ee938351cf3fc96a31
---

<!-- summary -->
<!-- 框架百百种，但有想过为什么要用框架吗？ -->
<!-- summary -->

![modern-javascript](https://www.saaspegasus.com/static/images/web/modern-javascript/2008-vs-2021.png)

> 图片来源：[https://www.saaspegasus.com/guides/](https://www.saaspegasus.com/guides/)

## 前言

大家安安！2021 的 Web 前端也是一如既往地五花八门！当然，我们也是学得落花流水。

最近也是笔者程序導師计划第五期的尾声了。不知道大家的学习路径是怎样的——也许有前辈是一路从原生 JavaScript、到 jQuery、再到三分框架的时代。当中框架也经历不少更新（2016 - 2021）。但很多 `前端快速上手班` 的学习过程，可能刚学完 JavaScript 就直接学 React hooks、Vue 3……等。我敢说有人（可能还不少）不知道 JavaScript 的作者是谁，甚至没听过网景（Netscape），更别说框架了。「为什么要学 JavaScript？」可能都没办法回答得很好。

像这种 `为什么` 类型的问题，笔者喜欢去找历史。因为历史会告诉你前人的时空背景，通常理解并稍加分析后，就会推导出自己的答案。这种答案比起那种塞给面试官听的答案，更能说服自己。

笔者这边会以前端框架的角度，去思考为什么我要使用框架。但有时候或许可以不用这么纠结。有些可能是哲学问题，例如：人是为了什么而活？然后就开始怀疑人生。

## JavaScript 简史

**1995 年，Brendan Eich 大大发明了 JavaScript**，今年（2021）的 7 月 4 号也是他的六十岁大寿。我们怀念他——不是！是祝福他感谢他，感谢他发明了 JavaScript 让我们有工作可以做，而且还有很多东西很难懂，但如果能搞懂大部分人不懂的东西，就能跟别人区隔开来。老实说这样辨识度还蛮好的，所以面试考这些，好像就挺合理的。

![Thanks for JS - meme](https://res.cloudinary.com/practicaldev/image/fetch/s--ZDtqrBOj--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://github.com/damiancipolat/js_vs_memes/blob/master/doc/js_thanks.png%3Fraw%3Dtrue)

> 图片来源：[https://dev.to/damxipo/javascript-versus-memes-explaining-various-funny-memes-2o8c](https://dev.to/damxipo/javascript-versus-memes-explaining-various-funny-memes-2o8c)

谢了！Brendan Eich 大大发明 JavaScript！对了，如果你不知道，他就是图中的那个男人。

当时的时空背景是：**需要一个可以在浏览器中执行的程序**。当时的 **网景**（Netscape）把这个任务指派给 Brendan Eich。正好 Java 正火红，他就把这个语言命名为 `JavaScript`，想蹭一点知名度——其实跟 Java 完全没有关系（没有那种会了其中一个、另一个就差不多会了的事）。但也不是完全没关系，他发明的时候确实 "参考" 了 Java。后来各种语言也是互相 "参考" 来的，很多写法确实有异曲同工之妙。这里让大家自行体会了。

后来 Brendan Eich 引起了一些争议，那是另外一段故事了。

这时的 JavaScript 还很纯很纯。好，JavaScript 简史先到这。

## jQuery 霸主与百家争鸣的浏览器

JavaScript 发明完后，网景的市占率也顺势起飞，还曾经一度独占鳌头。后来其他群雄当然也眼红了——因为当时用网络的人还不多，不用我说，小孩子都知道这绝对是一片大蓝海啊！不用多久，就冒出一堆浏览器：Internet Explorer、Chrome、Firefox、Safari、Opera……等。于是浏览器混战就开始了！小孩子才做选择，我都用 IE！

但是好景不常，工程师面临的问题是：**如何解决跨浏览器** 的问题。最一开始是，每种写法都写好写满——当然这很累人，但又创造了不少工作机会，是吧？有需求就有机会。

**2006 年 jQuery 推出了**。曾经全球前 10,000 个存取最高的网站中，有 65% 使用了 jQuery。它完美解决了跨浏览器问题——一种写法就能转成各浏览器都能用的代码。好 library，不用吗？那时候可能还没什么 library、framework 的概念。反正问题解决了，客户开心、老板开心，当然你也发大财，所以你也开心。

简单的 jQuery 写法如下：

```javascript
// jQuery
$('#hello')

// 原生 JavaScript
document.getElementById(hello)
```

为什么要用 jQuery，当然也就不言而喻了。除了可以少打很多字以外，最重要的一点就是可以解决上述的跨浏览器问题。但其实你不需要 jQuery——除了现在的浏览器支持度都很好之外，令人诟病的就是性能问题。以前的项目还不大所以没感觉，但当你连一件简单的事都想用 jQuery，这就不对了。例如：原生 `document.getElementById` 远大于 jQuery，当你项目越来越大，也就越来越慢。

> 延伸阅读：[You Might Not Need jQuery](https://youmightnotneedjquery.com/)

## Framework & Library

随着时间推进，2013 年 Facebook 推出了 React，在当时是非常新的技术。当然在台湾要有一定的开发者使用，少说也要 3 年。笔者那时候也还在念书，学校怎么可能会教这么潮的东西。但是面试的门槛就要你会框架（~~阿我就没学过啊，学校也没教啊~~）。也确实在那个时候（2016），许多 `前端速成班` 如雨后春笋般出现，打着无经验转职的招牌，阿猫阿狗都收。但实际的状况是：我们无从得知那些所有的阿猫阿狗后来怎么了，反正人进来发大财。

这里不是说要限制什么样的人就不能当工程师，而是要说这条路可能没你表面看到的容易。那些转职成功的人都是付出相当大的时间精力，都是你没看到的。如果你意志还坚定，那么可以试试看。了不起也就浪费 3～6 个月。

回到 React 框架。许多人看到 [React 的官网](https://reactjs.org/) 中写道：`A JavaScript library for building user interfaces`。喔！原来 React 不是框架啊，是一个 "Library"，是整个生态系合起来才是一个框架。嗯嗯，这样你就懂了吧！但是！新手如我，看到这还是充满一堆问号啊。好了，我的问题又来了：那什么是 Library？

Library 其实可以追溯到公元前 2600 年，由苏美人的楔形石板打造而成——喔！不是，那是图书馆（library）。其实是我找不到合理的解释，因为这个词已经太抽象了又有很多意思。也可以看一下 [Wiki 中文页面](https://zh.wikipedia.org/wiki/%E5%87%BD%E5%BC%8F%E5%BA%AB) 有多么少的内容。Library 又分为 Computing Library 跟 Digital Library，但这里要讲的是 Digital Library 里放代码的那种 Library。等等！你搞得我好乱啊！但我想你懂我意思。

换个角度，如果你是一位 Web 工程师，我敢说你一定用过 `npm`。好吧，如果你说没有，你都手刻来着，那我也认了你是大神。npm 是 2010 年诞生的。library 一词，姑且说是那个时间点才广为流传的，好像也不为过。但大部分新手对 Library 的认识，不就是用 `npm install XXX` 下载要用的套件。对，笔者也是这样认识 library 这个词的，对这个熟悉又陌生的词仅此而已。

其实会写 function 就会写 Library 了喔，例如：

```javascript
function add(a, b) {
  return a + b
}

// 或是已經沒這麼潮的寫法
const add = (a, b) => a + b
```

恭喜你，你已经写了一个加法的 Library 了。对这个词的概念就是这么简单。

Library 跟 Framework 简单说都是可以使用别人写好的代码，但差别在于 `自由度`。这个有点抽象的概念，拿餐厅举例来说：

1. Library 的写法：像是可以自由地选择你要吃的食物，也可以只喝饮料。
2. Framework 的写法：则像是配好的套餐，可以选择某些主食，但甜点不能选。

这样应该比较懂两者的差别。但其实自由度一词也很主观。例如：如果说 React 的自由度高于 Angular，大家应该都可以接受。但他们都还是框架（准确地说是 React 生态系跟 Angular）。

> 延伸阅读：[The Difference Between a Framework and a Library](https://www.freecodecamp.org/news/the-difference-between-a-framework-and-a-library-bd133054023f/)

既然 React 不是一个框架（准确来说），那么可以思考一下：**React 里还要再加哪些东西才算一个框架？**

如果你用过 `create-react-app`，而且也看过 `package.json`，会看到 `react`、`react-dom` 还有一些测试套件等。看起来好像也没多少东西。但如果你跟我一样好奇，可以打开 `node_modules` 看看里面有多少套件——会看到一些知名的如：`webpack`、`babel`、`jest`……等，也有一些好用的小套件：`uuid`、`dotenv`、`fast`……等。

是因为有了 webpack、babel、jest 这些大的 Library 才算框架吗？可能是也可能不是，我不知道。

> 延伸阅读：[Is React a Library or a Framework? Here's Why it Matters](https://www.freecodecamp.org/news/is-react-a-library-or-a-framework/)

### 使用框架的好处

常见的答案有：

- 同样的功能可以重复利用，易扩充也易维护
- Component & 模块化
- 画面与数据的分离
- React 可以被用来写 SPA
- React 的生态系已经很成熟，网络上的资源也非常多
- 保持程序的单一个入口点
- 因为社群比较多人用，所以资源也会比较多
- ……等

但仔细想想上面的答案，可能都只是 **结果**，并不是原因。这需要把前因后果搞清楚，逻辑才会清晰。例如：最上面的两点，跟框架一点关系都没有。这两点只要是写代码都应该注意的。

如之前所说，应该要关注的点是框架解决了什么问题。先来看看这时候什么问题出现了吧！

当时的时空背景是：**2010 iPhone 4 上市，用户大量迁移到移动装置**。这时候的 web 除了要适应装置的大小（RWD）之外，还要面对更贴近的商业市场。这代表着 UI/UX 越来越重要——因为用户越来越多，必须有更好的体验才能留住用户。前后端分离的概念也随之萌芽。确实这个神奇的时间点（2010）开始，大量的工具推出。还记得最上面那张图吗？仔细发现时间轴是一致的。

这时的分工可能还没有前后端分离。为了要应对这个巨大的转变，框架的雏形就诞生了。但是分离的做法当然不只一种，常见的有：MVC、MVP、MVVM 模型。所以框架也是有一些小区别的，但都是为了解决 **前后端分离** 这件事。

到这边答案就渐渐浮现了。为什么会需要框架？因为需要前后端分离。为什么要前后端分离？因为项目规模大。

现行的大型项目几乎都会用到框架，所以公司要求你至少学一个框架，好像也是挺合理的，因为公司等级的项目通常都很大。既然现在的框架都可以解决前后端分离的问题，再来就是挑选框架了。可以依你喜欢的模型、性能、文件大小、语法……等，去使用任何你喜欢的框架。当然最重要的还是看公司需求 XD

## 总结

现在前端新的东西一直出，旧的东西也一直更新，都快学不完啦！

回顾前端技术的发展，不难发现新技术和新工具总是围绕着问题而生。但其实近几年有趋缓的趋势，也如同手机一般的饱和——代表着前端已经逐渐成形了。未来可能不会有太大的改动，可以趁现在把握机会。能掌握技术的时候，就不要让它溜走！

最后希望大家可以一同进步！如果有说错或是讲得不够清楚的地方欢迎指正。感谢您的阅读。

## Ref

- [You Might Not Need jQuery](https://youmightnotneedjquery.com/)
- [The Difference Between a Framework and a Library](https://www.freecodecamp.org/news/the-difference-between-a-framework-and-a-library-bd133054023f/)
- [Is React a Library or a Framework? Here's Why it Matters](https://www.freecodecamp.org/news/is-react-a-library-or-a-framework/)

> 免责声明

以上均为笔者自身经验，难免掺杂主观意见，仅供读者参考，也欢迎分享经验交流。
如果有错误的地方还请大佬们指正，笔者会立刻修改。再次感谢大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作采用 [创用 CC 姓名标示 4.0 国际授权条款](https://creativecommons.org/licenses/by/4.0/) 授权。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
