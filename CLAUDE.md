# CLAUDE.md — blog.weihsin.dev

技術學習歷程。全域規則仍然適用，以下只列「看起來合理但會壞事」的動作。

## 這個站的定位

- **它不是 docs。** docs 放的是附屬於某個系統、系統改了就要跟著改的東西
  (架構說明、API 參考、ADR)。這裡放的是有日期、發表後不再改的文章。
  同一件事不要在兩邊各寫一次。
- **它會活得比求職期久。** 所以它是獨立的站、獨立的 repo，不掛在 `weihsin.dev` 底下。
- **目前刻意不從 `weihsin.dev` 連過來。** 文章累積到一定量之前，暫時不主動宣傳，
  但允許搜尋引擎收錄，不需要全站 `noindex`。
  要連的時候是改 `weihsin-dev`，不是改這裡。

## 寫作

- **把判斷寫成判斷。** 「當時的情況就是這樣」是最常見的失誤 —— 實際上那是個決定，
  要寫出為什麼那樣選、代價是什麼。
- **新技術要接到已有的理解上，不要只寫「我學會了 X」。** 前者的主詞是四年的實戰經驗，
  後者的主詞是那個新名詞，讀起來是兩種人。
- **不得洩漏前雇主(和潤企業)的系統細節。** 不指名公司、不放實際資料結構、
  不描述可辨識的商業規則。
- **中文標點用全形**，逗號 `，`(U+FF0C)、分號 `；`、冒號 `：`、頓號 `、`；
  括號用半形 `()`。YAML frontmatter 的結構符號維持半形 ASCII。
  半形與全形在等寬字體下幾乎分不出來，用 grep 自檢，不要靠肉眼。

## 技術

- **正式發布只走 GitHub Actions** (`.github/workflows/deploy.yml`)。本機用 `npm run dev`
  或 `npm run preview` 預覽，不直接執行 `wrangler deploy`。操作方式見 `README.md`。
- **`wrangler.jsonc` 的 `name` 是 Cloudflare Worker 的身分**，不是專案名稱。
  改掉再部署會建立新的 Worker，舊的仍綁著網域繼續服務 → 部署顯示成功但線上不更新。
- **網域宣告在 `wrangler.jsonc` 的 `routes` 裡**，不要只掛在 dashboard。
  這是踩過的坑：Cloudflare 的 Git 連線斷掉時不會通知，而 dashboard 上的設定
  沒有版控、沒有 diff。
- **設計 token 是從 `weihsin-dev/src/styles/resume.css` 複製來的**，刻意重複。
  三個站各自獨立，一個站改版不該牽動另外兩個。
- **Shiki 主題必須維持淺色**(`github-light`)。預設的 `github-dark` 會用內嵌樣式
  在淺色版面上壓出一塊深色，而且蓋掉 `blog.css` 的設定。
- **草稿用 frontmatter 的 `draft: true`**，不會出現在列表，也不會產生頁面。
