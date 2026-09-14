"use client";

import { useState, type FormEvent } from "react";
import { businessContact } from "@/lib/seo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";

export function ServiceBookingForm({
  serviceName,
  category,
}: {
  serviceName: string;
  category: string;
}) {
  const [message, setMessage] = useState("");
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const model = String(data.get("model") ?? "").trim();
    const locality = String(data.get("locality") ?? "").trim();
    if (!name || !model || !locality) {
      setMessage("Please enter your name, vehicle model and locality.");
      return;
    }
    const text = `Hi Zapiboo, I would like to request ${serviceName} for my ${category}.\nName: ${name}\nVehicle model: ${model}\nEngine capacity / EV type: ${String(data.get("capacity") ?? "").trim() || "Please help confirm"}\nLocality: ${locality}\nIssue: ${String(data.get("issue") ?? "").trim() || "Service enquiry"}\nPlease confirm availability, scope and final pricing before booking.`;
    window.location.assign(
      `https://wa.me/${businessContact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`,
    );
  }
  return (
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="repair-name">Your name</Label>
        <Input
          id="repair-name"
          name="name"
          autoComplete="name"
          maxLength={80}
          required
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="repair-model">Vehicle make, model & year</Label>
        <Input
          id="repair-model"
          name="model"
          placeholder="e.g. Honda Activa, 2022"
          maxLength={120}
          required
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="repair-capacity">Engine capacity / EV type (optional)</Label>
        <Input
          id="repair-capacity"
          name="capacity"
          placeholder="e.g. 125cc or electric scooter"
          maxLength={80}
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="repair-locality">Bangalore locality</Label>
        <Input
          id="repair-locality"
          name="locality"
          autoComplete="address-level3"
          maxLength={120}
          required
          className="mt-2"
        />
      </div>
      <div>
        <Label htmlFor="repair-issue">What needs attention? (optional)</Label>
        <Textarea id="repair-issue" name="issue" maxLength={1000} rows={3} className="mt-2" />
      </div>
      {message && (
        <p role="alert" className="text-sm text-destructive">
          {message}
        </p>
      )}
      <button
        type="submit"
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-bold text-primary-foreground hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      >
        <WhatsAppIcon className="size-5" />
        Continue on WhatsApp
      </button>
      <p className="text-xs leading-5 text-muted-foreground">
        Your details open in a WhatsApp message for you to review and send. This is a booking
        request; the team will confirm availability and pricing.
      </p>
    </form>
  );
}
