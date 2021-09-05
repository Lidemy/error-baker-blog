---
title: 如何從 GitHub Template 更新 repo？
date: 2021-09-05
tags: [github]
author: sixwings
layout: layouts/post.njk
---

<!-- summary -->
從 Github Template 建立的 repo，當參照的 Github Template 更新的時候，要如何同步版本呢？
<!-- summary -->
<!-- more -->

# 前情提要

事情是這樣子的，身為[程式導師實驗計畫](https://bootcamp.lidemy.com/) 的學生，最近老師默默地更新了[課程的 Template](https://github.com/Lidemy/mentor-program-5th/) ，於是想說跟著一起更新，也順便記錄這段過程。

# 初步說明

![](/img/posts/sixwings/figue-1.png)

template 是這次需要更新的遠端 remote，後面三個紅色方塊為本次需要更新的 commit。
而下方的 My repo 則是目前的狀態，綠色方塊是從 template 那邊初始化的 commit，而後面黃色方塊則是後續更新作業時提交的 commit。另外後面尚有一段還沒 merge 進去的 homework 作業分支。

# 合併前，請務必先做的動作

請先把 repo 根目錄下的 **package.json, package-lock.json** 檔案複製到 repo 以外的資料夾做備份，因為接下來的衝突會需要使用到它。

# 分支合併 & 衝突發生

![](/img/posts/sixwings/figue-2.png)

首先需要先在本地端建立遠端主機連線，然後再將 template 上的 main/master 分支合併到本地端的 main/master 分支，然後會需要處理合併時發生的衝突問題。

新增遠端主機，使用 access token 連線請選擇第 1 個選項，SSH keys 連線請選擇第 2 個選項
1. `git remote set-url origin https://Lidemy:<access-token>@github.com/Lidemy/mentor-program-5th.git`
2. `git remote add template git@github.com:Lidemy/mentor-program-5th.git`

從遠端 template 抓資料下來
`git fetch template`

切換到主分支，根據自己的主分支命名選擇 main 或 master
`git checkout master`

把 template/master 分支的東西合併到 master 主分支，
`git merge template/master`

沒意外的話，這時候會看到錯誤訊息 **fatal: refusing to merge unrelated histories**
這是因為 git 從 2.9.0 開始預設不允許合併沒有共同祖先的分支，要解決這個問題需要加上 `--allow-unrelated-histories` 參數。
`git merge template/master --allow-unrelated-histories`

沒意外的話，這時候 git 會跳出 conflict 衝突警告，請你先解決好衝突再發一個 commit

```txt
error: Merging is not possible because you have unmerged files.
hint: Fix them up in the work tree, and then use 'git add/rm <file>'
hint: as appropriate to mark resolution and make a commit.
fatal: Exiting because of an unresolved conflict.
```

# 解決衝突

先確認一下衝突檔案有哪些？
`git status`

![](/img/posts/sixwings/conflict-files.png)

## 手動解衝突

衝突檔案打開會看到大概像這樣的東西

```txt
<<<<<<< HEAD
...
... # 這邊會是本地端 repo 自己目前的內容
...
=======
...
... # 這邊會是從課程 template 拉過來的內容
...
>>>>>>> template/master
```

這時候解決衝突的辦法是選擇保留 HEAD 或是 template/master 的內容

衝突檔案大概會有兩種：
1. 老師的 README.md 檔案
2. homework 資料夾底下的

因為這次合併主要就是為了把老師更新的內容放到自己的 repo 上，所以當然就會是選擇保留 template/master 的內容。而作業檔案的部分則是選擇保留 HEAD 的部分。

記得後面要把下面的內容也一起刪掉唷

- `<<<<<<< HEAD`
- `=======`
- `>>>>>>> template/master`

再來可能會遇到很棘手的衝突檔 **package.json** **package-lock.json** 這兩個衝突檔基本上用手動修改的話會非常非常痛苦，所以後來想了一個比較簡便的方式，就是先把原本的檔案備份下來直接蓋過去。在正式專案這樣做應該是不好的，但目前也找不到一個比較好的解決方式。

有興趣可以參照這篇文章的說明：[很多人上来就删除的package-lock.json，还有这么多你不知道的！-技术圈](https://jishuin.proginn.com/p/763bfbd570e3)
看起來大家對這兩個檔案也蠻頭痛的

## 用 SourceTree 解衝突

這個解法需要安裝 [Sourcetree](https://www.sourcetreeapp.com/) ，然後 Ctrl+O 打開本地端的 repo 做後續的操作。
這時候應該會看到一些有驚嘆號的衝突檔案，解衝突的方式是在檔案上面點右鍵，然後選擇「解決衝突/使用 我的版本 解決衝突」

![](/img/posts/sixwings/sourcetree-resolve.png)

目前找到的教學幾乎都是手動修改檔案解衝突，要不然就是像 SourceTree 這種 GUI 介面的軟體才有提供指定保留什麼版本的便利功能。

好不容易修改上面的衝突檔之後，再來就是把這些衝突檔 add 加入 commit
這時候這個艱辛的 merge 就終於完成了。

# 同步更新，合併到其他的作業分支上

![](/img/posts/sixwings/figue-3.png)

完成以上動作後，本地端主分支就會是最新的版本，若這時候還有其他正在撰寫中的作業分支，請先一併更新，避免後面主分支和作業分支發生版本落差。

切換到作業分支
`git checkout weekN`

把 master 分支的內容合併到目前 (weekN) 分支
`git merge master`

其他份作業依此類推
`git checkout weekXX`
`git merge master`

最後，如果不需要這個遠端的話，就可以把它移除了
`git remote rm template`

# 回顧知識點

- 學習如何新增遠端主機並且拉取新版本合併
- 學習如何處理合併時發生的衝突

我是 sixwings，追尋技術的程式人，我們下次見 :)
