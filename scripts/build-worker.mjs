import { readdir, readFile, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { gzipSync } from 'node:zlib';
import { build } from 'vite';
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };
const assets = {};
async function walk(directory, prefix = '') {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || entry.name === 'server') continue;
    const relative = `${prefix}/${entry.name}`;
    if (entry.isDirectory()) { await walk(join(directory,entry.name),relative); continue; }
    if (entry.name === 'coast-original.jpg') continue; // Source photo is not a runtime asset.
    const raw = await readFile(join(directory,entry.name));
    const compress = ['.html','.js','.css','.svg','.txt','.xml'].includes(extname(entry.name));
    assets[relative] = { body: (compress ? gzipSync(raw,{ level:9 }) : raw).toString('base64'), contentType: types[extname(entry.name)] || 'application/octet-stream', gzip: compress };
  }
}
await walk('dist');
await build({ configFile:false, publicDir:false, plugins:[{ name:'embed-site-assets', resolveId(id){if(id==='virtual:site-assets') return '\0site-assets';},load(id){if(id==='\0site-assets')return `export const assets=${JSON.stringify(assets)};`;} }],build:{ outDir:'dist/server',emptyOutDir:true,lib:{entry:'server/worker.ts',formats:['es'],fileName:()=> 'index.js'},target:'es2022',minify:true } });
await mkdir('dist/.openai',{recursive:true});
await writeFile('dist/.openai/hosting.json',await readFile('.openai/hosting.json'));
console.log(`Bundled ${Object.keys(assets).length} local assets into the Sites Worker (${((await stat('dist/server/index.js')).size/1024/1024).toFixed(2)} MiB).`);
