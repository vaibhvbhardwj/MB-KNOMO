import { JWT } from 'google-auth-library';
import type { ContactData } from '../../../src/lib/contact-schema';
import { sheetSafe, type ContactEnv } from './contact-handler';
export async function appendLead(data: ContactData, env: ContactEnv) {
  if (!env.GOOGLE_SHEET_ID || !env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !env.GOOGLE_PRIVATE_KEY) return;
  const client = new JWT({ email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL, key: env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'), scopes: ['https://www.googleapis.com/auth/spreadsheets'] });
  const a = data.attribution;
  const row = [new Date().toISOString(), data.name, data.email, data.company, data.phone, data.interest, data.budget, data.message, `${data.preferredDay} ${data.preferredTime}`.trim(), data.timezone, a?.utm_source || '', a?.utm_medium || '', a?.utm_campaign || '', a?.ref || '', data.referral, data.industry, 'New'].map(sheetSafe);
  await client.request({ url: `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(env.GOOGLE_SHEET_ID)}/values/${encodeURIComponent('Leads!A:Q')}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, method: 'POST', data: { values: [row] }, timeout: 8000 });
}
