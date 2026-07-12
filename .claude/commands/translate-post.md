---
description: 依 AGENTS.md 將繁中技術文章翻成指定語系草稿
argument-hint: <posts/作者/檔名.md> [語系,...]
disable-model-invocation: true
---

請完整讀取並嚴格依照專案根目錄 `AGENTS.md` 的文章翻譯規範處理：

    $ARGUMENTS

開始前先驗證：

- 第一個參數必須是存在的繁中原文 `posts/<author>/<slug>.md`。
- 第二個參數若存在，必須是逗號分隔、且列於 `_data/langs.json` 的非預設語系。
- 未指定語系時，依 `AGENTS.md` 使用目前設定的全部預設目標語系。
- 輸入無效時停止並清楚說明，不要猜測路徑、語系或修改任何檔案。

`AGENTS.md` 是翻譯流程的唯一真相來源。完整執行其中所有要求，包括合併
`translationTargets`、使用守門腳本取得 `sourceHash`、產出 `draft: true` 譯文、
回譯校驗，以及檢查作者在地化簡介。

不要自行移除 `draft`、填造人工審核欄位、提交或發佈內容。
