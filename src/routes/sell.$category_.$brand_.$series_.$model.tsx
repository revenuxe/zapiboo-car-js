import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  BadgeIndianRupee,
  Check,
  CheckCircle2,
  Laptop,
  Loader2,
  LogIn,
  Phone,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Breadcrumbs } from "@/components/sell/CatalogShell";
import { useAuth } from "@/hooks/use-auth";
import { PINCODE_KEY } from "@/routes/sell.$category";
import {
  calculateQuote,
  formatPrice,
  useConditionGroups,
  useDeviceBrandBySlug,
  useDeviceCategory,
  useDeviceModelBySlug,
  useDeviceSeriesBySlug,
  type ConditionGroup,
  type ConditionOption,
  type DeviceModel,
  type OptionKind,
} from "@/lib/device-buyback";

export const Route = createFileRoute("/sell/$category_/$brand_/$series_/$model")({
  head: ({ params }) => ({
    meta: [
      { title: `Sell ${cap(params.model)} in Bangalore — Instant Quote | HuluMart` },
      {
        name: "description",
        content: `Get an instant buyback price for your ${cap(params.model)} in Bangalore. Answer a few condition questions, see your price and book free doorstep pickup.`,
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: EvaluatePage,
});

function cap(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

type Selections = Record<string, string[]>;
type Phase = "intro" | "conditions" | "result" | "booking";

const SLOTS = ["Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–8pm)"];

function EvaluatePage() {
  const { category, brand, series, model } = useParams({
    from: "/sell/$category_/$brand_/$series_/$model",
  });
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { data: cat, isLoading: catLoading } = useDeviceCategory(category);
  const { data: brandRow, isLoading: brandLoading } = useDeviceBrandBySlug(cat?.id, brand);
  const { data: seriesRow, isLoading: seriesLoading } = useDeviceSeriesBySlug(brandRow?.id, series);
  const { data: modelRow, isLoading: modelLoading } = useDeviceModelBySlug(seriesRow?.id, model);
  const { data: groups = [] } = useConditionGroups(cat?.id);

  const storageKey = `hm_eval:${category}/${brand}/${series}/${model}`;

  const [selections, setSelections] = useState<Selections>({});
  const [phase, setPhase] = useState<Phase>("intro");
  const [condStep, setCondStep] = useState(0);
  const [done, setDone] = useState(false);
  const [pincode, setPincode] = useState("");
  const [restored, setRestored] = useState(false);

  // Restore evaluation state (e.g. after a login round-trip).
  useEffect(() => {
    if (typeof window === "undefined") return;
    setPincode(sessionStorage.getItem(PINCODE_KEY) ?? "");
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) {
        const saved = JSON.parse(raw) as { selections?: Selections };
        if (saved.selections) setSelections(saved.selections);
        setRestored(true);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  // After returning from login with saved progress, land on the result screen.
  useEffect(() => {
    if (restored && !authLoading && user) {
      setPhase("result");
      setRestored(false);
      sessionStorage.removeItem(storageKey);
    }
  }, [restored, authLoading, user, storageKey]);

  const selectedOptions = useMemo(() => {
    const out: { kind: OptionKind; value: number; label: string; group: string }[] = [];
    for (const g of groups) {
      for (const optId of selections[g.id] ?? []) {
        const opt = g.options?.find((o) => o.id === optId);
        if (opt) out.push({ kind: opt.kind, value: opt.value, label: opt.label, group: g.title });
      }
    }
    return out;
  }, [groups, selections]);

  const quote = useMemo(
    () => (modelRow ? calculateQuote(modelRow.base_price, selectedOptions) : { final: 0, breakdown: [] }),
    [modelRow, selectedOptions],
  );

  const loading = catLoading || brandLoading || seriesLoading || modelLoading;
  const brandName = brandRow?.name ?? cap(brand);
  const seriesName = seriesRow?.name ?? cap(series);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
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
              Our team will call you shortly to confirm your {modelRow.name} pickup and final price of{" "}
              <span className="font-bold text-primary">{formatPrice(quote.final)}</span>.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
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

  const conditionSteps = groups.length;
  const stepLabels = groups.map((g) => g.title);
  const currentGroup = groups[condStep] ?? null;
  const stepAnswered = currentGroup ? (selections[currentGroup.id]?.length ?? 0) > 0 : true;

  const startEvaluation = () => {
    if (conditionSteps === 0) {
      setPhase("result");
      return;
    }
    setCondStep(0);
    setPhase("conditions");
  };

  const nextCondition = () => {
    if (condStep < conditionSteps - 1) {
      setCondStep((s) => s + 1);
    } else {
      setPhase("result");
    }
  };

  const backCondition = () => {
    if (condStep > 0) setCondStep((s) => s - 1);
    else setPhase("intro");
  };

  const goToLogin = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(storageKey, JSON.stringify({ selections }));
      navigate({ to: "/auth", search: { redirectTo: window.location.pathname } as never });
    }
  };

  return (
    <div className="bg-secondary/30 pb-28">
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
            <p className="text-xs text-muted-foreground">{brandName} · {seriesName}</p>
            <p className="truncate font-bold leading-tight">{modelRow.name}</p>
          </div>
        </div>

        {phase === "intro" && <IntroStep model={modelRow} onStart={startEvaluation} />}

        {phase === "conditions" && currentGroup && (
          <>
            <Stepper labels={stepLabels} current={condStep} />
            <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
              <ConditionStep
                key={currentGroup.id}
                group={currentGroup}
                index={condStep}
                total={conditionSteps}
                selections={selections}
                setSelections={setSelections}
                onAutoAdvance={nextCondition}
              />
            </div>
          </>
        )}

        {phase === "result" && (
          <div className="mt-5">
            {!user ? (
              <LoginPrompt onLogin={goToLogin} />
            ) : (
              <ResultStep
                model={modelRow}
                brandName={brandName}
                quote={quote}
                onBack={() => {
                  if (conditionSteps > 0) {
                    setCondStep(conditionSteps - 1);
                    setPhase("conditions");
                  } else {
                    setPhase("intro");
                  }
                }}
                onContinue={() => setPhase("booking")}
              />
            )}
          </div>
        )}

        {phase === "booking" && (
          <div className="mt-5 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
            <BookingForm
              categoryId={cat!.id}
              categoryName={cat!.name}
              brandName={brandName}
              seriesName={seriesName}
              model={modelRow}
              quote={quote}
              pincode={pincode}
              userId={user?.id ?? null}
              onBack={() => setPhase("result")}
              onBooked={() => setDone(true)}
            />
          </div>
        )}
      </div>

      {/* Sticky action bar — condition steps only (no price shown) */}
      {phase === "conditions" && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 p-3 backdrop-blur-xl">
          <div className="mx-auto flex max-w-3xl items-center justify-end gap-2 px-1">
            <Button variant="outline" size="lg" onClick={backCondition}>
              <ArrowLeft className="size-4" /> Back
            </Button>
            <Button variant="hero" size="lg" disabled={!stepAnswered} onClick={nextCondition}>
              {condStep === conditionSteps - 1 ? "See my price" : "Continue"} <ArrowRight className="size-4" />
            </Button>
          </div>
          {!stepAnswered && (
            <p className="mx-auto mt-1.5 max-w-3xl px-1 text-center text-[11px] text-muted-foreground">
              Pick an option to continue.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function IntroStep({ model, onStart }: { model: DeviceModel; onStart: () => void }) {
  return (
    <div className="mt-5">
      <div className="overflow-hidden rounded-3xl bg-gradient-navy p-6 text-navy-foreground shadow-soft">
        <p className="text-xs uppercase tracking-wide text-navy-foreground/70">Best price up to</p>
        <p className="mt-1 text-4xl font-extrabold text-gradient sm:text-5xl">{formatPrice(model.base_price)}</p>
        <p className="mt-2 max-w-sm text-sm text-navy-foreground/75">
          Answer a few quick questions about your {model.name}'s condition to lock in your exact price.
        </p>
        <Button variant="hero" size="lg" className="mt-5 w-full sm:w-auto" onClick={onStart}>
          Sell now <ArrowRight className="size-4" />
        </Button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {[
          { icon: BadgeIndianRupee, title: "Instant price", text: "See your exact quote in under a minute." },
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
  );
}

function Stepper({ labels, current }: { labels: string[]; current: number }) {
  const total = labels.length;
  const pct = Math.round(((current + 1) / total) * 100);
  return (
    <div className="mt-6">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold">
          Step {Math.min(current + 1, total)} of {total}
          <span className="ml-2 font-normal text-muted-foreground">{labels[current]}</span>
        </p>
        <span className="text-xs font-bold text-primary">{pct}%</span>
      </div>
      <div className="flex items-center gap-1.5">
        {labels.map((label, i) => {
          const stateDone = i < current;
          const active = i === current;
          return (
            <div key={`${label}-${i}`} className="flex flex-1 items-center gap-1.5">
              <div
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  stateDone || active ? "bg-primary" : "bg-border"
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ConditionStep({
  group,
  index,
  total,
  selections,
  setSelections,
  onAutoAdvance,
}: {
  group: ConditionGroup;
  index: number;
  total: number;
  selections: Selections;
  setSelections: React.Dispatch<React.SetStateAction<Selections>>;
  onAutoAdvance: () => void;
}) {
  const multi = group.selection === "multi";
  const picked = selections[group.id] ?? [];

  const toggle = (optId: string) => {
    setSelections((prev) => {
      const current = prev[group.id] ?? [];
      if (multi) {
        return {
          ...prev,
          [group.id]: current.includes(optId)
            ? current.filter((x) => x !== optId)
            : [...current, optId],
        };
      }
      return { ...prev, [group.id]: current.includes(optId) ? [] : [optId] };
    });
    // Single-select: jump straight to the next step for a fast, slick feel.
    if (!multi) {
      window.setTimeout(() => onAutoAdvance(), 220);
    }
  };

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Step {index + 1} of {total}
      </p>
      <h1 className="mt-1 text-xl font-bold sm:text-2xl">{group.title}</h1>
      {group.subtitle && <p className="mt-1 text-sm text-muted-foreground">{group.subtitle}</p>}
      <p className="mt-1 text-xs text-muted-foreground">
        {multi ? "Select all that apply." : "Pick the one that matches best."}
      </p>

      <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {(group.options ?? []).map((o) => (
          <ConditionChoice
            key={o.id}
            option={o}
            selected={picked.includes(o.id)}
            multi={multi}
            onClick={() => toggle(o.id)}
          />
        ))}
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

function LoginPrompt({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-7 text-center shadow-soft">
      <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <LogIn className="size-8" />
      </div>
      <h2 className="mt-4 text-2xl font-bold">Almost there — sign in to see your price</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
        Log in or create a free account to unlock your final quote and book a free doorstep pickup. We'll bring you
        right back here.
      </p>
      <Button variant="hero" size="lg" className="mt-6 w-full sm:w-auto" onClick={onLogin}>
        <LogIn className="size-4" /> Login to continue
      </Button>
    </div>
  );
}

function ResultStep({
  model,
  brandName,
  quote,
  onBack,
  onContinue,
}: {
  model: DeviceModel;
  brandName: string;
  quote: ReturnType<typeof calculateQuote>;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <div>
      <div className="overflow-hidden rounded-3xl bg-gradient-navy p-6 text-navy-foreground shadow-soft">
        <p className="text-xs uppercase tracking-wide text-navy-foreground/70">Your final quote</p>
        <p className="mt-1 text-4xl font-extrabold text-gradient sm:text-5xl">{formatPrice(quote.final)}</p>
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

      <div className="mt-3 flex items-center gap-2 rounded-xl bg-primary/5 p-3 text-xs text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 text-primary" />
        Price locked for your pickup. Instant payment after a quick on-site check.
      </div>

      <div className="mt-5 flex items-center justify-end gap-2">
        <Button variant="outline" size="lg" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back
        </Button>
        <Button variant="hero" size="lg" onClick={onContinue}>
          Continue <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function BookingForm({
  categoryId,
  categoryName,
  brandName,
  seriesName,
  model,
  quote,
  pincode,
  userId,
  onBack,
  onBooked,
}: {
  categoryId: string;
  categoryName: string;
  brandName: string;
  seriesName: string | null;
  model: DeviceModel;
  quote: ReturnType<typeof calculateQuote>;
  pincode: string;
  userId: string | null;
  onBack: () => void;
  onBooked: () => void;
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
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-primary/5 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Locked quote</p>
          <p className="text-2xl font-extrabold text-primary">{formatPrice(quote.final)}</p>
        </div>
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="size-4" /> Back
        </Button>
      </div>

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
