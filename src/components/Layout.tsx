import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { brand, navigation } from '../data/content';
import { Arrow, Button, Eyebrow, Icon } from './UI';

export function BrandMark({ partner, className = '' }: { partner: 'maven' | 'knomo'; className?: string }) {
  return <span className={`brand-mark ${partner}-mark ${className}`} aria-hidden="true"><img src={partner === 'maven' ? '/images/maven-bridge-logo.png' : '/images/knomo-logo.webp'} alt="" width={partner === 'maven' ? 2048 : 520} height={partner === 'maven' ? 2048 : 460} /></span>;
}
export function Logo() {
  return <Link to="/" className="brand" aria-label="Maven Bridge home"><BrandMark partner="maven" /><span>MAVEN BRIDGE<small>STRATEGY MEETS EXECUTION</small></span></Link>;
}
export function PartnerLockup() {
  return <div className="partnership-lockup supplied-lockup"><span className="lockup-business"><BrandMark partner="maven" /><span>MAVEN BRIDGE</span></span><span className="multiply">×</span><span className="lockup-business"><BrandMark partner="knomo" /><span>KNOMO<small>DEVELOPERS</small></span></span></div>;
}
export function BusinessEmails({ labels = false }: { labels?: boolean }) {
  return <>{[brand.email, brand.secondaryEmail].filter((email, i, emails) => email && emails.indexOf(email) === i).map((email, i) => <a key={email} href={`mailto:${email}`} className={labels ? 'business-email' : undefined}>{labels && <Icon name="envelope" />}<span>{labels && <small>{i === 0 ? 'MAVEN BRIDGE' : 'KNOMO DEVELOPERS'}</small>}{email}</span></a>)}</>;
}
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const location = useLocation();
  useEffect(() => { const onScroll = () => setScrolled(window.scrollY > 30); onScroll(); window.addEventListener('scroll', onScroll, { passive: true }); return () => window.removeEventListener('scroll', onScroll); }, []);
  useEffect(() => { if (!open) return; const previous = document.body.style.overflow; document.body.style.overflow = 'hidden'; return () => { document.body.style.overflow = previous; }; }, [open]);
  function close() { dialog.current?.close(); setOpen(false); }
  const active = (href: string) => href.includes('#') ? location.hash === href.slice(1) : location.pathname === href && !location.hash;
  return <>
    <a href="#main" className="skip-link">Skip to content</a>
    <header className={`site-header ${scrolled ? 'scrolled' : ''} ${location.pathname !== '/' ? 'inner-header' : ''}`}>
      <div className="container header-inner"><Logo /><nav className="desktop-nav" aria-label="Main navigation">{navigation.map(n => <Link key={n.href} to={n.href} className={active(n.href) ? 'active' : ''} aria-current={active(n.href) ? 'page' : undefined}>{n.label}</Link>)}</nav><Link to="/contact" className="nav-cta">Let’s talk <Arrow /></Link><button className="menu-button" aria-label="Open navigation" aria-expanded={open} aria-controls="mobile-menu" onClick={() => { dialog.current?.showModal(); setOpen(true); }}><Icon name="menu" /></button></div>
    </header>
    <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-label="Main navigation" onClose={() => setOpen(false)} onClick={e => { if (e.target === e.currentTarget) close(); }}>
      <div className="mobile-menu-content"><div className="mobile-top"><Logo /><button className="icon-button" onClick={close} aria-label="Close navigation"><Icon name="x" /></button></div><p className="eyebrow">A CLEARER WAY FORWARD</p><nav aria-label="Mobile navigation">{navigation.map((n, i) => <Link key={n.href} to={n.href} onClick={close}><small>0{i + 1}</small>{n.label}<Arrow /></Link>)}</nav><p>Business clarity. Thoughtful engineering.<br />One connected partnership.</p></div>
    </dialog>
  </>;
}
export function FinalCTA() {
  return <section className="final-cta"><div className="container cta-content"><div><Eyebrow light>YOUR NEXT CHAPTER STARTS HERE</Eyebrow><h2>Something on your mind?<br /><em>Let’s make it happen.</em></h2></div><Button to="/contact" variant="coral">Tell us what you’re building</Button></div><img src="/decor/shoreline-waves.svg" alt="" aria-hidden="true" className="footer-waves" width="1440" height="170" /></section>;
}
export function Footer() {
  return <footer className="footer"><div className="container"><div className="footer-top"><div><Logo /><p>Business vision. Engineering craft.<br />A shared commitment to what’s next.</p><span className="partner-wordmark supplied-partner">IN COLLABORATION WITH <BrandMark partner="knomo" /><b>Knomo Developers</b></span></div><div className="footer-links"><div><span>EXPLORE</span><Link to="/#services">Services</Link><Link to="/#solutions">Solutions</Link><Link to="/#products">AI agents</Link></div><div><span>LET’S CONNECT</span><Link to="/about">Our partnership</Link><Link to="/contact">Start a conversation <Arrow /></Link><BusinessEmails />{brand.phone && <a href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`}>{brand.phone}</a>}</div></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Maven Bridge × Knomo Developers</span><span className="footer-legal"><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><span>Inspired by the coast. Focused on your business.</span></span></div></div></footer>;
}
