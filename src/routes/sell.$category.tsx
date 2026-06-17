import { useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  BadgeIndianRupee,
  Check,
  CheckCircle2,
  ChevronRight,
  Laptop,
  Loader2,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import {
  calculateQuote,
  formatPrice,
  useConditionGroups,
  useDeviceBrands,
  useDeviceCategory,
  useDeviceModels,
  useDeviceSeries,
  type ConditionOption,
  type DeviceBrand,
  type DeviceModel,
  type DeviceSeries,
  type OptionKind,
} from "@/lib/device-buyback";

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
  component: SellPage,
});

type Selections = Record<string, string[]>; // groupId -> optionId[]

const SLOTS = ["Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–8pm)"];

function SellPage() {
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

  return <SellFlow categoryId={cat.id} categoryName={cat.name} />;
}

function SellFlow({ categoryId, categoryName }: { categoryId: string; categoryName: string }) {
  const lower = categoryName.toLowerCase();
  const { user } = useAuth();
  const { data: brands = [], isLoading: brandsLoading } = useDeviceBrands(categoryId);
  const { data: groups = [] } = useConditionGroups(categoryId);

  const [pincode, setPincode] = useState("");
  const [step, setStep] = useState(0); // 0 brand,1 series,2 model,3 condition,4 quote+book,5 done
  const [brand, setBrand] = useState<DeviceBrand | null>(null);
  const [series, setSeries] = useState<DeviceSeries | null>(null);
  const [model, setModel] = useState<DeviceModel | null>(null);
  const [selections, setSelections] = useState<Selections>({});

  const { data: seriesList = [] } = useDeviceSeries(brand?.id);
  const { data: models = [] } = useDeviceModels(series?.id);

  // Build the selected option list with metadata for the quote engine.
  const selectedOptions = useMemo(() => {
    const out: { kind: OptionKind; value: number; label: string; group: string }[] = [];
    for (const g of groups) {
      const picked = selections[g.id] ?? [];
      for (const optId of picked) {
        const opt = g.options?.find((o) => o.id === optId);
        if (opt) out.push({ kind: opt.kind, value: opt.value, label: opt.label, group: g.title });
      }
    }
    return out;
  }, [groups, selections]);

  const quote = useMemo(
    () => (model ? calculateQuote(model.base_price, selectedOptions) : { final: 0, breakdown: [] }),
    [model, selectedOptions],
  );

  const reset = () => {
    setStep(0);
    setBrand(null);
    setSeries(null);
    setModel(null);
    setSelections({});
  };

  const goToEvaluator = () => {
    document.getElementById("evaluator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
                <Button variant="hero" size="lg" onClick={goToEvaluator}>
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
                      onClick={() => {
                        setBrand(b);
                        setSeries(null);
                        setModel(null);
                        setStep(1);
                        goToEvaluator();
                      }}
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

      {/* EVALUATOR */}
      <section id="evaluator" className="bg-background py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Stepper step={step} />

          <div className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
            {/* Breadcrumb of choices */}
            {(brand || series || model) && step < 5 && (
              <div className="mb-5 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                {brand && <Crumb label={brand.name} onClick={() => setStep(1)} />}
                {series && (
                  <>
                    <ChevronRight className="size-3.5" />
                    <Crumb label={series.name} onClick={() => setStep(2)} />
                  </>
                )}
                {model && (
                  <>
                    <ChevronRight className="size-3.5" />
                    <Crumb label={model.name} onClick={() => setStep(3)} />
                  </>
                )}
              </div>
            )}

            {step === 0 && (
              <StepShell title="Choose your brand" subtitle={`Which ${lower} brand are you selling?`}>
                <ChoiceGrid
                  loading={brandsLoading}
                  empty="No brands available yet."
                  items={brands.map((b) => ({ id: b.id, label: b.name, image: b.logo }))}
                  onSelect={(id) => {
                    const b = brands.find((x) => x.id === id)!;
                    setBrand(b);
                    setSeries(null);
                    setModel(null);
                    setStep(1);
                  }}
                />
              </StepShell>
            )}

            {step === 1 && (
              <StepShell title="Choose the series" subtitle={`${brand?.name} ${lower} series`}>
                <ChoiceList
                  empty="No series found for this brand."
                  items={seriesList.map((s) => ({ id: s.id, label: s.name }))}
                  onSelect={(id) => {
                    const s = seriesList.find((x) => x.id === id)!;
                    setSeries(s);
                    setModel(null);
                    setStep(2);
                  }}
                />
              </StepShell>
            )}

            {step === 2 && (
              <StepShell title="Choose your model" subtitle="Pick the exact model & year">
                <ChoiceList
                  empty="No models found for this series."
                  items={models.map((m) => ({
                    id: m.id,
                    label: m.name,
                    meta: `Up to ${formatPrice(m.base_price)}`,
                  }))}
                  onSelect={(id) => {
                    const m = models.find((x) => x.id === id)!;
                    setModel(m);
                    setSelections({});
                    setStep(3);
                  }}
                />
              </StepShell>
            )}

            {step === 3 && model && (
              <ConditionStep
                groups={groups}
                selections={selections}
                setSelections={setSelections}
                base={model.base_price}
                quote={quote.final}
                onContinue={() => setStep(4)}
              />
            )}

            {step === 4 && model && brand && (
              <QuoteAndBook
                categoryId={categoryId}
                categoryName={categoryName}
                brandName={brand.name}
                seriesName={series?.name ?? null}
                model={model}
                quote={quote}
                pincode={pincode}
                userId={user?.id ?? null}
                onBooked={() => setStep(5)}
                onBack={() => setStep(3)}
              />
            )}

            {step === 5 && (
              <div className="py-6 text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <CheckCircle2 className="size-9" />
                </div>
                <h2 className="mt-4 text-2xl font-bold">Pickup requested!</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Our team will call you shortly to confirm your {model?.name} pickup and final price of{" "}
                  <span className="font-bold text-primary">{formatPrice(quote.final)}</span>.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Button variant="hero" onClick={reset}>
                    Sell another device
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/account">View my requests</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
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

function Crumb({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="rounded-full bg-secondary px-2.5 py-1 font-medium text-foreground transition-colors hover:bg-primary hover:text-primary-foreground">
      {label}
    </button>
  );
}

function Stepper({ step }: { step: number }) {
  const labels = ["Brand", "Series", "Model", "Condition", "Booking"];
  const current = Math.min(step, 4);
  return (
    <div className="flex items-center gap-1.5">
      {labels.map((l, i) => (
        <div key={l} className="flex flex-1 items-center gap-1.5">
          <div className="flex items-center gap-2">
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                i < current
                  ? "bg-primary text-primary-foreground"
                  : i === current
                    ? "bg-primary/15 text-primary ring-2 ring-primary"
                    : "bg-secondary text-muted-foreground"
              }`}
            >
              {i < current ? <Check className="size-4" /> : i + 1}
            </span>
            <span className={`hidden text-xs font-semibold sm:inline ${i <= current ? "text-foreground" : "text-muted-foreground"}`}>
              {l}
            </span>
          </div>
          {i < labels.length - 1 && (
            <div className={`h-0.5 flex-1 rounded-full ${i < current ? "bg-primary" : "bg-secondary"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      <div className="mt-5">{children}</div>
    </div>
  );
}

function ChoiceGrid({
  items,
  onSelect,
  loading,
  empty,
}: {
  items: { id: string; label: string; image?: string | null }[];
  onSelect: (id: string) => void;
  loading?: boolean;
  empty: string;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-secondary" />
        ))}
      </div>
    );
  }
  if (!items.length) return <EmptyHint text={empty} />;
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onSelect(it.id)}
          className="flex h-24 flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-background p-3 transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated"
        >
          {it.image ? (
            <img src={it.image} alt={it.label} className="size-10 object-contain" />
          ) : (
            <Tag className="size-7 text-primary" />
          )}
          <span className="text-sm font-semibold">{it.label}</span>
        </button>
      ))}
    </div>
  );
}

function ChoiceList({
  items,
  onSelect,
  empty,
}: {
  items: { id: string; label: string; meta?: string }[];
  onSelect: (id: string) => void;
  empty: string;
}) {
  if (!items.length) return <EmptyHint text={empty} />;
  return (
    <div className="space-y-2.5">
      {items.map((it) => (
        <button
          key={it.id}
          onClick={() => onSelect(it.id)}
          className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-background p-4 text-left transition-all hover:border-primary hover:shadow-soft"
        >
          <span className="font-semibold">{it.label}</span>
          <span className="flex items-center gap-2">
            {it.meta && <span className="text-sm font-bold text-primary">{it.meta}</span>}
            <ArrowRight className="size-4 text-muted-foreground" />
          </span>
        </button>
      ))}
    </div>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  );
}

function ConditionStep({
  groups,
  selections,
  setSelections,
  base,
  quote,
  onContinue,
}: {
  groups: ReturnType<typeof useConditionGroups>["data"];
  selections: Selections;
  setSelections: React.Dispatch<React.SetStateAction<Selections>>;
  base: number;
  quote: number;
  onContinue: () => void;
}) {
  const list = groups ?? [];

  const toggle = (groupId: string, optId: string, multi: boolean) => {
    setSelections((prev) => {
      const current = prev[groupId] ?? [];
      if (multi) {
        return {
          ...prev,
          [groupId]: current.includes(optId) ? current.filter((x) => x !== optId) : [...current, optId],
        };
      }
      return { ...prev, [groupId]: current.includes(optId) ? [] : [optId] };
    });
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Tell us the condition</h2>
      <p className="mt-1 text-sm text-muted-foreground">Honest answers get you an accurate, fair quote.</p>

      <div className="mt-5 space-y-6 pb-28">
        {list.map((g) => {
          const multi = g.selection === "multi";
          const picked = selections[g.id] ?? [];
          return (
            <div key={g.id}>
              <h3 className="font-semibold">{g.title}</h3>
              {g.subtitle && <p className="text-xs text-muted-foreground">{g.subtitle}</p>}
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {(g.options ?? []).map((o) => (
                  <ConditionChoice
                    key={o.id}
                    option={o}
                    selected={picked.includes(o.id)}
                    multi={multi}
                    onClick={() => toggle(g.id, o.id, multi)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky live quote bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-1">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Your estimated price</p>
            <p className="text-2xl font-extrabold text-primary">{formatPrice(quote)}</p>
          </div>
          <Button variant="hero" size="lg" onClick={onContinue}>
            Continue <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function ConditionChoice({
  option,
  selected,
  multi,
  onClick,
}: {
  option: ConditionOption;
  selected: boolean;
  multi: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition-all ${
        selected ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-background hover:border-primary/40"
      }`}
    >
      <span
        className={`mt-0.5 flex size-5 shrink-0 items-center justify-center border ${
          multi ? "rounded-md" : "rounded-full"
        } ${selected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/40"}`}
      >
        {selected && <Check className="size-3.5" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{option.label}</span>
        {option.description && (
          <span className="block text-xs text-muted-foreground">{option.description}</span>
        )}
      </span>
    </button>
  );
}

function QuoteAndBook({
  categoryId,
  categoryName,
  brandName,
  seriesName,
  model,
  quote,
  pincode,
  userId,
  onBooked,
  onBack,
}: {
  categoryId: string;
  categoryName: string;
  brandName: string;
  seriesName: string | null;
  model: DeviceModel;
  quote: ReturnType<typeof calculateQuote>;
  pincode: string;
  userId: string | null;
  onBooked: () => void;
  onBack: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [pin, setPin] = useState(pincode);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState(SLOTS[0]);
  const [notes, setNotes] = useState("");

  const book = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("device_orders").insert({
        category_id: categoryId,
        model_id: model.id,
        category_name: categoryName,
        brand_name: brandName,
        series_name: seriesName,
        model_name: model.name,
        base_price: model.base_price,
        final_price: quote.final,
        selections: quote.breakdown as unknown as never,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        address: address.trim() || null,
        pincode: pin.trim() || null,
        preferred_date: date || null,
        slot,
        notes: notes.trim() || null,
        user_id: userId,
      });
      if (error) throw error;
    },
    onSuccess: onBooked,
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't submit your request."),
  });

  const valid = name.trim().length > 1 && /^\d{10}$/.test(phone.trim());

  return (
    <div>
      <button onClick={onBack} className="mb-4 flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to condition
      </button>

      {/* Price card */}
      <div className="overflow-hidden rounded-2xl bg-gradient-navy p-5 text-navy-foreground">
        <p className="text-xs uppercase tracking-wide text-navy-foreground/70">Your instant quote</p>
        <p className="mt-1 text-4xl font-extrabold text-gradient">{formatPrice(quote.final)}</p>
        <p className="mt-1 text-sm text-navy-foreground/75">
          {brandName} {model.name}
        </p>
        <div className="mt-4 space-y-1.5 border-t border-navy-foreground/10 pt-3 text-sm">
          <div className="flex justify-between text-navy-foreground/70">
            <span>Base price</span>
            <span>{formatPrice(model.base_price)}</span>
          </div>
          {quote.breakdown.map((b, i) => (
            <div key={i} className="flex justify-between">
              <span className="text-navy-foreground/70">{b.option}</span>
              <span className={b.impact >= 0 ? "text-brand-green" : "text-red-300"}>
                {b.impact >= 0 ? "+" : "−"}
                {formatPrice(Math.abs(b.impact))}
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t border-navy-foreground/10 pt-2 text-base font-bold">
            <span>Final quote</span>
            <span className="text-gradient">{formatPrice(quote.final)}</span>
          </div>
        </div>
      </div>

      {/* Booking form */}
      <h3 className="mt-6 text-lg font-bold">Book your free pickup</h3>
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
          <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House / flat, street, area, Bangalore" rows={2} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Pincode</Label>
          <Input value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" placeholder="560001" />
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
                  slot === s ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label className="text-xs">Notes (optional)</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Anything we should know?" rows={2} />
        </div>
      </div>

      <Button
        variant="hero"
        size="lg"
        className="mt-5 w-full"
        disabled={!valid || book.isPending}
        onClick={() => book.mutate()}
      >
        {book.isPending ? <Loader2 className="size-4 animate-spin" /> : <Phone className="size-4" />}
        Confirm pickup · {formatPrice(quote.final)}
      </Button>
      {!valid && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Enter your name and a valid 10-digit phone number to continue.
        </p>
      )}
    </div>
  );
}
