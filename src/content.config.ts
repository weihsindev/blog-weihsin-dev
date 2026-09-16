import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 文章。draft: true 的不會出現在列表,也不會產生頁面。
// tags 現在只存不用 —— 分類頁等文章累積到看得出群聚再做,
// 但欄位先留著,才不必回頭編輯每一篇舊文。
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
