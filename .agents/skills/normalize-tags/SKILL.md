---
name: normalize-tags
description: 依專案根目錄 AGENTS.md 的 Tag 正規化規範，為文章推薦 canonical tags（AI 推薦、人核可）。使用者要求正規化 posts/ 下文章的 tags 或處理 tags backlog 時使用。
---

# normalize-tags

請完整讀取並嚴格依照專案根目錄 `AGENTS.md` 的「Tag 正規化規範」處理使用者指定的
文章或 backlog。`AGENTS.md` 是唯一真相來源：先執行其「觸發方式與輸入驗證」節的
檢查，再完成其中所有要求（只從 `_data/tagTaxonomy.json` 的封閉詞彙表推薦、每個
建議附依據、以 diff 呈現並等使用者核可才寫入、譯文 tags 與來源逐字同步、寫入後
必跑 `npm run check-tags`）。

本檔沒有任何額外規則；若本檔與 `AGENTS.md` 有出入，以 `AGENTS.md` 為準。
