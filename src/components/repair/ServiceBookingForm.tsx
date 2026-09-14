"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  CarFront,
  CheckCircle2,
  ChevronDown,
  CloudSun,
  Loader2,
  MapPin,
  Moon,
  Phone,
  Sun,
  UserRound,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { isSpamLead } from "@/lib/spam-filter";

const timeSlots = ["Morning", "Afternoon", "Evening"] as const;
const today = new Date();
today.setHours(0, 0, 0, 0);
const formatBookingDate = (date: Date) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
const database = supabase as unknown as { from: (table: string) => any };
const slotDetails = {
  Morning: { icon: Sun, note: "9 AM – 12 PM" },
  Afternoon: { icon: CloudSun, note: "12 PM – 4 PM" },
  Evening: { icon: Moon, note: "4 PM – 7 PM" },
};

export function ServiceBookingForm({
  serviceName,
  category,
  startingPrice,
  priceDisclaimer,
}: {
  serviceName: string;
  category: string;
  startingPrice: string;
  priceDisclaimer: string;
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [date, setDate] = useState<Date>();
  const [slot, setSlot] = useState<(typeof timeSlots)[number]>();
  const [saving, setSaving] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const model = String(data.get("model") ?? "").trim();
    const locality = String(data.get("locality") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (!name || !model || !locality || phone.length < 10) {
      setMessage("Enter your name, phone number, vehicle model and locality.");
      return;
    }
    if (!date || !slot) {
      setMessage("Choose a preferred date and time slot.");
      return;
    }
    if (isSpamLead({ name, subject: serviceName, notes: model })) {
      setMessage("Please check the details and try again.");
      return;
    }

    setSaving(true);
    setMessage("");
    const id = crypto.randomUUID();
    const { error } = await database.from("leads").insert({
      id,
      lead_type: "repair_booking",
      vehicle_type: category,
      items: [serviceName],
      model_name: model,
      vehicle_model_name: model,
      locality,
      name,
      phone,
      subject: `Repair booking · ${serviceName}`,
      preferred_date: date.toISOString().slice(0, 10),
      slot,
      has_photo: false,
      status: "new",
    });
    setSaving(false);
    if (error) {
      setMessage("We couldn't save your booking. Please try again.");
      return;
    }
    router.push(`/repair/booking-confirmed?id=${encodeURIComponent(id)}`);
  }
  return (
    <form onSubmit={submit} className="mt-6 space-y-5">
      <div className="flex items-center justify-between rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-3">
        <div>
          <p className="text-sm font-bold">Reserve your preferred slot</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Takes about two minutes</p>
        </div>
        <span className="grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle2 aria-hidden="true" className="size-5" />
        </span>
      </div>

      <fieldset className="rounded-2xl border border-border bg-background p-4 sm:p-5">
        <legend className="px-1 text-sm font-bold">Your vehicle & contact</legend>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="repair-model">Vehicle model</Label>
            <div className="relative mt-2">
              <CarFront
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary"
              />
              <Input
                id="repair-model"
                name="model"
                placeholder="e.g. Honda Activa, 2022"
                maxLength={120}
                required
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="repair-name">Your name</Label>
            <div className="relative mt-2">
              <UserRound
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary"
              />
              <Input
                id="repair-name"
                name="name"
                autoComplete="name"
                maxLength={80}
                required
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="repair-phone">Phone number</Label>
            <div className="relative mt-2">
              <Phone
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary"
              />
              <Input
                id="repair-phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                maxLength={40}
                required
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="repair-locality">Bangalore locality</Label>
            <div className="relative mt-2">
              <MapPin
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-primary"
              />
              <Input
                id="repair-locality"
                name="locality"
                autoComplete="address-level3"
                placeholder="e.g. Indiranagar"
                maxLength={120}
                required
                className="h-11 rounded-xl pl-10"
              />
            </div>
          </div>
        </div>
      </fieldset>

      <fieldset className="rounded-2xl border border-border bg-background p-4 sm:p-5">
        <legend className="px-1 text-sm font-bold">Choose a preferred visit</legend>
        <div className="mt-3">
          <Label>Preferred date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="Choose preferred date"
                className={cn(
                  "mt-2 flex h-12 w-full items-center justify-between rounded-xl border border-input bg-card px-3 text-left text-sm shadow-sm transition-colors hover:border-primary/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  !date && "text-muted-foreground",
                )}
              >
                <span className="flex items-center gap-2">
                  <CalendarDays aria-hidden="true" className="size-4 text-primary" />
                  {date ? formatBookingDate(date) : "Choose a date"}
                </span>
                <ChevronDown aria-hidden="true" className="size-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={{ before: today }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="mt-5">
          <p className="text-sm font-medium leading-none">Preferred time</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {timeSlots.map((option) =>
              (() => {
                const details = slotDetails[option];
                const Icon = details.icon;
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSlot(option)}
                    aria-pressed={slot === option}
                    className={cn(
                      "flex min-h-19 flex-col items-center justify-center rounded-xl border px-1 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      slot === option
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <Icon aria-hidden="true" className="mb-1 size-4" />
                    <span>{option}</span>
                    <span
                      className={cn(
                        "mt-0.5 text-[9px] font-medium",
                        slot === option ? "text-primary-foreground/75" : "text-muted-foreground",
                      )}
                    >
                      {details.note}
                    </span>
                  </button>
                );
              })(),
            )}
          </div>
        </div>
      </fieldset>
      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
      <button
        type="submit"
        disabled={saving}
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground shadow-[0_12px_24px_-14px_color-mix(in_srgb,var(--primary)_80%,transparent)] transition hover:-translate-y-0.5 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary disabled:translate-y-0 disabled:opacity-70"
      >
        {saving ? (
          <Loader2 className="size-5 animate-spin" />
        ) : (
          <>
            <CalendarDays aria-hidden="true" className="size-5" />
            Book now
          </>
        )}
      </button>
      <div className="rounded-xl border border-border bg-secondary/35 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Starting at
        </p>
        <p className="mt-1 text-3xl font-extrabold tracking-tight">{startingPrice}</p>
        <p className="mt-3 text-xs leading-6 text-muted-foreground">{priceDisclaimer}</p>
      </div>
      <p className="flex items-start justify-center gap-2 px-2 text-center text-xs leading-5 text-muted-foreground">
        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-3.5 shrink-0 text-primary" />
        No payment today. We&apos;ll confirm availability, scope and final pricing first.
      </p>
    </form>
  );
}
