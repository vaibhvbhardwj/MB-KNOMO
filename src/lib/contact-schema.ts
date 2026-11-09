import { z } from 'zod';
const text = (max: number) => z.string().trim().max(max).transform(s => s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, ''));
const optional = (max: number) => text(max).optional().default('');
export const interestIds = ['digital-products', 'ai-automation', 'branding-growth', 'business-strategy', 'cloud-integrations', 'agency-partnerships', 'ai-call-picker', 'virtual-ai-hr', 'industry-solution', 'not-sure'] as const;
export const contactSchema = z.object({
  name: text(100).pipe(z.string().min(2, 'Please enter your full name.')),
  email: text(254).pipe(z.email('Please enter a valid business email.')).refine(s => !/[\r\n]/.test(s), 'Please enter a valid email.'),
  company: text(160).pipe(z.string().min(2, 'Please enter your company or organization.')),
  interest: z.enum(interestIds, { error: 'Choose a service or product interest.' }),
  message: text(4000).pipe(z.string().min(20, 'Tell us a little more — at least 20 characters.')),
  consent: z.literal(true, { error: 'Please agree to the privacy notice before sending.' }),
  phone: optional(40).refine(v => !v || /^[+\d\s().-]{5,40}$/.test(v), 'Use a phone number with country code.'),
  website: optional(300).refine(v => !v || /^https?:\/\/[^\s]+$/i.test(v), 'Use a complete URL beginning with https://.'),
  budget: z.enum(['Not sure', 'Under $2,500', '$2,500–$5,000', '$5,000–$15,000', '$15,000+']).default('Not sure'),
  preferredDay: optional(10).refine(v => !v || /^\d{4}-\d{2}-\d{2}$/.test(v), 'Choose a valid date.'),
  preferredTime: optional(5).refine(v => !v || /^([01]\d|2[0-3]):[0-5]\d$/.test(v), 'Choose a valid time.'),
  timezone: optional(80), referral: optional(120), industry: optional(80),
  attributionConsent: z.boolean().default(false),
  attribution: z.object({ utm_source: optional(120), utm_medium: optional(120), utm_campaign: optional(120), ref: optional(120) }).optional(),
  honey: z.string().max(200).optional().default(''),
}).strict().transform(data => ({ ...data, attribution: data.attributionConsent ? data.attribution : undefined }));
export type ContactData = z.output<typeof contactSchema>;
