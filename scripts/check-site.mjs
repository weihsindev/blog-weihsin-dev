import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const site = process.argv[2];

async function read(path) {
  if (!site) return readFile(`dist${decodeURIComponent(path)}${path.endsWith('/') ? 'index.html' : ''}`, 'utf8');
  const url = new URL(path, site);
  url.searchParams.set('check', `${process.env.GITHUB_SHA ?? 'local'}-${Date.now()}`);
  const response = await fetch(url, {
    headers: { 'Cache-Control': 'no-cache' },
    signal: AbortSignal.timeout(15000),
  });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}`);
  assert.ok(response.headers.get('content-type')?.includes('text/html'), `${path}: expected HTML`);
  return response.text();
}

const expected = await readFile('dist/index.html', 'utf8');
const title = expected.match(/<title>[\s\S]*?<\/title>/)?.[0];
assert.ok(title, 'Blog homepage must have a title');
const home = await read('/');
assert.ok(home.includes(title), 'Blog homepage title is missing or outdated');
const paths = [...new Set([...expected.matchAll(/href="(\/posts\/[^"?#]+)"/g)].map(match => match[1]))];
if (paths.length === 0) assert.ok(home.includes('還沒有文章。'), 'Empty blog message is missing');
for (const path of paths) {
  assert.ok(home.includes(`href="${path}"`), `Homepage is missing ${path}`);
  const article = await read(path);
  const local = await readFile(`dist${decodeURIComponent(path)}index.html`, 'utf8');
  const heading = local.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)?.[0];
  assert.ok(heading, `${path}: article heading is missing`);
  assert.ok(article.includes(heading), `${path}: article is missing or outdated`);
}
console.log(`✓ ${site ?? 'dist'}: blog homepage and ${paths.length} published articles`);
