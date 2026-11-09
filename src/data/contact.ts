import { services } from './services';
import { products } from './products';
export const interestOptions = [...services.map(s => ({ value: s.id, label: s.title })), ...products.map(p => ({ value: p.id, label: p.name })), { value: 'industry-solution', label: 'An industry-specific solution' }, { value: 'not-sure', label: 'I’m not sure yet — let’s explore' }];
export const budgets = ['Not sure', 'Under $2,500', '$2,500–$5,000', '$5,000–$15,000', '$15,000+'];
export const timezones = ['America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'Europe/London', 'Asia/Kolkata', 'Other — please mention in your message'];
