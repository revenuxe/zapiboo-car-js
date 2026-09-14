"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, CalendarDays, ArrowRight } from "lucide-react";

export function BookingConfirmation() {
  const id = useSearchParams().get("id");
  const bookingId = id ? `REP-${id.slice(0, 8).toUpperCase()}` : "REP-BOOKING";
  return (
    <main className="mx-auto flex min-h-[65vh] max-w-2xl items-center px-4 py-12 sm:px-6">
      <section className="w-full rounded-3xl border border-border bg-card p-6 text-center shadow-soft sm:p-10">
        <CheckCircle2 aria-hidden="true" className="mx-auto size-12 text-primary" />
        <p className="mt-6 text-sm font-semibold text-primary">Booking request received</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Thank you. We&apos;ll be in touch.
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted-foreground">
          Your repair booking has been saved. Our team will confirm your preferred date, time and
          final service details.
        </p>
        <div className="mx-auto mt-7 max-w-sm rounded-2xl bg-secondary p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Booking ID
          </p>
          <p className="mt-1 font-mono text-lg font-bold tracking-wide">{bookingId}</p>
        </div>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/repair"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-bold text-primary-foreground hover:brightness-110"
          >
            Explore services <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border px-5 text-sm font-bold hover:bg-secondary"
          >
            <CalendarDays aria-hidden="true" className="size-4" />
            Contact Zapiboo
          </Link>
        </div>
      </section>
    </main>
  );
}
