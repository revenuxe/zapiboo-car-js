import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Laptop,
  Loader2,
  Phone,
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
  type ConditionOption,
  type DeviceModel,
  type OptionKind,
} from "@/lib/device-buyback";

export const Route = createFileRoute("/sell/$category/$brand/$series/$model")({
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

const SLOTS = ["Morning (9am–12pm)", "Afternoon (12pm–4pm)", "Evening (4pm–8pm)"];

function EvaluatePage() {
  const { category, brand, series, model } = useParams({
    from: "/sell/$category/$brand/$series/$model",
  });
  const { user } = useAuth();
  const { data: cat, isLoading: catLoading } = useDeviceCategory(category);
  const { data: brandRow, isLoading: brandLoading } = useDeviceBrandBySlug(cat?.id, brand);
  const { data: seriesRow, isLoading: seriesLoading } = useDeviceSeriesBySlug(brandRow?.id, series);
  const { data: modelRow, isLoading: modelLoading } = useDeviceModelBySlug(seriesRow?.id, model);
  const { data: groups = [] } = useConditionGroups(cat?.id);

  const [selections, setSelections] = useState<Selections>({});
  const [phase, setPhase] = useState<"condition" | "book" | "done">("condition");
  const [pincode, setPincode] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") setPincode(sessionStorage.getItem(PINCODE_KEY) ?? "");
  }, []);

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

  return (
    <div className="bg-secondary/30">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {phase !== "done" && (
          <Breadcrumbs
            crumbs={[
              { label: "Home", to: "/" },
              { label: "Sell", to: "/sell/$category", params: { category } },
              { label: brandName, to: "/sell/$category/$brand", params: { category, brand } },
              { label: seriesName, to: "/sell/$category/$brand/$series", params: { category, brand, series } },
              { label: modelRow.name },
            ]}
          />
        )}

        <div className="mt-6 rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-7">
          {phase === "condition" && (
            <ConditionStep
              modelName={modelRow.name}
              groups={groups}
              selections={selections}
              setSelections={setSelections}
              quote={quote.final}
              onContinue={() => setPhase("book")}
            />
          )}

          {phase === "book" && (
            <QuoteAndBook
              categoryId={cat!.id}
              categoryName={cat!.name}
              brandName={brandName}
              seriesName={seriesName}
              model={modelRow}
              quote={quote}
              pincode={pincode}
              userId={user?.id ?? null}
              onBooked={() => setPhase("done")}
              onBack={() => setPhase("condition")}
            />
          )}

          {phase === "done" && (
            <div className="py-6 text-center">
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
          )}
        </div>
      </div>
    </div>
  );
}

function ConditionStep({
  modelName,
  groups,
  selections,
  setSelections,
  quote,
  onContinue,
}: {
  modelName: string;
  groups: ReturnType<typeof useConditionGroups>["data"];
  selections: Selections;
  setSelections: React.Dispatch<React.SetStateAction<Selections>>;
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
      <h1 className="text-xl font-bold sm:text-2xl">Tell us the condition</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Evaluating your <span className="font-semibold text-foreground">{modelName}</span> — honest answers
        get you an accurate, fair quote.
      </p>

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
