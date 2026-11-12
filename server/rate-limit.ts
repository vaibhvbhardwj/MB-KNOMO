import { json } from '../netlify/functions/lib/contact-handler';
export interface RateStatement {
  bind(...values: (string | number)[]): RateStatement;
  first<T>(): Promise<T | null>;
  run(): Promise<unknown>;
}
export interface RateDatabase { prepare(sql: string): RateStatement }
export async function limitContact(request: Request, database: RateDatabase | undefined, now = Date.now()): Promise<Response | null> {
  if (!database) return json({ error: 'Inquiry delivery is temporarily unavailable. Please email either business contact.' }, 503);
  const bucket = Math.floor(now / 180000);
  // Cloudflare supplies the connecting IP. Without a trusted identifier, share a restrictive bucket.
  const identifier = request.headers.get('cf-connecting-ip') || request.headers.get('oai-authenticated-user-id') || 'anonymous-shared';
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${new URL(request.url).origin}|${bucket}|${identifier}`));
  const key = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
  const result = await database.prepare('INSERT INTO contact_rate_limits (key, bucket, attempts) VALUES (?, ?, 1) ON CONFLICT(key) DO UPDATE SET attempts = attempts + 1 RETURNING attempts').bind(key, bucket).first<{ attempts: number }>();
  await database.prepare('DELETE FROM contact_rate_limits WHERE bucket < ?').bind(bucket - 1).run();
  if (!result || result.attempts > 5) {
    const response = json({ error: 'Please wait a few minutes before trying again.' }, 429);
    response.headers.set('Retry-After', String(Math.ceil((180000 - now % 180000) / 1000)));
    return response;
  }
  return null;
}
