import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeIndianRupee,
  CheckCircle2,
  Laptop,
  Loader2,
  MapPin,
  ShieldCheck,
  Tag,
  Truck,
  Wallet,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDeviceBrands, useDeviceCategory } from "@/lib/device-buyback";
import { isPincodeAvailable, useServiceAvailability } from "@/lib/service-availability";

export const Route = createFileRoute("/sell/$category")({
  head: () => ({
    meta: [
      { title: "Sell Old Laptop in Bangalore — Instant Cash | HuluMart" },
      {
        name: "description",
        content:
          "Sell your old or used laptop in Bangalore for instant cash. Get a free instant quote, free doorstep pickup and same-day payment. Apple, Dell, HP, Lenovo & more.",
      },
      { property: "og:title", content: "Sell Old Laptop in Bangalore — Instant Cash | HuluMart" },
      {
        property: "og:description",
        content:
          "Get an instant price for your used laptop in Bangalore. Free doorstep pickup and instant payment.",
      },
    ],
    links: [{ rel: "canonical", href: "/sell/laptops" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          name: "Sell Old Laptop in Bangalore",
          areaServed: "Bengaluru",
          provider: { "@type": "Organization", name: "HuluMart" },
          serviceType: "Used laptop buyback with doorstep pickup",
        }),
      },
    ],
  }),
  component: SellLanding,
});

export const PINCODE_KEY = "hm_sell_pincode";

function SellLanding() {
  const { category } = useParams({ from: "/sell/$category" });
  const { data: cat, isLoading: catLoading } = useDeviceCategory(category);

  if (catLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!cat) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Laptop className="mx-auto size-10 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-bold">Category not available</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This device category isn't live yet. Try selling a laptop instead.
        </p>
        <Button asChild variant="hero" className="mt-6">
          <Link to="/sell/$category" params={{ category: "laptops" }}>
            Sell a laptop
          </Link>
        </Button>
      </div>
    );
  }

  return <Landing category={category} categoryId={cat.id} categoryName={cat.name} />;
}

function Landing({
  category,
  categoryId,
  categoryName,
}: {
  category: string;
  categoryId: string;
  categoryName: string;
}) {
  const lower = categoryName.toLowerCase();
  const navigate = useNavigate();
  const { data: brands = [], isLoading: brandsLoading } = useDeviceBrands(categoryId);
  const [pincode, setPincode] = useState("");
  const [query, setQuery] = useState("");

  const savePincode = (v: string) => {
    if (typeof window !== "undefined") sessionStorage.setItem(PINCODE_KEY, v);
  };

  const goToBrand = (slug: string) => {
    savePincode(pincode);
    navigate({ to: "/sell/$category/$brand", params: { category, brand: slug } });
  };

  const filtered = useMemo(
    () => brands.filter((b) => b.name.toLowerCase().includes(query.trim().toLowerCase())),
    [brands, query],
  );

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-brand-green/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-16 size-72 rounded-full bg-brand-green/10 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-navy-foreground/15 bg-navy-foreground/5 px-3 py-1 text-xs font-semibold text-brand-green">
              <Sparkles className="size-3.5" /> Instant quote · Free pickup in Bangalore
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] sm:text-4xl md:text-5xl">
              Sell your old <span className="text-gradient">{lower}</span> in Bangalore
            </h1>
            <p className="mt-4 max-w-md text-navy-foreground/75">
              Get the best price for your used {lower} in minutes. Free doorstep pickup across Bengaluru
              and instant payment the moment we collect it.
            </p>

            <div className="mt-7 max-w-md rounded-2xl border border-navy-foreground/10 bg-navy-foreground/5 p-3 backdrop-blur">
              <Label className="px-1 text-xs font-semibold text-navy-foreground/70">Your Bangalore pincode</Label>
              <div className="mt-1.5 flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-navy-foreground/50" />
                  <Input
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    placeholder="e.g. 560001"
                    className="h-12 border-navy-foreground/15 bg-navy-foreground/10 pl-9 text-navy-foreground placeholder:text-navy-foreground/40"
                  />
                </div>
                <Button
                  variant="hero"
                  size="lg"
                  onClick={() => {
                    savePincode(pincode);
                    document.getElementById("brands")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                >
                  Get quote <ArrowRight className="size-4" />
                </Button>
              </div>
            </div>

            <div className="mt-7 grid max-w-md grid-cols-3 gap-3">
              {[
                { value: "₹50K+", label: "Top payouts" },
                { value: "60 sec", label: "Instant quote" },
                { value: "Same day", label: "Free pickup" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-navy-foreground/10 bg-navy-foreground/5 p-3 text-center">
                  <p className="text-lg font-extrabold text-gradient">{s.value}</p>
                  <p className="text-[11px] text-navy-foreground/70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Brand quick-grid */}
          <div className="rounded-3xl border border-navy-foreground/10 bg-navy-foreground/5 p-5 backdrop-blur">
            <p className="text-sm font-semibold">Pick your brand to start</p>
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {brandsLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="aspect-square animate-pulse rounded-2xl bg-navy-foreground/10" />
                  ))
                : brands.slice(0, 8).map((b) => (
                    <button
                      key={b.id}
                      onClick={() => goToBrand(b.slug)}
                      className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-2xl border border-navy-foreground/10 bg-navy-foreground/5 p-2 transition-all hover:-translate-y-0.5 hover:border-brand-green/50 hover:bg-navy-foreground/10"
                    >
                      {b.logo ? (
                        <img src={b.logo} alt={b.name} className="size-9 object-contain" />
                      ) : (
                        <Tag className="size-6 text-brand-green" />
                      )}
                      <span className="text-[11px] font-medium">{b.name}</span>
                    </button>
                  ))}
            </div>
          </div>
        </div>
      </section>

      {/* BRANDS */}
      <section id="brands" className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Select your {lower} brand</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Choose a brand to find your exact model and get an instant price.
          </p>

          {brands.length > 8 && (
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search brands…"
              className="mt-5 h-12 max-w-md rounded-2xl"
            />
          )}

          {brandsLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-7 animate-spin text-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
              No brands found.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((b) => (
                <button
                  key={b.id}
                  onClick={() => goToBrand(b.slug)}
                  className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated"
                >
                  <div className="flex size-16 items-center justify-center">
                    {b.logo ? (
                      <img src={b.logo} alt={b.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <Tag className="size-8 text-primary" />
                    )}
                  </div>
                  <span className="text-sm font-semibold">{b.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">
            How selling your {lower} works
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground">
            Three simple steps to instant cash, anywhere in Bangalore.
          </p>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: BadgeIndianRupee, title: "Get an instant quote", text: `Select your ${lower}, answer a few condition questions and see your price instantly.` },
              { icon: Truck, title: "Free doorstep pickup", text: "Book a slot. Our verified agent comes to your Bangalore address and verifies the device." },
              { icon: Wallet, title: "Instant payment", text: "Once verified, get paid instantly via UPI or bank transfer — no waiting." },
            ].map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="absolute right-5 top-5 text-4xl font-black text-secondary">{i + 1}</span>
                <s.icon className="size-9 text-primary" />
                <h3 className="mt-4 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="bg-background py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: BadgeIndianRupee, title: "Best market price", text: "Live valuation benchmarked for the Bangalore resale market." },
              { icon: ShieldCheck, title: "Safe & data-wiped", text: "Certified data erasure on every device we collect." },
              { icon: Truck, title: "Free pickup", text: "Doorstep collection across all Bangalore localities." },
              { icon: Wallet, title: "Instant payment", text: "Money in your account the moment we verify your device." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <f.icon className="size-7 text-primary" />
                <h3 className="mt-3 font-bold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/40 py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-extrabold sm:text-3xl">Frequently asked questions</h2>
          <div className="mt-8 space-y-3">
            {[
              { q: `How is my ${lower}'s price calculated?`, a: `We start from the best-case price for your exact model, then adjust for its physical condition, any functional issues, age and the accessories you have — just like the top buyback brands.` },
              { q: "Which areas in Bangalore do you cover?", a: "We offer free doorstep pickup across all major Bangalore localities including Whitefield, HSR Layout, Indiranagar, Koramangala, Electronic City and more." },
              { q: "When do I get paid?", a: "Instantly. Once our agent verifies your device at pickup, payment is transferred via UPI or bank transfer on the spot." },
              { q: "Is my data safe?", a: "Yes. We perform certified data wiping on every device so your personal information is permanently removed." },
            ].map((f) => (
              <div key={f.q} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-bold">{f.q}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
