---
name: translate-post
description: 依專案根目錄 AGENTS.md 的翻譯規範，把繁中技術文章翻成指定語系的草稿譯文。使用者要求翻譯 posts/ 下的文章（如「翻譯 posts/tian/git-flow.md 成 en,ja」）時使用。
---

# translate-post

請完整讀取並嚴格依照專案根目錄 `AGENTS.md` 的「文章翻譯規範」處理使用者指定的
原文與語系。`AGENTS.md` 是唯一真相來源：先執行其「觸發方式與輸入驗證」節的
檢查，再完成其中所有要求（合併 `translationTargets`、以守門腳本取得
`sourceHash`、產出 `draft: true` 譯文、回譯校驗、檢查作者在地化簡介）。

本檔沒有任何額外規則；若本檔與 `AGENTS.md` 有出入，以 `AGENTS.md` 為準。
