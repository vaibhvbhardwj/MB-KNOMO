import type { Config } from '@netlify/functions';
import { createContactHandler } from './lib/contact-handler';
export default async function handler(request: Request) { return createContactHandler(process.env)(request); }
export const config: Config = { path: '/api/contact', rateLimit: { windowSize: 180, windowLimit: 5, aggregateBy: ['ip', 'domain'] } };
