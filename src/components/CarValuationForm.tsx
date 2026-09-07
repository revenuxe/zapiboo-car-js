"use client";

import { useId, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const carRegistrationKey = "zapiboo-car-registration";

export function CarValuationForm() {
  const id = useId();
  const router = useRouter();
  const [registration, setRegistration] = useState("");
  const [error, setError] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = registration.toUpperCase().replace(/[\s-]/g, "");
    if (!/^(?:[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{1,4}|[0-9]{2}BH[0-9]{4}[A-Z]{1,2})$/.test(value)) {
      setError("Enter a registration such as KA 01 AB 1234, or continue manually below.");
      return;
    }
    try {
      window.sessionStorage.setItem(carRegistrationKey, value);
      router.push("/pickup?vehicle=car");
    } catch {
      setError("Your browser could not save these details. Please continue manually below.");
    }
  }
  return (
    <form onSubmit={submit} className="text-foreground">
      <label htmlFor={id} className="block text-base font-bold sm:text-lg">
        Enter Your Car Registration Number
      </label>
      <p id={`${id}-hint`} className="mt-2 text-sm text-muted-foreground">
        Start your free inspection request. Your offer follows a vehicle inspection.
      </p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <input
          id={id}
          value={registration}
          onChange={(event) => {
            setRegistration(event.target.value);
            try {
              sessionStorage.setItem(carRegistrationKey, event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""));
            } catch { /* Typing remains available when browser storage is disabled. */ }
            setError("");
          }}
          aria-describedby={`${id}-hint${error ? ` ${id}-error` : ""}`}
          aria-invalid={!!error}
          maxLength={18}
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          placeholder="KA 01 AB 1234"
          className="min-h-14 min-w-0 flex-1 rounded-xl border border-border bg-background px-4 text-base font-semibold uppercase tracking-widest outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button
          type="submit"
          className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
        >
          Request My Car Inspection <ArrowRight className="size-4" />
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-col justify-between gap-3 text-xs sm:flex-row sm:items-center">
        <span className="text-muted-foreground">
          Free inspection · You decide whether to accept
        </span>
        <Link
          href="/pickup?vehicle=car"
          className="font-semibold text-primary underline underline-offset-4"
        >
          Enter Car Details Manually
        </Link>
      </div>
    </form>
  );
}
