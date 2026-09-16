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
npm run build     產生 dist
npm run deploy    建置後部署到 Cloudflare
```

## 這個站不放什麼

附屬於某個系統、系統改了就要跟著改的東西（架構說明、API 參考、ADR）
屬於 [docs.weihsin.dev](https://docs.weihsin.dev)，不放這裡。
