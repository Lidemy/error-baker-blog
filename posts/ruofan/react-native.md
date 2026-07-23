---
title: Setup your react native project
description: "設置 React Native 開發環境的踩坑紀錄：比較 Expo CLI 與 React Native CLI，說明 Expo、Expo Go、EAS Build 各自的用途與限制，並分享在電腦上設定 simulator 的過程。"
date: 2022-08-13
tags: [Frontend]
author: ruofan
layout: layouts/post.njk
---

<!-- summary -->

Hi，大家好！ 前陣子在設置 react native 不同 simulator 的環境時踩了一些坑，這邊會和大家分享建制過程。

<!-- summary -->

<!-- more -->

## 什麼是 `Expo` ？

在 react native 官方文件上提供了兩種方式讓我們啟動專案，分別是 `Expo CLI` 與 `React Native CLI`。
下方是 [react native 官方文件](https://reactnative.dev/docs/environment-setup) 上對於 Expo 的介紹：
>Expo is a set of tools built around React Native and, while it has many features, the most relevant feature for us right now is that it can get you writing a React Native app within minutes. You will only need a recent version of Node.js and a phone or emulator. If you'd like to try out React Native directly in your web browser before installing any tools, you can try out Snack.

使用 `Expo` 的好處是，開發者不一定需要使用 mac 才能搭配 simulator 開發，如果是使用 windows 的開發者透過 `Expo` 也可以搭配 [Expo Go](https://expo.dev/client) 進行開發。

#### `Expo` 有什麼限制嗎 ？

下方是 [expo 官方文件](https://docs.expo.dev/introduction/why-not-expo/) 上的介紹：

>All libraries available to React Native apps are available to Expo managed workflow apps built with EAS Build, but some may require a Prebuild Config Plugin to be added.

這邊的限制在於如果使用了像是第三方的推播服務或是 IOS 和 Android 原生的 libraries 在 build 專案時會需要搭配 config 設定檔。


## 什麼是 `Expo Go` ？

下方是 [react native 官方文件](https://docs.expo.dev/get-started/installation/#2-expo-go-app-for-ios-and) 上對於 `Expo Go` 的介紹：
>The fastest way to get up and running is to use the Expo Go client app on your iOS or Android device. It allows you to open up apps served through Expo CLI and run your projects faster when developing them. It is available on both the iOS App Store and Android Play Store.

透過 `Expo Go` 可以直接在手機上將專案跑起來。

#### `Expo Go` 有什麼限制嗎 ？

下方是 [expo 官方文件](https://docs.expo.dev/introduction/why-not-expo/) 上的介紹：

>additional native code cannot be added to Expo Go on the fly, so this means you are limited in terms of what dependencies you can add. This also applies to apps built with expo build:android and expo build:ios.

>The size for an app built with expo build on iOS is approximately 20mb (download), and Android is about 15mb. This is because a bunch of APIs are included regardless of whether or not you are using them.
If you'd like a smaller app size, you should use EAS Build.

如果使用 `expo build` 專案的話會有以下限制:
 - 部分 IOS 和 Android 原生的 api 在 Expo Go 無法跑動。
 - 部分的 api 儘管沒有被使用到還是會被打包在一起，造成 app 的最小 size 還是很大。

官方提供了 `EAS Build` 來解決這些限制。

## 什麼是 `EAS Build` ？

下方是 [expo 官方文件](https://docs.expo.dev/build/setup/) 上的介紹：

>EAS Build allows you to build a ready-to-submit binary of your app for the Apple App Store or Google Play Store.
EAS Build is a new service and we plan to address many of the current limitations in time.

透過 `EAS Build` 可以 build 出 app 並且上至 app store 。

#### `EAS Build` 有什麼限制嗎 ？

是的，儘管 `EAS Build` 可以解決某些 `expo build` 的限制，但是 `EAS Build` 也是有些限制的！ 💀

下方是 [expo 官方文件](https://docs.expo.dev/build-reference/limitations/) 上的介紹：

>You may find that the resources available are not sufficient to build your app if your build process requires more than 12GB RAM. In the future we will be adding more powerful configurations to increase memory limits and speed up build times.

官方的 [build infrastructure](https://docs.expo.dev/build-reference/infrastructure/) 還有一些可以優化的部分，在未來會透過一些設定來新增記憶體的限制以及優化 build app 所花的時間。

>Build jobs for Android install npm and Maven dependencies from a local cache. Build jobs for iOS install npm dependencies from a local cache, but there is no caching for CocoaPods yet.

在 build app 時所安裝的相依套件在 CocoaPods 上目前尚未使用 cache 機制處理。

>If your build takes longer than 2 hours to run, it will be cancelled. This limit is lower on the free plan, and is limit is subject to change in the future.

如果 build app 所花的時間超過兩小時，排程會自動取消。

>We recommend using Yarn Workspaces because it is the only monorepo tool that we provide first-class integration with at the moment.

官方建議使用 Yarn Workspaces 降低一些內部模組的相依。


## setup simulator on computer

這邊會以 Android Studio Emulator 為例：

- 下載完 Android Studio 與 Java 後需要加上環境變數以及確認 adb 的版本

#### 什麼是 `adb` ？

下方是 [ANDROID STUDIO 官方文件](https://developer.android.com/studio/command-line/adb) 上的介紹：

>Android Debug Bridge (adb) is a versatile command-line tool that lets you communicate with a device. The adb command facilitates a variety of device actions, such as installing and debugging apps, and it provides access to a Unix shell that you can use to run a variety of commands on a device.

透過 adb 指令可以方便我們安裝與在 Emulator debug。

## 小結
理解工具使用上的限制，後續思考應用哪些組合來因應需求會相對有依據。
在閱讀文章時如果有遇到什麼問題，或是有什麼建議，都歡迎留言告訴我，謝謝。😃


## 參考資料

- [Documentation | expo](https://docs.expo.dev/build-reference/infrastructure/)
- [Documentation | react-native](https://reactnative.dev/docs/environment-setup)
