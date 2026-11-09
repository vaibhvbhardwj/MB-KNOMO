import nodemailer from 'nodemailer';
import { JWT } from 'google-auth-library';
import { contactSchema, type ContactData } from '../../../src/lib/contact-schema';
type Env = Record<string, string | undefined>;
type SendMail = (data: { from: string; to: string; replyTo: string; subject: string; text: string }) => Promise<{ accepted?: (string | { address: string })[] }>;
const MAX_BYTES = 16000;
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
export const sheetSafe = (s: string) => /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
export async function appendLead(data: ContactData, env: Env) {
  if (!env.GOOGLE_SHEET_ID || !env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_PRIVATE_KEY) return;
  const client = new JWT({ email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  const a = data.attribution;
  const row = [new Date().toISOString(), data.name, data.email, data.company, data.phone, data.interest, data.budget, data.message, `${data.preferredDay} ${data.preferredTime}`.trim(), data.timezone, a?.utm_source || '', a?.utm_medium || '', a?.utm_campaign || '', a?.ref || '', data.referral, data.industry, 'New'].map(sheetSafe);
  await client.request({ url: `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(env.GOOGLE_SHEET_ID)}/values/${encodeURIComponent('Leads!A:Q')}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, method: 'POST', data: { values: [row] }, timeout: 8000 });
}
function configured(env: Env) { return !!(env.SMTP_USER && env.SMTP_APP_PASSWORD && env.CONTACT_TO_EMAIL && env.SITE_URL); }
async function readBody(request: Request): Promise<string> {
  if (Number(request.headers.get('content-length') || '0') > MAX_BYTES) throw new RangeError();
  const reader = request.body?.getReader(); if (!reader) return '';
  let count = 0; const chunks: Uint8Array[] = [];
  while (true) { const { value, done } = await reader.read(); if (done) break; count += value.byteLength; if (count > MAX_BYTES) { await reader.cancel(); throw new RangeError(); } chunks.push(value); }
  const merged = new Uint8Array(count); let offset = 0; for (const c of chunks) { merged.set(c, offset); offset += c.byteLength; }
  return new TextDecoder().decode(merged);
}
export function createContactHandler(env: Env, dependencies: { sendMail?: SendMail; append?: typeof appendLead } = {}) {
  return async function handle(request: Request): Promise<Response> {
    if (request.method === 'GET') return json({ configured: configured(env) });
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'GET, POST' } });
    const origin = request.headers.get('origin'); const requestOrigin = new URL(request.url).origin;
    let allowedOrigin: string; try { allowedOrigin = new URL(env.SITE_URL || requestOrigin).origin; } catch { return json({ error: 'Inquiry delivery needs configuration. Please save a copy of your brief.' }, 503); }
    if (!origin || origin !== allowedOrigin || request.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'This request could not be authorized. Please use the contact form on the website.' }, 403);
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ error: 'Please submit the inquiry as JSON.' }, 415);
    let raw: unknown; try { raw = JSON.parse(await readBody(request)); } catch (e) { return json({ error: e instanceof RangeError ? 'This inquiry is too large. Please shorten it.' : 'The inquiry could not be read.' }, e instanceof RangeError ? 413 : 400); }
    const parsed = contactSchema.safeParse(raw); if (!parsed.success) return json({ error: 'Please check the required fields and try again.', fields: parsed.error.issues.map(i => ({ field: i.path[0], message: i.message })) }, 400);
    const data = parsed.data; if (data.honey) return json({ error: 'This inquiry could not be accepted. Please try again.' }, 400);
    if (!configured(env)) return json({ error: 'Inquiry delivery is not enabled yet. Please save a copy of your brief or use the verified email shown on this site when available.' }, 503);
    const lines = ['NEW PROJECT INQUIRY — MAVEN BRIDGE × KNOMO DEVELOPERS', '', ...Object.entries(data).filter(([k]) => !['honey', 'attribution'].includes(k)).map(([k, v]) => `${k}: ${v}`), '', 'Consented campaign details:', ...Object.entries(data.attribution || {}).map(([k, v]) => `${k}: ${v}`), '', 'Callback preferences are requests, not confirmed bookings.'];
    let accepted = false;
    try {
      const transport = dependencies.sendMail ? null : nodemailer.createTransport({ host: env.SMTP_HOST || 'smtp.gmail.com', port: Number(env.SMTP_PORT || 465), secure: (env.SMTP_PORT || '465') === '465', requireTLS: true, auth: { user: env.SMTP_USER, pass: env.SMTP_APP_PASSWORD }, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 15000 });
      const send = dependencies.sendMail || ((mail) => transport!.sendMail(mail));
      try { const result = await send({ from: env.SMTP_USER!, to: env.CONTACT_TO_EMAIL!, replyTo: data.email, subject: `New project inquiry — ${data.interest}`, text: lines.join('\n') }); accepted = !!result.accepted?.length; } finally { transport?.close(); }
    } catch { console.error('Contact email delivery failed. No inquiry data logged.'); }
    if (!accepted) return json({ error: 'We could not deliver your inquiry. Please save a copy and try again later, or use the verified email shown on this site.' }, 502);
    try { await (dependencies.append || appendLead)(data, env); } catch { console.error('Optional CRM append failed; the inquiry was delivered by email.'); }
    return json({ accepted: true });
  };
}
