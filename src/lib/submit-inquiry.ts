import type { ContactData } from './contact-schema';

export class InquirySubmissionError extends Error {
  constructor(message: string, public readonly fields: Record<string, string> = {}) { super(message); }
}
export async function submitInquiry(data: ContactData, requestFetch: typeof fetch = fetch): Promise<{ acknowledgementSent: boolean }> {
  const response = await requestFetch('/api/contact', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data), signal: AbortSignal.timeout(30000),
  });
  if (!response.headers.get('content-type')?.includes('application/json')) {
    throw new InquirySubmissionError('Your message could not be sent. Please try again shortly or email either business contact directly.');
  }
  let body: { accepted?: boolean; acknowledgementSent?: boolean; error?: string; fields?: { field: string; message: string }[] };
  try { body = await response.json(); }
  catch { throw new InquirySubmissionError('We could not confirm that your message was sent. Please save a copy and try again later.'); }
  if (!body || typeof body !== 'object') throw new InquirySubmissionError('We could not confirm that your message was sent. Please save a copy and try again later.');
  if (!response.ok || body.accepted !== true) {
    const fields: Record<string, string> = {};
    if (Array.isArray(body.fields)) for (const issue of body.fields) if (typeof issue.field === 'string' && typeof issue.message === 'string') fields[issue.field] = issue.message;
    throw new InquirySubmissionError(response.status === 429 ? 'Please wait a few minutes before trying again.' : body.error || 'Your message could not be sent. Please try again or email the team directly.', fields);
  }
  return { acknowledgementSent: body.acknowledgementSent === true };
}
