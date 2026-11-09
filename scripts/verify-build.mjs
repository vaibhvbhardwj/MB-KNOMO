import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
const routes = ['index.html', 'about/index.html', 'contact/index.html', 'privacy/index.html', 'terms/index.html', '404.html'];
const titles = new Set(); let checked = 0;
for (const file of routes) {
  const html = await readFile(`dist/${file}`, 'utf8');
  assert.match(html, /<h1[ >]/, `${file} must contain a pre-rendered heading`);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]; assert.ok(title); assert.ok(!titles.has(title), 'Route titles must be unique'); titles.add(title);
  assert.match(html, /<main id="main"/); assert.match(html, /name="description"/);
  for (const match of html.matchAll(/(?:src|href)="(\/(?:assets|images|fonts|decor|licenses)\/[^"?#]+)"/g)) { assert.ok(existsSync(`dist${match[1]}`), `Missing asset in ${file}: ${match[1]}`); checked++; }
  assert.ok(!/SMTP_APP_PASSWORD|GOOGLE_PRIVATE_KEY|test-only-injected-transport/.test(html));
}
const home = await readFile('dist/index.html','utf8');
for (const id of ['services','solutions','products']) assert.ok(home.includes(`id="${id}"`));
const manifest = JSON.parse(await readFile('.openai/hosting.json','utf8')); assert.equal(manifest.static.directory, 'dist'); assert.ok(manifest.project_id);
console.log(`Verified ${routes.length} pre-rendered pages, unique metadata, all 3 home anchors and ${checked} asset references.`);
