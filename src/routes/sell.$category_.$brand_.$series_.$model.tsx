import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  Download,
  Laptop,
  Loader2,
  LogIn,
  Phone,
  Truck,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumbs } from "@/components/sell/CatalogShell";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { useAuth } from "@/hooks/use-auth";
import type { BookingInvoiceData } from "@/lib/invoice";
import { businessContact } from "@/lib/seo";
import { PINCODE_KEY } from "@/routes/sell.$category";
import { devicePathQuery, useDevicePath, type DeviceModel } from "@/lib/device-buyback";
import { PageLoader } from "@/components/PageLoader";

export const Route = createFileRoute("/sell/$category_/$brand_/$series_/$model")({
  head: ({ params }) => ({
    meta: [
      { title: `Sell ${cap(params.model)} in Bangalore — Book Free Pickup | ZAPIBOO` },
      {
        name: "description",
        content: `Book a free doorstep pickup for your ${cap(params.model)} in Bangalore. Our team will inspect, quote and pay you on the spot.`,
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(
      devicePathQuery(params.category, params.brand, params.series, params.model),
    ),
  component: SellModelPage,
});

function cap(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

const SLOTS = ["Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–8pm)"];

function SellModelPage() {
  const { category, brand, series, model } = useParams({
    from: "/sell/$category_/$brand_/$series_/$model",
  });
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: path, isLoading: pathLoading } = useDevicePath(category, brand, series, model);
  const cat = path?.category ?? null;
  const brandRow = path?.brand ?? null;
  const seriesRow = path?.series ?? null;
  const modelRow = path?.model ?? null;

  const [pincode, setPincode] = useState("");
  const [done, setDone] = useState(false);
  const [invoice, setInvoice] = useState<BookingInvoiceData | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPincode(sessionStorage.getItem(PINCODE_KEY) ?? "");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [done]);

  const loading = pathLoading || authLoading;
  const brandName = brandRow?.name ?? cap(brand);
  const seriesName = seriesRow?.name ?? cap(series);

  if (loading) {
    return <PageLoader label="Getting your device ready" />;
  }

  if (!modelRow) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Laptop className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-xl font-bold">Model not found</h1>
        <Button asChild variant="hero" className="mt-6">
          <Link to="/sell/$category/$brand/$series" params={{ category, brand, series }}>
            Back to models <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="bg-secondary/30">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <div className="rounded-3xl border border-border bg-card p-7 text-center shadow-soft">
            <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <CheckCircle2 className="size-9" />
            </div>
            <h2 className="mt-4 text-2xl font-bold">Pickup requested!</h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Our team will call you shortly to confirm your {modelRow.name} pickup. Your booking invoice has been
              downloaded.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {invoice && (
                <Button
                  variant="navy"
                  onClick={() =>
                    import("@/lib/invoice")
                      .then(({ downloadBookingInvoice }) => downloadBookingInvoice(invoice))
                      .catch(() => toast.error("Couldn't generate the invoice."))
                  }
                >
                  <Download className="size-4" /> Download invoice
                </Button>
              )}
              <Button variant="hero" asChild>
                <Link to="/sell/$category" params={{ category }}>
                  Sell another device
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/account">View my requests</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const goToLogin = () => {
    if (typeof window !== "undefined") {
      navigate({ to: "/auth", search: { redirectTo: window.location.pathname } as never });
    }
  };

  const waHref = `https://wa.me/91${businessContact.phone}?text=${encodeURIComponent(
    `Hi ZAPIBOO, I want to sell my ${modelRow.name} in Bangalore. Please help me book a free pickup.`,
  )}`;

  return (
    <div className="bg-secondary/30 pb-16">
      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-9 lg:px-8">
        <Breadcrumbs
          crumbs={[
            { label: "Home", to: "/" },
            { label: "Sell", to: "/sell/$category", params: { category } },
            { label: brandName, to: "/sell/$category/$brand", params: { category, brand } },
            { label: seriesName, to: "/sell/$category/$brand/$series", params: { category, brand, series } },
            { label: modelRow.name },
          ]}
        />

        {/* Device header */}
        <div className="mt-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5 shadow-soft">
          <div className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-secondary">
            {modelRow.image ? (
              <img src={modelRow.image} alt={modelRow.name} className="max-h-full max-w-full object-contain p-1" />
            ) : (
              <Laptop className="size-6 text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">
              {brandName} · {seriesName}
            </p>
            <p className="truncate font-bold leading-tight">{modelRow.name}</p>
          </div>
        </div>

        {/* WhatsApp quick-chat CTA */}
        <a
          href={waHref}
          target="_blank"
          rel="noreferrer"
          className="group mt-4 flex items-center gap-3 rounded-3xl border border-[#25D366]/25 bg-[#25D366]/8 p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated sm:p-5"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#25D366] shadow-soft sm:size-12">
            <WhatsAppIcon className="size-6 sm:size-7" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-foreground sm:text-base">
              Prefer to chat? Sell on WhatsApp
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">
              Send a photo of your {modelRow.name} and get a quote in minutes.
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0 text-[#128C7E] transition-transform group-hover:translate-x-0.5" />
        </a>

        {/* Auth-gated booking */}
        <div className="mt-5">
          {!user ? (
            <LoginPrompt onLogin={goToLogin} model={modelRow} />
          ) : (
            <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
              <BookingForm
                categoryId={cat!.id}
                categoryName={cat!.name}
                brandName={brandName}
                seriesName={seriesName}
                model={modelRow}
                pincode={pincode}
                userId={user.id}
                onBooked={(inv) => {
                  setInvoice(inv);
                  setDone(true);
                }}
              />
            </div>
          )}
        </div>

        {/* Trust strip */}
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { icon: BadgeIndianRupee, title: "Best price", text: "Fair, market-linked quote at pickup." },
            { icon: Truck, title: "Free pickup", text: "Doorstep collection across Bangalore." },
            { icon: Wallet, title: "Instant payment", text: "Get paid the moment we verify your device." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <f.icon className="size-6 text-primary" />
              <h3 className="mt-2 text-sm font-bold">{f.title}</h3>
              <p className="mt-0.5 text-xs text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LoginPrompt({ onLogin, model }: { onLogin: () => void; model: DeviceModel }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-7 text-center shadow-soft">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <LogIn className="size-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold">Sign in to book your free pickup</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Log in or create a free account to book a doorstep pickup for your {model.name}. We'll bring you right back
        here.
      </p>
      <Button variant="hero" size="lg" className="mt-6 w-full sm:w-auto" onClick={onLogin}>
        <LogIn className="size-4" /> Login to continue
      </Button>
    </div>
  );
}

function BookingForm({
  categoryId,
  categoryName,
  brandName,
  seriesName,
  model,
  pincode,
  userId,
  onBooked,
}: {
  categoryId: string;
  categoryName: string;
  brandName: string;
  seriesName: string | null;
  model: DeviceModel;
  pincode: string;
  userId: string;
  onBooked: (invoice: BookingInvoiceData) => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState(pincode);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [notes, setNotes] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  const { data: prefill } = useQuery({
    queryKey: ["booking-prefill", userId],
    enabled: !!userId,
    staleTime: 60_000,
    queryFn: async () => {
      const [{ data: profile }, { data: auth }] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("full_name, whatsapp, address, pincode")
          .eq("user_id", userId)
          .maybeSingle(),
        supabase.auth.getUser(),
      ]);
      const meta = (auth.user?.user_metadata ?? {}) as { full_name?: string; phone?: string };
      return {
        full_name: profile?.full_name ?? meta.full_name ?? "",
        phone: profile?.whatsapp ?? meta.phone ?? "",
        email: auth.user?.email ?? "",
        address: profile?.address ?? "",
        pincode: profile?.pincode ?? "",
      };
    },
  });

  useEffect(() => {
    if (!prefill || prefilled) return;
    if (prefill.full_name) setName(prefill.full_name);
    if (prefill.phone) setPhone(prefill.phone);
    if (prefill.email) setEmail(prefill.email);
    if (prefill.address) setAddress(prefill.address);
    if (prefill.pincode && !pin) setPin(prefill.pincode);
    setPrefilled(true);
  }, [prefill, prefilled, pin]);

  const book = useMutation({
    mutationFn: async (): Promise<BookingInvoiceData> => {
      const { data: inserted, error } = await supabase
        .from("device_orders")
        .insert({
          category_id: categoryId,
          model_id: model.id,
          category_name: categoryName,
          brand_name: brandName,
          series_name: seriesName,
          model_name: model.name,
          base_price: model.base_price,
          final_price: model.base_price,
          selections: [] as unknown as never,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          address: address.trim() || null,
          pincode: pin.trim() || null,
          preferred_date: date || null,
          slot,
          notes: notes.trim() || null,
          user_id: userId,
        })
        .select("id, created_at")
        .single();
      if (error) throw error;

      await supabase.from("user_profiles").upsert(
        {
          user_id: userId,
          full_name: name.trim() || null,
          whatsapp: phone.trim() || null,
          address: address.trim() || null,
          pincode: pin.trim() || null,
        },
        { onConflict: "user_id" },
      );

      const reference = `HM-${String(inserted?.id ?? "").slice(0, 8).toUpperCase() || Date.now().toString(36).toUpperCase()}`;
      return {
        reference,
        createdAt: inserted?.created_at ? new Date(inserted.created_at) : new Date(),
        customer: {
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim() || null,
          address: address.trim() || null,
          pincode: pin.trim() || null,
        },
        device: {
          category: categoryName,
          brand: brandName,
          series: seriesName,
          model: model.name,
        },
        finalPrice: 0,
        preferredDate: date || null,
        slot,
        notes: notes.trim() || null,
      };
    },
    onSuccess: (inv) => {
      import("@/lib/invoice")
        .then(({ downloadBookingInvoice }) => downloadBookingInvoice(inv))
        .catch(() => toast.error("Booking saved, but the invoice couldn't be generated."));
      onBooked(inv);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't submit your request."),
  });

  const valid = name.trim().length > 1 && /^\d{10}$/.test(phone.trim()) && agreed;

  return (
    <div>
      <h3 className="text-lg font-bold">Book your free pickup</h3>
      <p className="mt-1 text-xs text-muted-foreground">
        Our team will visit your address, evaluate the device on the spot and pay you instantly.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label className="text-xs">Full name *</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Phone *</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
            inputMode="numeric"
            placeholder="10-digit mobile"
          />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs">Email (optional)</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@email.com" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs">Pickup address</Label>
          <Textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="House / flat, street, area, Bangalore"
            rows={2}
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Pincode</Label>
          <Input
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
            inputMode="numeric"
            placeholder="560001"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Preferred date</Label>
          <Input value={date} onChange={(e) => setDate(e.target.value)} type="date" />
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs">Preferred slot</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {SLOTS.map((s) => (
              <button
                key={s}
                onClick={() => setSlot(s)}
                className={`rounded-xl border p-2.5 text-xs font-medium transition-colors ${
                  slot === s
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs">Notes (optional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything we should know?"
            rows={2}
          />
        </div>
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-secondary/40 p-3.5">
        <Checkbox checked={agreed} onCheckedChange={(v) => setAgreed(v === true)} className="mt-0.5" />
        <span className="text-xs leading-relaxed text-muted-foreground">
          I agree to ZAPIBOO's{" "}
          <Link to="/terms" target="_blank" className="font-semibold text-primary underline-offset-2 hover:underline">
            Terms &amp; Conditions
          </Link>{" "}
          and understand the final price is confirmed after a free doorstep evaluation of my device.
        </span>
      </label>

      <Button
        variant="hero"
        size="lg"
        className="mt-4 w-full"
        disabled={!valid || book.isPending}
        onClick={() => book.mutate()}
      >
        {book.isPending ? <Loader2 className="size-4 animate-spin" /> : <Phone className="size-4" />}
        Confirm free pickup
      </Button>
      {!valid && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          {!agreed && name.trim().length > 1 && /^\d{10}$/.test(phone.trim())
            ? "Please accept the Terms & Conditions to continue."
            : "Enter your name, a valid 10-digit phone number, and accept the terms to continue."}
        </p>
      )}
    </div>
  );
}
