"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { servicesPaused } from "@/lib/launch-status";

export function OpeningSoonMessage({ saved = false }: { saved?: boolean }) {
  return <div className="text-center">
    <svg viewBox="0 0 120 100" aria-hidden="true" className="mx-auto mb-5 h-24 w-28 text-primary" fill="none">
      <circle cx="60" cy="50" r="44" fill="currentColor" opacity=".08" />
      <path d="M24 58V34a6 6 0 0 1 6-6h42v38H24v-8Zm48-16h13l13 16v8H72" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="39" cy="68" r="8" fill="var(--background)" stroke="currentColor" strokeWidth="3" />
      <circle cx="84" cy="68" r="8" fill="var(--background)" stroke="currentColor" strokeWidth="3" />
      <path d="M43 41h2m14 0h2M45 54q7-7 14 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="m89 24 3-7m7 14 7-2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
    <p className="mb-2 text-xs font-bold uppercase tracking-[.18em] text-primary">Getting ready for you</p>
    <h2 className="text-2xl font-bold tracking-tight">Sorry, we’re not open just yet</h2>
    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">We’re putting our pickup network and logistics in place so we can serve you well. Pickups, bookings and customer support are temporarily unavailable. We look forward to opening soon.</p>
    {saved && <p className="mt-4 rounded-xl bg-primary/5 p-3 text-sm text-muted-foreground">You’re signed in and your account details are saved. No pickup has been booked. You can return with this account when we open.</p>}
  </div>;
}

export function ServiceAvailability() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!servicesPaused) return;
    const show = () => setOpen(true);
    const intercept = (event: Event) => {
      const target = event.target;
      if (!(target instanceof Element) || target.closest('[role="dialog"]')) return;
      const link = target.closest('a');
      const href = link?.getAttribute('href') ?? '';
      const contact = /^(tel:|mailto:|https?:\/\/(wa\.me|api\.whatsapp\.com|www\.instagram\.com|www\.youtube\.com)\/)/i.test(href) || href === '#service-opening-soon';
      const form = target.closest('form[data-service-form]');
      if (!contact && !form) return;
      event.preventDefault();
      event.stopPropagation();
      if (event.type === 'focusin' && target instanceof HTMLElement) target.blur();
      show();
    };
    window.addEventListener('zapiboo:opening-soon', show);
    const events = ['click', 'pointerdown', 'focusin', 'submit'];
    events.forEach(event => document.addEventListener(event, intercept, true));
    return () => {
      window.removeEventListener('zapiboo:opening-soon', show);
      events.forEach(event => document.removeEventListener(event, intercept, true));
    };
  }, []);
  return <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-3xl p-6 sm:rounded-3xl sm:p-7" onCloseAutoFocus={event => event.preventDefault()}>
      <DialogTitle className="sr-only">Services opening soon</DialogTitle>
      <DialogDescription className="sr-only">We are preparing our pickup network. Services and customer support are temporarily unavailable.</DialogDescription>
      <OpeningSoonMessage />
      <button onClick={() => setOpen(false)} className="mt-2 min-h-11 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Got it, thank you</button>
    </DialogContent>
  </Dialog>;
}
