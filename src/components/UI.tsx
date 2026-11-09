import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import type { PropsWithChildren } from 'react';
export function Icon({ name, className = '' }: { name: string; className?: string }) { return <i className={`bx bx-${name} ${className}`} aria-hidden="true" />; }
export function Arrow({ diagonal = false }: { diagonal?: boolean }) { return <Icon name={diagonal ? 'right-top-arrow-circle' : 'right-arrow-alt'} />; }
export function Button({ to, children, variant = '', className = '' }: PropsWithChildren<{ to: string; variant?: string; className?: string }>) { return <Link className={`button ${variant} ${className}`} to={to}>{children}<Arrow /></Link>; }
export function Eyebrow({ children, light = false }: PropsWithChildren<{ light?: boolean }>) { return <p className={`eyebrow ${light ? 'light' : ''}`}><span />{children}</p>; }
export function SectionHeading({ eyebrow, title, children }: PropsWithChildren<{ eyebrow: string; title: string }>) { return <div className="section-heading"><div><Eyebrow>{eyebrow}</Eyebrow><h2>{title}</h2></div>{children && <p>{children}</p>}</div>; }
export function Reveal({ children, className = '' }: PropsWithChildren<{ className?: string }>) { return <motion.div className={className} initial={false} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .5 }}>{children}</motion.div>; }
export function Heron() { return <img className="heron-art" src="/decor/heron-lineart.svg" alt="" aria-hidden="true" width="180" height="230" loading="lazy" />; }
