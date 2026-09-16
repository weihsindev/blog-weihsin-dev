import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 文章。draft: true 的不會出現在列表,也不會產生頁面。
const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.date(),
    summary: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
