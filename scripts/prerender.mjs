import { build } from 'vite';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
await build({ build: { ssr: 'src/entry-server.tsx', outDir: '.sites-runtime/ssr', emptyOutDir: true } });
const { render } = await import(pathToFileURL(resolve('.sites-runtime/ssr/entry-server.js')).href);
const template = await readFile('dist/index.html', 'utf8');
const siteUrl = process.env.VITE_SITE_URL || '';
for (const path of ['/', '/about', '/contact', '/privacy', '/terms', '/404']) {
  const { html, meta } = render(path);
  let page = template.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
  const esc = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  page = page.replace(/<title>.*?<\/title>/, `<title>${esc(meta?.title || 'Page not found — Maven Bridge')}</title>`);
  if (meta) { page = page.replace(/name="description" content="[^"]*"/, `name="description" content="${esc(meta.description)}"`); page = page.replace(/property="og:title" content="[^"]*"/, `property="og:title" content="${esc(meta.title)}"`); page = page.replace(/property="og:description" content="[^"]*"/, `property="og:description" content="${esc(meta.description)}"`); }
  if (siteUrl) { const canonical = new URL(path === '/' ? '/' : path, siteUrl).href; page = page.replace('</head>', `<link rel="canonical" href="${esc(canonical)}"/><meta property="og:url" content="${esc(canonical)}"/></head>`).replace('content="/images/social.jpg"', `content="${esc(new URL('/images/social.jpg', siteUrl).href)}"`); }
  if (path !== '/') page = page.replace(/<link rel="preload" as="image" href="\/images\/coast-1600.webp"\s*\/>/, '');
  if (path === '/404') { await writeFile('dist/404.html', page); continue; }
  if (path === '/') await writeFile('dist/index.html', page); else { await mkdir(`dist${path}`, { recursive: true }); await writeFile(`dist${path}/index.html`, page); }
}
const routes = ['', '/about', '/contact', '/privacy', '/terms'];
await writeFile('dist/robots.txt', `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${new URL('/sitemap.xml', siteUrl).href}\n` : ''}`);
await writeFile('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${siteUrl ? routes.map(p => `<url><loc>${new URL(p || '/', siteUrl).href}</loc></url>`).join('') : ''}</urlset>`);
console.log('Pre-rendered Home, About, Contact, Privacy, Terms and 404.');
