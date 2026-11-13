import { contactSchema, type ContactData } from '../../../src/lib/contact-schema';

export type ContactEnv = Record<string, string | undefined>;
export type EmailRequest = { template: string; params: Record<string, string> };
type Dependencies = {
  fetch?: typeof fetch;
  sendEmail?: (email: EmailRequest) => Promise<void>;
  delay?: (milliseconds: number) => Promise<void>;
  append?: (data: ContactData, env: ContactEnv) => Promise<void>;
  limit?: (request: Request) => Promise<Response | null>;
};
const MAX_BYTES = 16000;
export const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
export const sheetSafe = (s: string) => /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
export function isConfigured(env: ContactEnv) {
  return !!(env.EMAILJS_SERVICE_ID && env.EMAILJS_NOTIFICATION_TEMPLATE_ID && env.EMAILJS_ACK_TEMPLATE_ID && env.EMAILJS_PUBLIC_KEY && env.CONTACT_TO_EMAIL && env.SITE_URL);
}
async function readBody(request: Request): Promise<string> {
  if (Number(request.headers.get('content-length') || '0') > MAX_BYTES) throw new RangeError();
  const reader = request.body?.getReader(); if (!reader) return '';
  let count = 0; const chunks: Uint8Array[] = [];
  while (true) { const { value, done } = await reader.read(); if (done) break; count += value.byteLength; if (count > MAX_BYTES) { await reader.cancel(); throw new RangeError(); } chunks.push(value); }
  const merged = new Uint8Array(count); let offset = 0; for (const c of chunks) { merged.set(c, offset); offset += c.byteLength; }
  return new TextDecoder().decode(merged);
}
export class EmailDeliveryError extends Error {
  constructor(public readonly status: number) { super('Email delivery was not accepted.'); }
}
export async function sendEmailJS(env: ContactEnv, email: EmailRequest, requestFetch: typeof fetch = fetch) {
  const response = await requestFetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ service_id: env.EMAILJS_SERVICE_ID, template_id: email.template, user_id: env.EMAILJS_PUBLIC_KEY, ...(env.EMAILJS_PRIVATE_KEY ? { accessToken: env.EMAILJS_PRIVATE_KEY } : {}), template_params: email.params }),
    signal: AbortSignal.timeout(10000),
  });
  // Provider error bodies may contain submitted information. Never log or return them.
  if (!response.ok) throw new EmailDeliveryError(response.status);
}
function notificationParams(data: ContactData, env: ContactEnv): Record<string, string> {
  const values: Record<string, string> = {
    name: data.name, from_name: data.name, from_email: data.email, email: data.email,
    company: data.company, service_interest: data.interest, interest: data.interest,
    message: data.message, phone: data.phone || 'Not provided', website: data.website || 'Not provided', budget: data.budget,
    preferred_callback: `${data.preferredDay} ${data.preferredTime}`.trim() || 'Not requested', timezone: data.timezone || 'Not provided',
    referral: data.referral || 'Not provided', industry: data.industry || 'Not specified',
    utm_source: data.attribution?.utm_source || '', utm_medium: data.attribution?.utm_medium || '',
    utm_campaign: data.attribution?.utm_campaign || '', referral_code: data.attribution?.ref || '',
    consent: 'Yes', attribution_consent: data.attributionConsent ? 'Yes' : 'No',
    to_email: env.CONTACT_TO_EMAIL!, to_name: 'Maven Bridge × Knomo Developers',
    reply_to: data.email, subject: `New project inquiry — ${data.interest}`, title: 'New project inquiry',
  };
  values.details = Object.entries(values).filter(([k]) => !['details', 'message', 'to_email', 'to_name', 'subject', 'title'].includes(k)).map(([k, v]) => `${k}: ${v || 'Not provided'}`).join('\n');
  return values;
}
function acknowledgementParams(data: ContactData, env: ContactEnv): Record<string, string> {
  const receipt = 'Thank you for contacting Maven Bridge and Knomo Developers. We have received your inquiry. Our team will review your requirements and contact you to arrange a conversation. Any preferred callback time is a request, not a confirmed booking.';
  return {
    name: data.name, from_name: 'Maven Bridge × Knomo Developers', to_name: data.name,
    to_email: data.email, email: data.email, from_email: env.CONTACT_REPLY_TO_EMAIL || 'bharatsingh2110023@gmail.com',
    reply_to: env.CONTACT_REPLY_TO_EMAIL || 'bharatsingh2110023@gmail.com',
    company: 'Maven Bridge × Knomo Developers', title: 'We received your inquiry', subject: 'We received your inquiry — Maven Bridge × Knomo Developers',
    message: receipt, acknowledgement_message: receipt,
  };
}
export function createContactHandler(env: ContactEnv, dependencies: Dependencies = {}) {
  const delay = dependencies.delay || ((ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)));
  const send = dependencies.sendEmail || ((email: EmailRequest) => sendEmailJS(env, email, dependencies.fetch));
  return async function handle(request: Request): Promise<Response> {
    if (request.method === 'GET') return json({ configured: isConfigured(env) });
    if (request.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'GET, POST' } });
    const origin = request.headers.get('origin'); const requestOrigin = new URL(request.url).origin;
    let allowedOrigin: string; try { allowedOrigin = new URL(env.SITE_URL || requestOrigin).origin; } catch { return json({ error: 'Inquiry delivery needs configuration. Please email either business contact.' }, 503); }
    if (!origin || origin !== allowedOrigin || request.headers.get('sec-fetch-site') === 'cross-site') return json({ error: 'This request could not be authorized. Please use the contact form on the website.' }, 403);
    if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ error: 'Please submit the inquiry as JSON.' }, 415);
    let raw: unknown; try { raw = JSON.parse(await readBody(request)); } catch (e) { return json({ error: e instanceof RangeError ? 'This inquiry is too large. Please shorten it.' : 'The inquiry could not be read.' }, e instanceof RangeError ? 413 : 400); }
    const parsed = contactSchema.safeParse(raw); if (!parsed.success) return json({ error: 'Please check the required fields and try again.', fields: parsed.error.issues.map(i => ({ field: i.path[0], message: i.message })) }, 400);
    const data = parsed.data;
    if (data.honey) return json({ error: 'This inquiry could not be accepted. Please try again.' }, 400);
    if (!isConfigured(env)) return json({ error: 'Inquiry delivery is temporarily unavailable. Please email either business contact or save a copy of your brief.' }, 503);
    if (dependencies.limit) { try { const limited = await dependencies.limit(request); if (limited) return limited; } catch { return json({ error: 'Inquiry delivery is temporarily unavailable. Please email either business contact.' }, 503); } }
    // Notification is the acceptance boundary. Never claim success before it is accepted.
    try { await send({ template: env.EMAILJS_NOTIFICATION_TEMPLATE_ID!, params: notificationParams(data, env) }); }
    catch (e) {
      if (e instanceof EmailDeliveryError && e.status === 429) return json({ error: 'Please wait a few minutes before trying again.' }, 429);
      console.error('Contact notification failed. No inquiry data or provider response logged.');
      return json({ error: 'We could not confirm delivery. Please email either business contact or save a copy of your brief. If you already received an acknowledgement, do not submit again.' }, 502);
    }
    let acknowledgementSent = false;
    try {
      await delay(1100); // EmailJS permits one API request per second.
      await send({ template: env.EMAILJS_ACK_TEMPLATE_ID!, params: acknowledgementParams(data, env) });
      acknowledgementSent = true;
    } catch { console.error('Acknowledgement failed; the team notification was accepted.'); }
    try { await dependencies.append?.(data, env); } catch { console.error('Optional CRM append failed; the team notification was accepted.'); }
    return json({ accepted: true, acknowledgementSent });
  };
}
