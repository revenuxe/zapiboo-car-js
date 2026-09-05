import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { isSpamLead } from "@/lib/spam-filter";

export function HeroLeadForm() {
  const busy = useRef(false);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const brand = String(data.get("brand") ?? "").trim();
    const vehicleType = String(data.get("vehicleType") ?? "");
    if (!name || !brand || !/^[6-9]\d{9}$/.test(phone) || !vehicleType) {
      setError("Enter your name, a valid 10-digit mobile number, vehicle type and brand.");
      return;
    }
    setError("");
    if (data.get("website") || isSpamLead({ name, subject: brand })) {
      setSuccess(true);
      return;
    }
    busy.current = true;
    setSending(true);
    try {
      const { error: saveError } = await supabase.from("leads").insert({
        lead_type: "query",
        vehicle_type: vehicleType,
        brand_name: brand,
        items: [brand, vehicleType],
        name,
        phone,
        subject: "Homepage valuation request",
        notes: "Quick valuation enquiry from the homepage. Contact seller to arrange inspection.",
        has_photo: false,
        status: "new",
      });
      if (saveError) throw saveError;
      setSuccess(true);
    } catch {
      setError(
        "We couldn't save your request. Please try again or use the WhatsApp link beside this form.",
      );
    } finally {
      busy.current = false;
      setSending(false);
    }
  }

  return (
    <aside
      className="hidden rounded-3xl border border-border bg-card p-8 text-card-foreground shadow-elevated lg:block"
      aria-labelledby="hero-form-title"
    >
      <h2 id="hero-form-title" className="text-2xl font-bold">
        Get your free vehicle valuation
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Share a few details. Our team will call to discuss your vehicle and arrange an inspection.
      </p>
      {success ? (
        <p role="status" className="mt-6 rounded-xl bg-accent p-4 text-accent-foreground">
          Thanks! Your request has been received. Our team will contact you about your valuation.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <fieldset disabled={sending} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-name">Your name</Label>
              <Input
                id="hero-name"
                name="name"
                autoComplete="name"
                placeholder="Full name"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-phone">Phone number</Label>
              <Input
                id="hero-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                placeholder="10-digit mobile number"
                pattern="[6-9][0-9]{9}"
                maxLength={10}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-type">Vehicle type</Label>
              <select
                id="hero-type"
                name="vehicleType"
                defaultValue=""
                required
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="" disabled>
                  Select vehicle type
                </option>
                <option value="car">Car / SUV</option>
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
                <option value="electric">Electric vehicle</option>
                <option value="commercial">Commercial vehicle</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-brand">Brand</Label>
              <Input
                id="hero-brand"
                name="brand"
                placeholder="e.g. Maruti Suzuki, Honda, Tata"
                maxLength={80}
                required
              />
            </div>
            <div hidden aria-hidden="true">
              <label htmlFor="hero-website">Website</label>
              <input id="hero-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={sending}>
              {sending ? "Sending request…" : "Request free valuation"}
              <ArrowRight />
            </Button>
          </fieldset>
          {error && (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <p className="text-xs text-muted-foreground">
            By submitting, you agree to be contacted about your vehicle.{" "}
            <Link to="/privacy" className="underline">
              Privacy policy
            </Link>
          </p>
        </form>
      )}
    </aside>
  );
}
