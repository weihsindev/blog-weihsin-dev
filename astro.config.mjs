import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://blog.weihsin.dev',
  markdown: {
    // 預設是 github-dark,會在淺色版面上壓出一塊深色,而且內嵌樣式會蓋掉 blog.css。
    shikiConfig: { theme: 'github-light' },
  },
});
