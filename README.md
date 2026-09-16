# blog-weihsin-dev

`blog.weihsin.dev` —— 技術學習歷程。

Astro + Markdown，靜態輸出，部署在 Cloudflare Workers。

## 寫一篇新文章

在 `src/content/posts/` 建立 `檔名.md`，frontmatter 如下：

```yaml
---
title: 文章標題
date: 2026-09-16
summary: 一句話說明，會顯示在列表頁。可省略。
draft: false
---
```

檔名就是網址：`src/content/posts/foo.md` → `/posts/foo/`。
發布之後不要改檔名，那是別人引用你的位址。

`draft: true` 的文章不會出現在列表，也不會產生頁面。

## 指令

```
npm run dev       本機預覽
npm test          在隔離專案檢查文章發布與草稿隱藏
npm run build     產生 dist
npm run check:site 檢查產物中的首頁與文章頁
npm run preview   預覽建置結果
```

## 正式發布

正式發布統一由 `.github/workflows/deploy.yml` 執行，不提供本機直接部署指令。
推送到 `main` 後自動觸發；需要重新發布目前版本時，可在 GitHub Actions
選擇 `deploy` → `Run workflow`，分支選 `main`。

流程依序執行測試、建置、產物檢查、部署、線上版本比對，以及首頁與文章頁檢查。
測試文章、草稿、快取與建置產物都位於暫存專案，不會發布到正式站。
目前沒有文章時，線上檢查會確認首頁的空列表提示；有文章後會逐篇檢查。

發布後應確認整個 workflow 成功；檢查失敗不會自動回滾。
需要回復時，將有問題的修改以新的 revert commit 推到 `main`。
舊 commit 的 workflow 重跑會被版本檢查跳過，不作為回滾方式。

## 這個站不放什麼

附屬於某個系統、系統改了就要跟著改的東西（架構說明、API 參考、ADR）
屬於 [docs.weihsin.dev](https://docs.weihsin.dev)，不放這裡。
