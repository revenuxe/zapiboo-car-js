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
import { BrandLogo } from "@/components/sell/BrandLogo";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { businessContact } from "@/lib/seo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  categoryWithBrandsQuery,
  useCategoryWithBrands,
} from "@/lib/device-buyback";
import { featuredServiceAreas, serviceAreas } from "@/lib/seo";
import { laptopBrands } from "@/lib/laptop-brands";
import { isPincodeAvailable, useServiceAvailability } from "@/lib/service-availability";

export const Route = createFileRoute("/sell/$category")({
  head: () => ({
    meta: [
      { title: "Sell Old Laptop in Bangalore - Instant Cash | HuluMart" },
      {
        name: "description",
        content:
          "Sell your old or used laptop in Bangalore for instant cash. Get a free instant quote, free doorstep pickup and same-day payment. Apple, Dell, HP, Lenovo & more.",
      },
      { property: "og:title", content: "Sell Old Laptop in Bangalore - Instant Cash | HuluMart" },
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
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(categoryWithBrandsQuery(params.category)),
  component: SellLanding,
});

export const PINCODE_KEY = "hm_sell_pincode";

function SellLanding() {
  const { category } = useParams({ from: "/sell/$category" });

  return <SellCategoryLanding category={category} />;
}

export function SellLaptopHome() {
  return <SellCategoryLanding category="laptops" />;
}

function SellCategoryLanding({ category }: { category: string }) {
  const { data, isLoading } = useCategoryWithBrands(category);
  const cat = data?.category ?? null;
  const brands = data?.brands ?? [];

  // Render the shell immediately — the hero doesn't depend on DB data. Only
  // gate the "category not available" fallback until the lookup finishes.
  if (!cat && !isLoading) {
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

  return (
    <Landing
      category={category}
      categoryName={cat?.name ?? (category === "laptops" ? "Laptop" : category)}
      brands={brands}
      brandsLoading={isLoading && brands.length === 0}
    />
  );
}

function Landing({
  category,
  categoryName,
  brands,
  brandsLoading,
}: {
  category: string;
  categoryName: string;
  brands: import("@/lib/device-buyback").DeviceBrand[];
  brandsLoading: boolean;
}) {
  const lower = categoryName.toLowerCase();
  const navigate = useNavigate();
  const { data: availability } = useServiceAvailability();
  const [pincode, setPincode] = useState("");
  const [checkedPin, setCheckedPin] = useState<string | null>(null);
  const [query, setQuery] = useState("");


  const savePincode = (v: string) => {
    if (typeof window !== "undefined") sessionStorage.setItem(PINCODE_KEY, v);
  };

  const goToBrand = (slug: string) => {
    savePincode(pincode);
    navigate({ to: "/sell/$category/$brand", params: { category, brand: slug } });
  };

  const checkAvailability = () => {
    if (pincode.length !== 6) return;
    savePincode(pincode);
    setCheckedPin(pincode);
  };

  const available =
    checkedPin && checkedPin === pincode ? isPincodeAvailable(pincode, availability) : null;

  const scrollToBrands = () => {
    savePincode(pincode);
    document.getElementById("brands")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <div className="relative mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 md:py-24 lg:px-8">
          <h1 className="text-3xl font-extrabold leading-[1.1] sm:text-4xl md:text-5xl">
            Sell your old <span className="text-gradient">{lower}</span> in Bangalore
          </h1>
          <p className="mx-auto mt-4 max-w-md text-navy-foreground/75">
            Get the best price for your used {lower} in minutes. Free doorstep pickup across Bengaluru
            and instant payment the moment we collect it.
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-navy-foreground/10 bg-navy-foreground/5 p-3 text-left backdrop-blur">
            <Label className="px-1 text-xs font-semibold text-navy-foreground/70">Your Bangalore pincode</Label>
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
              {available === null && (
                <Button variant="hero" size="lg" disabled={pincode.length !== 6} onClick={checkAvailability}>
                  Check <ArrowRight className="size-4" />
                </Button>
              )}
              {available !== null && (
                <Button variant="hero" size="lg" onClick={scrollToBrands}>
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
              <span className="text-[11px] font-medium uppercase tracking-wide text-navy-foreground/50">or</span>
              <span className="h-px flex-1 bg-navy-foreground/15" />
            </div>
            <a
              href={`https://wa.me/91${businessContact.phone}?text=${encodeURIComponent(
                `Hi HuluMart, I want to sell my ${lower} in Bangalore. Please help me get a quote.`,
              )}`}
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

      {/* BRANDS */}
      <section id="brands" className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Select your {lower} brand</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Choose a brand to find your exact model and get an instant price.
          </p>

          <div className="relative mt-5 max-w-md">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search ${lower} brands…`}
              aria-label="Search brands"
              className="h-12 rounded-2xl pl-4"
            />
          </div>

          {brandsLoading ? (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[132px] animate-pulse rounded-2xl border border-border bg-card"
                />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
              No brands found.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {filtered.map((b, i) => (
                <button
                  key={b.id}
                  onClick={() => goToBrand(b.slug)}
                  className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated"
                >
                  <BrandLogo
                    src={b.logo}
                    name={b.name}
                    eager={i < 10}
                    highPriority={i < 5}
                  />

                  <span className="text-sm font-semibold">{b.name}</span>
                </button>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* LOCATIONS */}
      {category === "laptops" && <LaptopLocationsSection />}



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
              { icon: Wallet, title: "Instant payment", text: "Once verified, get paid instantly via UPI or bank transfer - no waiting." },
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
              { q: `How is my ${lower}'s price calculated?`, a: `We start from the best-case price for your exact model, then adjust for its physical condition, any functional issues, age and the accessories you have - just like the top buyback brands.` },
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

      {/* SELL BY BRAND - simple SEO links above footer */}
      {category === "laptops" && <BrandLinksSection />}
    </>
  );
}

function BrandLinksSection() {
  return (
    <section className="border-t border-border bg-background py-12 md:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xl font-bold sm:text-2xl">Sell used laptop by brand in Bangalore</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Explore detailed guides and instant prices for every laptop brand we buy in Bengaluru.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 text-sm">
          {laptopBrands.map((b) => (
            <Link
              key={b.slug}
              to="/sell-old-laptop/$brand"
              params={{ brand: b.slug }}
              className="font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              Sell used {b.name} laptop
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function LaptopLocationsSection() {
  const areas = useMemo(() => {
    const order = new Map(featuredServiceAreas.map((slug, i) => [slug, i]));
    return [...serviceAreas]
      .filter((a) => order.has(a.slug))
      .sort((a, b) => (order.get(a.slug)! - order.get(b.slug)!));
  }, []);

  if (areas.length === 0) return null;

  return (
    <section className="bg-secondary/40 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">
          Sell laptop near you
        </p>
        <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
          Sell used laptops across Bangalore
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Free doorstep laptop pickup in every major Bangalore locality. Tap your area for a
          dedicated local page and instant quote.
        </p>

        <div className="mt-8 flex gap-4 overflow-x-auto pb-4 [scrollbar-width:thin]">
          {areas.map((area) => (
            <Link
              key={area.slug}
              to="/sell-used-laptop/$area"
              params={{ area: area.slug }}
              className="group flex w-28 shrink-0 flex-col items-center gap-2 text-center"
            >
              <span className="flex size-20 items-center justify-center rounded-full border border-border bg-card text-primary shadow-soft transition-all group-hover:-translate-y-1 group-hover:border-primary group-hover:shadow-elevated">
                <MapPin className="size-7" />
              </span>
              <span className="text-sm font-semibold leading-tight">{area.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
