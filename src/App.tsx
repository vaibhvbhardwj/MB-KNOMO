import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { Header, Footer } from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import { Legal, NotFound } from './pages/Legal';
import { brand } from './data/content';
export const metadata: Record<string, { title: string; description: string }> = {
  '/': { title: 'Maven Bridge × Knomo Developers — Business ideas, beautifully executed', description: 'Connect business strategy with thoughtful engineering. Explore websites, AI workflows, custom software and agency delivery partnerships.' },
  '/about': { title: 'Our partnership — Maven Bridge × Knomo Developers', description: 'Business clarity meets engineering execution. Discover the Maven Bridge and Knomo Developers partnership and how we work together.' },
  '/contact': { title: 'Start a conversation — Maven Bridge × Knomo Developers', description: 'Tell us about your business challenge, explore a practical next step and request a discovery conversation.' },
  '/privacy': { title: 'Privacy notice — Maven Bridge', description: 'How project inquiries and optional referral details are handled.' },
  '/terms': { title: 'Terms of use — Maven Bridge', description: 'Website terms, concept demo disclosures and project inquiry information.' },
};
function RouteEffects() { const location = useLocation(); const navigate = useNavigate();
  useEffect(() => { const m = metadata[location.pathname]; document.title = m?.title || 'Page not found — Maven Bridge'; document.querySelector('meta[name="description"]')?.setAttribute('content', m?.description || 'Find your way back to Maven Bridge.'); if (brand.url) { let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]'); if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.append(canonical); } canonical.href = new URL(location.pathname, brand.url).href; }
    const timer = window.setTimeout(() => { if (location.hash) document.getElementById(location.hash.slice(1))?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); else window.scrollTo({ top: 0, behavior: 'instant' }); }, 60); return () => clearTimeout(timer);
  }, [location.pathname, location.hash, location.key]);
  useEffect(() => { const listener = (event: MouseEvent) => { if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return; const a = (event.target as Element).closest('a'); if (!a || a.target || a.hasAttribute('download')) return; const url = new URL(a.href, window.location.origin); if (url.origin !== window.location.origin) return; const current = new URLSearchParams(window.location.search); const campaignKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'ref']; let added = false; campaignKeys.forEach(k => { if (current.has(k) && !url.searchParams.has(k)) { url.searchParams.set(k, current.get(k)!.slice(0, 120)); added = true; } }); if (added) { event.preventDefault(); navigate(url.pathname + url.search + url.hash); } }; document.addEventListener('click', listener, true); return () => document.removeEventListener('click', listener, true); }, [navigate]);
  return null;
}
export default function App() { return <MotionConfig reducedMotion="user"><RouteEffects /><Header /><main id="main" tabIndex={-1}><Routes><Route path="/" element={<Home />} /><Route path="/about" element={<About />} /><Route path="/contact" element={<Contact />} /><Route path="/privacy" element={<Legal type="privacy" />} /><Route path="/terms" element={<Legal type="terms" />} /><Route path="*" element={<NotFound />} /></Routes></main><Footer /></MotionConfig>; }
