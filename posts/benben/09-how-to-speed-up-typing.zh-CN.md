---
title: 如何提升打字速度 —— 从初心者转职超级初心者
date: 2022-10-16
tags: [Typing, VS Code Extension]
author: benben
layout: layouts/post.njk
image: https://hackmd.io/_uploads/rJWJgRQ1i.gif
lang: zh-CN
sourceLang: zh-TW
translationKey: benben/09-how-to-speed-up-typing
permalink: /zh-CN/posts/benben/09-how-to-speed-up-typing/
reviewedBy: benben
reviewedAt: 2026-07-18
publishedAt: 2026-07-18
sourceHash: 93bf6bc560a8c69282c6039d9f736fb18bbee52e136e4678657638a20bf88a81
---

<!-- summary -->
<!-- 如何提升打字效率，从剑士、法师、盗贼的方面来说 ... -->
<!-- summary -->

**！这一篇文章主要会讲要提升打 Code 的速度，从各方面来说，包含物理、心理、视觉的方面，希望对大家有帮助！**

<center>

![typing](https://hackmd.io/_uploads/rJWJgRQ1i.gif)

</center>

## 前言

大家安安，我终于又回来了。前阵子也是小忙，这次要跟大家分享的是「打字效率」！

「打字快速」绝对是一门值得投资的技术，尤其是作为长时间使用键盘输入的人，如：开发者、文字工作者，甚至以至于 **速录师** 等。如果你的打字速度非常快，别当 ~~爆肝~~ 工程师了，去当速录师吧（有兴趣的读者可以去查查看速录师的薪水）！笔者在学习的过程中，上过很多线上课跟直播等等，发现有很多的优秀高手、大神，打字速度都非常快，手短如我，每每看到都很羡慕。要是自己的打字速度能有这么快该有多好！然后就开始幻想快速 Coding，下略 3000 字……

要先说明的是，注意我这边讲的是 **效率**，而非速度，而效率也是主观的感觉。所以我除了会介绍一些不错的打字练习网站来提升速度，还会通过其他方式来增加 **打字很快的感觉**。如果你也有兴趣就继续看下去吧！

## 初心者篇

有人说最棒的 IDE（Integrated Development Environment）是 VS Code、有人说是 Notepad++、有人说是 VIM、有人说是 Office Word。来听听前 Facebook 的工程师说说为什么是 Office Word。

<center>

[![Best IDE](https://img.youtube.com/vi/X34ZmkeZDos/0.jpg)](https://www.youtube.com/watch?v=X34ZmkeZDos)

</center>

> Why Microsoft Word is the best IDE for programming | Joma Tech

来试试看最棒的 IDE Microsoft Word 吧！等等！我依在 VS Code 中的习惯打个 `! + tab`、`.wrapper > .item * 3`（emment 语法）然后马上按 `Tab`，怎么没东西！应该会直接产生一个 html 的 template 的啊。窝不会写扣了。

虽然表面上很好笑，但细思极恐。没错，我们都被现在的 IDE 宠坏了。

笔者认为 Word 很大，呃，不是！是 Word 很贵，要买正版的 Word 也不便宜。看来要使用最棒的 IDE 也是要付出代价的！

还是说……先使用纯白的 txt 看看吧！

笔者真的干过这种事。每次看完大神的技术分享后，满腔热血地打开一个空白记事本，直接进入心流状态猛敲键盘，回过神来，已是一串 `console.log('Hello World')`，笔者自己都不敢相信。

就让我们回归到最初的起点吧。只打开记事本，看看能不能在不 google 下就自己写点什么，如最简单的：Counter、TodoList 等等。

---

## 剑士篇

- 技能：**双手键使用熟练度**

最基本要提升打字速度的方法，没什么就是多练就对！

打字练习的网站有很多，这边就不一一介绍了。分享一些觉得不错的网站，有些也是朋友介绍的，这边就全部公开不私藏。

英打推荐网站：

- <https://www.ratatype.com/>
- <https://www.typing.com>
- <https://10fastfingers.com/typing-test/english>
- <https://qwerty.kaiyi.cool/>

小建议是跟学习正确的指法一起练习。虽然短期来说可能打字会变慢，但习惯之后会发现，会比之前旧指法卡住的瓶颈还要快。

- 技能：**自动拼字防御**

再来是自动防御的部分。字打得快，错的也越多，这时候就可以试试 VS Code 的插件：[Code Spell Check](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

虽然这也是讲到烂掉的插件，但因为真的很实用，尤其是打字快的时候。因为有时候自己再写 function 的时候命名拼错，结果整个 code base 的命名全部都错，这时候想改可就是一个头两个大了。如果是个人项目还好，反正自己雷自己踩，踩久了就习惯了。

但如果是合作的项目可就不是开玩笑的了。例如：开发时程很赶，产生某个 typo，结果就一直沿用下去，环境变量也沿用，后端也很沿用，DataBase 也沿用，这就不是自己改好就好的问题了。所以千万不要 typo，甚至用 typo 去雷到别人好吗？自动防御开下去就对！

- 技能：不要使用 **`Tab` 狂击**

再来是 **不要使用 `Tab`（auto complete）**、还有在 Terminal 中一直按「上」只为了找一段 `npm run dev`，这也是很多新手开发者遇到的雷。反正现在的 IDE 都很强了，可以一路「`Tab`」到底，当一个 `Tab` 工程师，开发上是很快没错。但随之而来的是：打字就是不快、甚至连常用的 Api 都记不起来（如：`document.getElementById('#app')`）。测试自己看看不使用 `Tab` 能完成吗？如果能完成那是花了多少秒？

有些读者可能会认为，有必要吗？用 `Tab` 不是很好吗？笔者一开始也同意，但后来在一次的上课中，有同学请教了 [胡立](https://blog.huli.tw/about/) 大大，英打如何打字跟老师一样快。其中一建议就是「不用使用 Auto complete」。从那一刻开始，我就很少使用 Auto complete 了，我也觉得很有帮助，所以这边也再分享这样的想法！

先说，笔者同意使用 `Tab` 的好处，也很多资深开发者也是 `Tab` 按好按满，但前提是这些资深的开发者，大多 Api 都非常熟练、打字都非常快速了，使用 `Tab` 真的只是纯粹帮他们节省时间。而就我看来，大多的新手开发者使用的 `Tab` 就不太一样了。是啦，有节省到时间，但也省下了思考的机会、练习打字的机会。

> 使用 `Tab`，但只在你真的了解每个 `Tab` 下的意义。

## 法师篇

- 技能：**陨石术**

讲了这么多 hard core 的部分，是该来点「魔法」了。试试 VS Code 插件：[Power Mode](https://marketplace.visualstudio.com/items?itemName=hoovercj.vscode-power-mode)

装了之后，直接习得「陨石术」，画面真的很炫，可以直接看官网的 Demo，这边就不再转贴一次了。

用了之后写 Code 都 100 分，连陨石砸下来都不怕了呢！没……老板先不要再砸陨石下来了，窝快不行了。

一开始使用一下下，会觉得陨石术很棒，但可不可以不要有地震术的效果（side effect?）？

有的，只要去设定的地方：

VS Code 设定 -> 输入「powermode」 -> 往下滑，找到「Shake:Enabled」 -> 把勾勾取消勾选

这样就完成啦！

> 之后就是陨石连发起来（不是开发的陨石喔）！打字直接 500x、1000x 爽度一百啊！

## 盗贼篇

- 技能：**残影**

来到了盗贼篇，就是要偷懒一下，来点被动技能「残影」吧！

这边什么都不用安装，因为这是原生 VS Code 的「隐藏设定」。因为预设是关，好像也很多人不知道这个功能。笔者也是在某个大神直播中发现的。分享给朋友后，每个朋友都赞不绝口呢！

那么笔者就来教大家如何学习「残影」：

- 使用 VS Code 的设定 `Cursor Smooth Create Animation`
  1. 打开 VS Code 的设定档画面（`cmd` + `,` / `ctrl` + `,`）。
  2. 搜索：`smooth`。
  3. 找到 `Editor: Cursor Smooth Create Animation`，并将它打勾。

![Cursor Smooth Create Animation](https://hackmd.io/_uploads/B1GLPaXJi.png)

> 使用前

![before](https://hackmd.io/_uploads/rJWJgRQ1i.gif)

> 使用后

![after](https://hackmd.io/_uploads/SkDylRQJs.gif)

好像 GIF 的截图，因为有压缩过，所以残影的感觉不太明显 QQ

但仔细看的话，使用后的滑鼠游标会有残影，变得 **比较滑顺**。

> 这样就可以滑滑滑起来了，打起 code 来就是滑。

## 番外篇：商人篇

- 技能：**买啦！哪次不买！**

这边就是装备篇的部分了。身为一个优秀的工程师（？）一定要找一个自己喜欢的键盘、配上喜欢轴体之类的，还有自己喜欢的手感。但这部分真的很因人而异。简单说就是多试试就对，才知道自己喜欢的轴体、材质手感等等。还有一个很重要的就是看你的需求，没有携带的需求、RGB 灯效之类的。

笔者这边也简单分享自己的心得。因为喜欢手维持在键盘中，以保持效率，所以考虑的就会是 87%、60% 的键盘，因为数字键摆着也是占位置，可以省下更多空间。再来是轴体的部分，这也真的很看个人。因为我一开始也不熟悉各轴体的差别，所以第一把就买了万能的茶轴。一开始感觉也还不错，但用久了发现我的右手小指头会有点痛（如果使用正统的指法打 code，会发现很多键都是右手小指）。后来才改成红轴，比较省力也比较安静一点。

市面上常见的轴体，简单来说：

- 力道：红轴 < 茶轴 < 青轴
- 音量：红轴 < 茶轴 < 青轴

但还是依各家的产品略有不同，简单介绍给想入门的读者（~~但如果金钱不是问题的话，可以试试 HHKB~~）。还有键帽材质的部分，我自己是黄油手，材质的部分就可以试试 PBT 或是更好的材质之类的，这部分也很多人做介绍了，就请各位商人们做点功课吧！

## 总结：超级初心者篇

- 技能：**我全都要**

技术点数有限，前端学海无涯，回头是岸啊，初心者！

但是我全都要！所以上述的方法可以依照个人的需求全部一起试试。或是你可以什么都不做，只买一个自己爽的键盘；也可以只用公司的烂键盘去磨。只要你认为能提升「打字效率」就行了。

因为打字效率这个技能是会随着使用者一起成长的，报酬率也是很高的！不要低估这个软技能，有的公司就要求了开发者的打字速度。这个技能某部分来说，也可以说是区分了新手开发者跟中高阶的开发者，很值得投资一点时间在上面的！

另外本篇文章中提到的这些技能，好像某个经典游戏的内容，直接暴露年龄了（QQ）。读者们就别认了吧，回忆啊。

最后希望大家都能离理想中的黑客更近一步，但请当个道德黑客吧！

Happy Typing, Happy Hacking!

## Ref

- [YouTube | VS Code tips — Enabling smoothly animated cursor movement](https://www.youtube.com/watch?v=FCUi_dRU0tY)
- <https://www.ratatype.com/>
- <https://www.typing.com>
- <https://10fastfingers.com/typing-test/english>
- <https://qwerty.kaiyi.cool/>
- [VScode Plugin | Code Spell Check](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
- [VScode Plugin | Power Mode](https://marketplace.visualstudio.com/items?itemName=hoovercj.vscode-power-mode)

> 免责声明

以上均为笔者自身经验，难免掺杂主观意见，仅供读者参考，也欢迎分享经验交流。
如果有错误的地方还请大佬们指正，笔者会立刻修改。再次感谢大家！

[![Creative Commons License](https://i.creativecommons.org/l/by/4.0/88x31.png)](https://creativecommons.org/licenses/by/4.0/)

本著作采用 [创用 CC 姓名标示 4.0 国际授权条款](https://creativecommons.org/licenses/by/4.0/) 授权。您可以在 [benben.me](https://benben.me) 找到我。

This work is licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/). You can find me at [benben.me](https://benben.me)
