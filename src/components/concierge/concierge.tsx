"use client";

import { useEffect, useRef, useState } from "react";
import type { ConciergeAction, ConciergeResponse, ConciergeSource } from "@/lib/ai/types";
import "./concierge.css";

type Message = { id: string; role: "user" | "assistant"; content: string; sources?: readonly ConciergeSource[]; actions?: readonly ConciergeAction[]; fallback?: boolean };
const greeting = "Halo, saya Sahabat Perwanida. Ada yang bisa saya bantu tentang KB-RA Perwanida Surabaya?";
const sessionKey = "perwanida-concierge-v1";
const quickQuestions = ["Apa program unggulan Perwanida?", "Fasilitas apa saja yang tersedia?", "Siapa saja Guru & Tendik Perwanida?", "Ekstrakurikuler apa saja yang tersedia?", "Bagaimana informasi SPMB?", "Di mana alamat dan kontak sekolah?"];
const firstMessage = (): Message => ({ id: "greeting", role: "assistant", content: greeting });

function validMessages(value: unknown): Message[] | null {
  if (!Array.isArray(value) || value.length > 16) return null;
  const messages = value.filter((item): item is Message => Boolean(item) && typeof item === "object" && (item as Message).role !== undefined && typeof (item as Message).content === "string");
  return messages.length === value.length ? messages : null;
}

export function Concierge({ adminHref }: { adminHref?: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([firstMessage()]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try { const saved = validMessages(JSON.parse(sessionStorage.getItem(sessionKey) ?? "null")); if (saved?.length) setMessages(saved); } catch { /* Ignore corrupted tab-session data. */ }
      hydrated.current = true;
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (!hydrated.current) return;
    sessionStorage.setItem(sessionKey, JSON.stringify(messages));
  }, [messages]);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);
  function close() { setOpen(false); window.setTimeout(() => triggerRef.current?.focus(), 0); }
  async function send(question = input) {
    const message = question.trim();
    if (!message || sending) return;
    const outgoing: Message = { id: crypto.randomUUID(), role: "user", content: message };
    const history = messages.slice(-8).map(({ role, content }) => ({ role, content }));
    setMessages((current) => [...current, outgoing]); setInput(""); setSending(true);
    try {
      const result = await fetch("/api/concierge", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message, history }) });
      if (!result.ok) throw new Error("API request failed");
      const data = await result.json() as ConciergeResponse;
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: data.answer, sources: data.sources, actions: data.suggestedActions, fallback: data.fallback }]);
    } catch {
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: "assistant", content: "Maaf, terjadi kendala saat menghubungi Sahabat Perwanida. Silakan coba lagi atau hubungi admin sekolah.", fallback: true, actions: adminHref ? [{ label: "Hubungi Admin Perwanida", href: adminHref }] : [] }]);
    } finally { setSending(false); }
  }
  return <section className="concierge" aria-label="Asisten AI Perwanida">
    <button ref={triggerRef} className="concierge-trigger" type="button" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
      <span aria-hidden="true">✦</span><span>Butuh bantuan?</span>
    </button>
    <dialog ref={dialogRef} className="concierge-dialog" aria-labelledby="concierge-title" onCancel={(event) => { event.preventDefault(); close(); }} onClose={() => setOpen(false)}>
      <div className="concierge-panel">
        <header className="concierge-header"><div><p>Asisten AI Perwanida</p><h2 id="concierge-title">Sahabat Perwanida</h2></div><button className="concierge-close" type="button" aria-label="Tutup Sahabat Perwanida" onClick={close}>×</button></header>
        <div className="concierge-thread" aria-live="polite">
          {messages.map((item) => <article className={`concierge-message concierge-message--${item.role}`} key={item.id}>
            <p>{item.content}</p>
            {item.sources?.length ? <div className="concierge-sources"><span>Sumber di website</span>{item.sources.map((source) => <a href={source.href} key={source.href}>{source.title}</a>)}</div> : null}
            {item.actions?.map((action) => <a className="concierge-admin" href={action.href} target="_blank" rel="noreferrer" key={action.href}>{action.label}</a>)}
          </article>)}
          {sending ? <p className="concierge-thinking">Sahabat Perwanida sedang menyiapkan jawaban…</p> : null}
        </div>
        <div className="concierge-quick" aria-label="Pertanyaan cepat">{quickQuestions.map((question) => <button type="button" key={question} onClick={() => send(question)} disabled={sending}>{question}</button>)}</div>
        <form className="concierge-composer" onSubmit={(event) => { event.preventDefault(); void send(); }}><label className="sr-only" htmlFor="concierge-input">Tulis pertanyaan Anda</label><input id="concierge-input" maxLength={1200} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Tulis pertanyaan Anda…" disabled={sending} /><button type="submit" disabled={!input.trim() || sending}>Kirim</button></form>
        <p className="concierge-disclosure">Jawaban diambil dari informasi yang tersedia di website Perwanida. Untuk konfirmasi terbaru, hubungi sekolah.</p>
      </div>
    </dialog>
  </section>;
}
