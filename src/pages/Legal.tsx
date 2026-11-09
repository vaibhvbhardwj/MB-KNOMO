import { legal } from '../data/legal';
import { brand } from '../data/content';
import { Button, Eyebrow } from '../components/UI';
export function Legal({ type }: { type: 'privacy' | 'terms' }) { const p = legal[type]; return <section className="legal-page section-pad"><div className="container narrow"><Eyebrow>THE DETAILS MATTER</Eyebrow><h1>{p.title}</h1><p className="legal-draft">{p.intro}</p>{p.sections.map(([title, text]) => <article key={title}><h2>{title}</h2><p>{text}</p></article>)}{brand.email && <p>Contact: <a href={`mailto:${brand.email}`}>{brand.email}</a></p>}<Button to="/contact" variant="outline">Back to the conversation</Button></div></section>; }
export function NotFound() { return <section className="not-found"><Eyebrow>404 · A LITTLE OFF COURSE</Eyebrow><h1>Let’s find a<br /><em>clearer direction.</em></h1><p>That page isn’t here. Your next step still could be.</p><Button to="/">Back to the beginning</Button></section>; }
