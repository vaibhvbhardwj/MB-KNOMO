import type { Config } from '@netlify/functions';
import { createContactHandler } from './lib/contact-handler';
import { appendLead } from './lib/sheets';
export default async function handler(request: Request) { return createContactHandler(process.env, { append: appendLead })(request); }
export const config: Config = { path: '/api/contact', rateLimit: { windowSize: 180, windowLimit: 5, aggregateBy: ['ip', 'domain'] } };
