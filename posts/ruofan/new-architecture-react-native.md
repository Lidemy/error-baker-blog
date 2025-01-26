---
title: New Architecture of Rreac Native
date: 2025-01-26
tags: [Front-end]
author: Ruofan
layout: layouts/post.njk
---

<!-- summary -->

大家好！在這篇文章中，想要跟大家分享 react native 在前陣子 0.76 的版本中帶來的新架構。

![](/img/posts/ruofan/rn-1.png)

<!-- summary -->

<!-- more -->

## 舊架構有哪些問題 ？

### Bridge 的效能瓶頸

React Native 的舊架構採用了一個 asynchronous bridge 來處理 JavaScript 和 Native 之間的溝通。這樣設計的初衷其實很單純：把所有工作都丟到 background thread 去處理，這樣就不會卡到 main thread，APP 理論上應該會很順暢。

但實際運作上，每次 JavaScript 和 Native 的溝通都必須經過一個複雜的過程：

1. JavaScript 端需要做 Serialization，把資料轉換成 JSON 格式
2. 透過 Bridge 傳到 Native 那邊
3. Native 端再做 Deserialization，將 JSON 轉回原生格式

當 APP 在處理一些頻繁的更新，或是要傳遞比較大的物件時，Bridge 的 serialization 機制就成了效能瓶頸。

### 同步性問題好棘手

在 asynchronous 架構下，JavaScript 和 Native 的溝通容易出現 out of sync 的情況。問題是當兩邊狀態不一致時，舊架構沒有提供一個 synchronous reconciliation 的機制，容易衍生出一些 UI bugs。

### Single Thread 的限制

舊架構在處理 UI 時用一個相對單純的設計：只維護一份 native hierarchy，並且用 in-place mutation（直接修改）的方式來更新。這個設計雖然簡單，但帶來了幾個限制：

1. Layout 運算被限制在單一執行緒
2. High Priority Updates 無法即時處理
3. Layout 資訊無法同步讀取

這些限制讓舊架構沒辦法完整支援 React 的 concurrent features。

![](/img/posts/ruofan/rn-2.png)


## 新架構如何解決這些問題 ？
新架構最大的改變是用 C++ 重寫了 JavaScript 和 Native 之間的溝通機制。

為什麼選擇 C++ 呢 ？ 
主要是因為：
1. C++ 可以直接存取底層系統資源
2. 可以同時跟 JavaScript 和 Native 平台溝通

### JSI （JavaScript Interface）

在舊架構中，JavaScript 跟 Native 溝通需要透過 Bridge 來轉換，每次溝通都要經過一連串的轉換。

JSI 架構做了什麼改進呢？
如果今天要跟外國人溝通，與其找翻譯，不如直接學會對方的語言。JSI 就是讓 JavaScript 和 Native 都學會了對方的語言，可以直接溝通：

1. **Host Objects 機制**：JSI 提供了一個介面，讓 JavaScript 可以直接與 C++ 互動，參考 Native 物件。

2. **Shared Memory 設計**：共享記憶體的概念，就像是在 JavaScript 和 Native 之間放了一本大家都能讀寫的共用筆記本。

3. **同步執行架構**：Native 的功能可以直接被 JavaScript 呼叫。

### Turbo Modules

在舊架構中，所有模組會在 APP 啟動時一次把所有 Native 模組都載入，導致啟動時間變長且記憶體占用過多。

Turbo Modules 用 lazy loading 的概念，在真正需要用到某個模組時才載入，這樣一來 APP 啟動速度自然變快了，因為不用一次載入那麼多用不到的模組，記憶體使用也更有效率。

### Fabric

Fabric 是為了解決舊架構中提到的 Single Thread 限制而設計的新 Rendering Engine。

1. **動態分配資源**：透過 concurrent renderer 實作優先級排程，讓重要的 UI 更新能立即處理。

2. **更穩定的狀態管理**：shadow tree 機制，每次更新都建立新的 state tree，不是直接修改現有狀態。


![](/img/posts/ruofan/rn-3.png)

## 總結

在實作套件支援新舊架構的過程中，花了一些時間了解每個改動背後的原因，也感受到了社群的力量。

如果在閱讀過程中有任何疑問或建議，請隨時留言告訴我。謝謝大家！😃


## 參考資料

- [Blog | React Native's new architecture - Glossary of terms](https://blog.nparashuram.com/2019/01/react-natives-new-architecture-glossary.html)
- [Blog | React and Codegen](https://commerce.nearform.com/blog/2019/react-codegen-part-1/)
- [Documentation | New Architecture ](https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here)
- [Documentation | JavaScriptCore ](https://developer.apple.com/documentation/javascriptcore)
