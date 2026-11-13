import { assets } from 'virtual:site-assets';
import { createContactHandler, type ContactEnv } from '../netlify/functions/lib/contact-handler';
import { limitContact, type RateDatabase } from './rate-limit';
type WorkerEnv = Record<string, unknown> & { CONTACT_DB?: RateDatabase };
const securityHeaders = {
  'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', 'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
};
export default {
  async fetch(request: Request, env: WorkerEnv): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === '/api/contact') {
      const config = Object.fromEntries(Object.entries(env).filter(([, value]) => typeof value === 'string')) as ContactEnv;
      return createContactHandler(config, { limit: req => limitContact(req, env.CONTACT_DB) })(request);
    }
    if (!['GET', 'HEAD'].includes(request.method)) return new Response(null, { status: 405, headers: { ...securityHeaders, Allow: 'GET, HEAD' } });
    const pathname = url.pathname;
    let path = pathname === '/' ? '/index.html' : pathname;
    if (!assets[path] && !path.split('/').pop()?.includes('.')) path = `${path.replace(/\/$/, '')}/index.html`;
    const found = assets[path]; const asset = found || assets['/404.html'];
    const headers = new Headers({ ...securityHeaders, 'Content-Type': asset.contentType, 'Cache-Control': path.startsWith('/assets/') ? 'public, max-age=31536000, immutable' : 'public, max-age=300' });
    const bytes = Uint8Array.from(atob(asset.body), c => c.charCodeAt(0));
    let body: BodyInit | null = bytes;
    if (asset.gzip) {
      // Assets are compressed inside the bundle only. The hosting gateway owns wire
      // compression and can normalize Content-Encoding, so return decoded bytes.
      body = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    }
    if (request.method === 'HEAD') body = null;
    return new Response(body, { status: found ? 200 : 404, headers });
  },
};
