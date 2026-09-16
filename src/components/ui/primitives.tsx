import Link from "next/link";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

export function Container({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`container ${className}`} {...props} />;
}
export function Section({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={`section ${className}`} {...props} />;
}
export function SectionHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="section-header"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h2>{title}</h2>{description && <p className="section-description">{description}</p>}</div>{action}</div>;
}
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" };
export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  return <button className={`button button--${variant} ${className}`} {...props} />;
}
export function ButtonLink({ href, children, variant = "primary", className = "" }: { href: string; children: ReactNode; variant?: "primary" | "secondary" | "light"; className?: string }) {
  return <Link href={href} className={`button button--${variant} ${className}`}>{children}</Link>;
}
export function IconButton({ label, className = "", ...props }: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label"> & { label: string }) {
  return <button aria-label={label} className={`icon-button ${className}`} {...props} />;
}
export function Card({ className = "", ...props }: HTMLAttributes<HTMLElement>) {
  return <article className={`card ${className}`} {...props} />;
}
export function Badge({ children }: { children: ReactNode }) { return <span className="badge">{children}</span>; }
export function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true" className="arrow">{diagonal ? "↗" : "→"}</span>;
}
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><span aria-hidden="true" className="empty-mark">· · ·</span><h2>{title}</h2><p>{description}</p>{action}</div>;
}
export function LoadingState({ label }: { label: string }) {
  return <div role="status" className="loading-state"><span className="loading-dot" aria-hidden="true" />{label}</div>;
}

