"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation, route } from "@/config/routes";
import type { NavigationItem } from "@/types/content";
import { IconButton } from "@/components/ui/primitives";

function NavigationLinks({ items, close }: { items: readonly NavigationItem[]; close: () => void }) {
  const pathname = usePathname();
  return <ul>{items.map((item) => {
    const target = route(item.routeId);
    return <li key={target.id}>
      <Link href={target.path} onClick={close} aria-current={pathname === target.path ? "page" : undefined}>{target.title}</Link>
      {item.children && <NavigationLinks items={item.children} close={close} />}
    </li>;
  })}</ul>;
}
export function DesktopNavigation() {
  const [open, setOpen] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const handleClick = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setOpen(null);
    };
    document.addEventListener("pointerdown", handleClick);
    return () => document.removeEventListener("pointerdown", handleClick);
  }, []);
  return <nav className="desktop-nav" aria-label="Navigasi utama" ref={navRef} onBlur={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setOpen(null);
  }} onKeyDown={(event) => {
    if (event.key === "Escape" && open) {
      navRef.current?.querySelector<HTMLButtonElement>(`[aria-controls="desktop-${open}"]`)?.focus();
      setOpen(null);
    }
  }}>
    <ul className="nav-list">{navigation.map((item) => {
      const target = route(item.routeId);
      return <li className="nav-item" key={target.id}>{item.children ? <>
        <button type="button" aria-expanded={open === target.id} aria-controls={`desktop-${target.id}`}
          className={pathname.startsWith(target.path) ? "nav-trigger is-active" : "nav-trigger"}
          onClick={() => setOpen(open === target.id ? null : target.id)}>{target.title}<span aria-hidden="true" className="chevron">⌄</span></button>
        <div id={`desktop-${target.id}`} className={`dropdown ${target.id === "program" ? "dropdown--wide" : ""}`} hidden={open !== target.id}>
          <Link className="dropdown-overview" href={target.path} onClick={() => setOpen(null)}>Semua {target.title}<span aria-hidden="true">→</span></Link>
          <NavigationLinks items={item.children} close={() => setOpen(null)} />
        </div>
      </> : <Link className="nav-trigger" href={target.path} aria-current={pathname === target.path ? "page" : undefined}>{target.title}</Link>}</li>;
    })}</ul>
  </nav>;
}
export function MobileNavigation() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const close = () => { dialogRef.current?.close(); setOpen(false); triggerRef.current?.focus(); };
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const breakpoint = window.matchMedia("(min-width: 1280px)");
    const onChange = () => { if (breakpoint.matches) { dialogRef.current?.close(); setOpen(false); } };
    breakpoint.addEventListener("change", onChange);
    return () => { document.body.style.overflow = previous; breakpoint.removeEventListener("change", onChange); };
  }, [open]);
  return <div className="mobile-navigation">
    <button ref={triggerRef} className="icon-button menu-trigger" aria-label="Buka menu" aria-expanded={open} aria-controls="mobile-menu" onClick={() => { dialogRef.current?.showModal(); setOpen(true); }}><span aria-hidden="true">☰</span></button>
    <dialog ref={dialogRef} id="mobile-menu" className="mobile-dialog" aria-labelledby="mobile-menu-title"
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const focusable = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), summary, [tabindex="0"]'))
          .filter((element) => element.getClientRects().length > 0);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }}
      onCancel={() => setOpen(false)} onClose={() => setOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="mobile-dialog-content">
        <div className="mobile-menu-header"><h2 id="mobile-menu-title">Jelajahi Perwanida</h2><IconButton label="Tutup menu" onClick={close}>×</IconButton></div>
        <nav aria-label="Navigasi mobile"><ul>{navigation.map((item) => {
          const target = route(item.routeId);
          return <li key={target.id}>{item.children ? <details><summary>{target.title}</summary><Link className="mobile-overview" href={target.path} onClick={close}>Semua {target.title}</Link><NavigationLinks items={item.children} close={close} /></details>
            : <Link href={target.path} onClick={close}>{target.title}</Link>}</li>;
        })}</ul><Link className="button button--primary mobile-spmb" href={route("spmb").path} onClick={close}>Informasi SPMB <span aria-hidden="true">↗</span></Link></nav>
      </div>
    </dialog>
  </div>;
}
