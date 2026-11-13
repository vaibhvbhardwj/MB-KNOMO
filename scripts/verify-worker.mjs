import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
const { default: worker } = await import(pathToFileURL(resolve('dist/server/index.js')).href);
for (const path of ['/', '/about', '/contact', '/privacy', '/terms']) {
  const response = await worker.fetch(new Request(`https://example.test${path}`),{});
  assert.equal(response.status,200,path);assert.match(response.headers.get('content-type'),/text\/html/);
  const html=await response.text();assert.match(html,/<h1[ >]/);assert.ok(html.includes('bharatsingh2110023@gmail.com'));
}
const zipped=await worker.fetch(new Request('https://example.test/',{headers:{'accept-encoding':'gzip'}}),{});assert.equal(zipped.headers.get('content-encoding'),null);assert.match(await zipped.text(),/<h1[ >]/,'The hosting gateway must receive readable HTML even when gzip is accepted');
for (const path of ['/images/maven-bridge-logo.png','/images/knomo-logo.webp','/fonts/font-0.ttf']) {const response=await worker.fetch(new Request(`https://example.test${path}`),{});assert.equal(response.status,200);assert.ok((await response.arrayBuffer()).byteLength>100);}
assert.equal((await worker.fetch(new Request('https://example.test/missing-page'),{})).status,404);
assert.equal((await worker.fetch(new Request('https://example.test/about',{method:'HEAD'}),{})).body,null);
const status=await worker.fetch(new Request('https://example.test/api/contact'),{});assert.deepEqual(await status.json(),{configured:false});
console.log('Verified bundled Worker routes, gateway-safe text delivery, both logos, font asset, 404, HEAD and contact configuration response.');
