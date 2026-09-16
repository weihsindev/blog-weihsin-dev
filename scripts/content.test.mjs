import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { cp, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const root = fileURLToPath(new URL('..', import.meta.url));

test('publishes articles but excludes drafts from the list and generated pages', async (t) => {
  const dir = await mkdtemp(join(tmpdir(), 'blog-content-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  for (const path of ['src', 'public', 'package.json']) {
    await cp(join(root, path), join(dir, path), { recursive: true });
  }
  await symlink(join(root, 'node_modules'), join(dir, 'node_modules'), 'dir');
  // 快取與產物都留在暫存專案,避免測試文章進入正式建置。
  await writeFile(join(dir, 'astro.config.mjs'),
    `import config from ${JSON.stringify(new URL('../astro.config.mjs', import.meta.url).href)};\n` +
    'export default { ...config, cacheDir: "./.astro-cache" };\n');
  const posts = join(dir, 'src/content/posts');
  await mkdir(posts, { recursive: true });
  for (const [slug, draft] of [['smoke-published', false], ['smoke-draft', true]]) {
    await writeFile(join(posts, `${slug}.md`),
      `---\ntitle: ${slug}\ndate: 2026-09-17\ndraft: ${draft}\n---\n${slug} body\n`);
  }
  execFileSync(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], { cwd: dir, stdio: 'pipe' });
  const index = await readFile(join(dir, 'dist/index.html'), 'utf8');
  assert.ok(index.includes('href="/posts/smoke-published/"'));
  const article = await readFile(join(dir, 'dist/posts/smoke-published/index.html'), 'utf8');
  assert.ok(article.includes('smoke-published body'));
  assert.ok(!index.includes('smoke-draft'), 'Draft leaked into the homepage');
  assert.equal(existsSync(join(dir, 'dist/posts/smoke-draft')), false, 'Draft page was generated');
  execFileSync(process.execPath, [join(root, 'scripts/check-site.mjs')], { cwd: dir, stdio: 'pipe' });

  await rm(join(dir, 'dist/posts/smoke-published/index.html'));
  const broken = spawnSync(process.execPath, [join(root, 'scripts/check-site.mjs')], { cwd: dir, encoding: 'utf8' });
  assert.equal(broken.status, 1, 'Site check must reject a broken article link');
});
