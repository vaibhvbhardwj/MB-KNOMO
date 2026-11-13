import { motion, useReducedMotion } from 'motion/react';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, type PropsWithChildren } from 'react';
export function Icon({ name, className = '' }: { name: string; className?: string }) { return <i className={`bx bx-${name} ${className}`} aria-hidden="true" />; }
export function Arrow({ diagonal = false }: { diagonal?: boolean }) { return <Icon name={diagonal ? 'right-top-arrow-circle' : 'right-arrow-alt'} />; }
export function Button({ to, children, variant = '', className = '' }: PropsWithChildren<{ to: string; variant?: string; className?: string }>) { return <Link className={`button ${variant} ${className}`} to={to}>{children}<Arrow /></Link>; }
export function Eyebrow({ children, light = false }: PropsWithChildren<{ light?: boolean }>) { return <p className={`eyebrow ${light ? 'light' : ''}`}><span />{children}</p>; }
export function SectionHeading({ eyebrow, title, children }: PropsWithChildren<{ eyebrow: string; title: string }>) { return <Reveal className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>{children && <p>{children}</p>}</Reveal>; }
export function Reveal({ children, className = '', delay = 0 }: PropsWithChildren<{ className?: string; delay?: number }>) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [waiting, setWaiting] = useState(false);
  useEffect(() => {
    const element = ref.current;
    if (reduced || !element || typeof IntersectionObserver === 'undefined') { setWaiting(false); return; }
    // Server HTML and anything already visible remain readable without an entrance delay.
    if (element.getBoundingClientRect().top < window.innerHeight * .95) return;
    setWaiting(true);
    const observer = new IntersectionObserver(entries => { if (entries.some(entry => entry.isIntersecting)) { setWaiting(false); observer.disconnect(); } }, { threshold: .08, rootMargin: '0px 0px -4% 0px' });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reduced]);
  return <motion.div ref={ref} className={className} initial={false} animate={{ opacity: waiting ? 0 : 1, y: waiting ? 25 : 0 }} transition={{ duration: reduced ? 0 : .65, delay: waiting || reduced ? 0 : delay, ease: [.22, 1, .36, 1] }}>{children}</motion.div>;
}
export function Heron() { return <img className="heron-art" src="/decor/heron-lineart.svg" alt="" aria-hidden="true" width="180" height="230" loading="lazy" />; }
