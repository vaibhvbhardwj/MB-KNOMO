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
  assert.ok(!/EMAILJS_PRIVATE_KEY|GOOGLE_PRIVATE_KEY|test-only-injected-transport/.test(html));
}
const home = await readFile('dist/index.html','utf8');
for (const id of ['services','solutions','products']) assert.ok(home.includes(`id="${id}"`));
const manifest = JSON.parse(await readFile('.openai/hosting.json','utf8')); assert.equal(manifest.d1, 'CONTACT_DB'); assert.ok(manifest.project_id); if(!process.argv.includes('--netlify')) assert.ok(existsSync('dist/server/index.js'));
assert.ok(home.includes('/images/maven-bridge-logo.png')); assert.ok(home.includes('/images/knomo-logo.webp'));
assert.ok(home.includes('bharatsingh2110023@gmail.com')); assert.ok(home.includes('vaibhvbhardwj@gmail.com'));
const contact = await readFile('dist/contact/index.html','utf8');
const submitButton = contact.match(/<button\b[^>]*type="submit"[^>]*>/)?.[0];
assert.ok(submitButton && !/\bdisabled\b/.test(submitButton), 'The contact form must not be disabled by a readiness preflight.');
assert.ok(!contact.includes('The inquiry form is temporarily unavailable.'), 'Removed availability banner must stay removed.');
console.log(`Verified ${routes.length} pre-rendered pages, unique metadata, all 3 home anchors and ${checked} asset references.`);
