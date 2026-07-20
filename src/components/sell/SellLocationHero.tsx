import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MapPin, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { businessContact } from "@/lib/seo";
import { isPincodeAvailable, useServiceAvailability } from "@/lib/service-availability";
import { PINCODE_KEY } from "@/routes/sell.$category";

type Props = {
  /** Full H1 without highlight, e.g. "Sell your old laptop in Koramangala" */
  heading: React.ReactNode;
  subtitle: string;
  /** Default pincode to prefill (area pincode). */
  defaultPincode?: string;
  /** WhatsApp prefilled message. */
  whatsappMessage: string;
};

export function SellLocationHero({
  heading,
  subtitle,
  defaultPincode = "",
  whatsappMessage,
}: Props) {
  const navigate = useNavigate();
  const { data: availability } = useServiceAvailability();
  const [pincode, setPincode] = useState(defaultPincode);
  const [checkedPin, setCheckedPin] = useState<string | null>(null);

  const savePincode = (v: string) => {
    if (typeof window !== "undefined") sessionStorage.setItem(PINCODE_KEY, v);
  };

  const checkAvailability = () => {
    if (pincode.length !== 6) return;
    savePincode(pincode);
    setCheckedPin(pincode);
  };

  const goToBrands = () => {
    savePincode(pincode);
    navigate({ to: "/sell/$category", params: { category: "laptops" } });
  };

  const available =
    checkedPin && checkedPin === pincode ? isPincodeAvailable(pincode, availability) : null;

  return (
    <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand-green/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-brand-green/10 blur-3xl"
      />
      <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8">
        <h1 className="text-3xl font-extrabold leading-[1.1] sm:text-4xl md:text-5xl">
          {heading}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-navy-foreground/75">{subtitle}</p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-navy-foreground/10 bg-navy-foreground/5 p-3 text-left backdrop-blur">
          <Label className="px-1 text-xs font-semibold text-navy-foreground/70">
            Your Bangalore pincode
          </Label>
          <div className="mt-1.5 flex gap-2">
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-foreground/50" />
              <Input
                value={pincode}
                onChange={(e) => {
                  setPincode(e.target.value.replace(/\D/g, "").slice(0, 6));
                  setCheckedPin(null);
                }}
                inputMode="numeric"
                placeholder="e.g. 560001"
                className="h-12 border-navy-foreground/15 bg-navy-foreground/10 pl-9 text-navy-foreground placeholder:text-navy-foreground/40"
              />
            </div>
            {available === null ? (
              <Button
                variant="hero"
                size="lg"
                disabled={pincode.length !== 6}
                onClick={checkAvailability}
              >
                Check <ArrowRight className="size-4" />
              </Button>
            ) : (
              <Button variant="hero" size="lg" onClick={goToBrands}>
                {available ? "Get quote" : "Book pickup"} <ArrowRight className="size-4" />
              </Button>
            )}
          </div>

          {available === true && (
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-brand-green/15 px-3 py-2 text-xs font-medium text-brand-green">
              <CheckCircle2 className="size-4 shrink-0" />
              Great news - we offer free pickup at {pincode}.
            </div>
          )}
          {available === false && (
            <div className="mt-2 flex items-center gap-2 rounded-xl bg-navy-foreground/10 px-3 py-2 text-xs font-medium text-navy-foreground/80">
              <XCircle className="size-4 shrink-0 text-amber-300" />
              Pincode not available yet - but you can still book and we'll reach out.
            </div>
          )}

          <div className="mt-3 flex items-center gap-3">
            <span className="h-px flex-1 bg-navy-foreground/15" />
            <span className="text-[11px] font-medium uppercase tracking-wide text-navy-foreground/50">
              or
            </span>
            <span className="h-px flex-1 bg-navy-foreground/15" />
          </div>
          <a
            href={`https://wa.me/91${businessContact.phone}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-soft transition-transform hover:-translate-y-0.5"
          >
            <WhatsAppIcon className="size-5" />
            Sell instantly on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
