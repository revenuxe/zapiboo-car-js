import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  PartyPopper,
  Camera,
  X,
  MapPin,
  ShieldCheck,
  Wallet,
  Clock,
  Boxes,
  Info,
  Phone,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { PickupMap } from "@/components/PickupMap";
import { supabase } from "@/integrations/supabase/client";
import {
  serviceLocalities,
  householdTypes,
  isPincodeServiceable,
} from "@/lib/bangalore-data";
import { useScrapCategories } from "@/lib/scrap-categories";
import { cn } from "@/lib/utils";

// Best-effort icon match for a live category by keyword; falls back to a generic box.
function iconForCategory(name: string) {
  const key = name.toLowerCase();
  const match = householdTypes.find(
    (t) => key.includes(t.name.toLowerCase().split(" ")[0]) || t.name.toLowerCase().includes(key),
  );
  return match?.icon ?? Boxes;
}

export const Route = createFileRoute("/pickup")({
  head: () => ({
    meta: [
      { title: "Book a Doorstep Scrap Pickup in Bengaluru | HuluMart" },
      {
        name: "description",
        content:
          "Book a free doorstep scrap pickup across Bengaluru in a few taps. Transparent live ₹ rates, certified weighing at your door and instant payment.",
      },
      { property: "og:title", content: "Book a Doorstep Scrap Pickup in Bengaluru | HuluMart" },
      {
        property: "og:description",
        content: "Free doorstep pickup for household scrap in Bengaluru. Fair rates, instant payment.",
      },
    ],
    links: [{ rel: "canonical", href: "/pickup" }],
  }),
  component: Pickup,
});

const timeSlots = ["Morning (8–11)", "Midday (11–2)", "Afternoon (2–5)", "Evening (5–8)"];
const todayStr = new Date().toISOString().split("T")[0];

function Pickup() {
  const { data: categories = [] } = useScrapCategories();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // step 1
  const [scrapMode, setScrapMode] = useState<"mixed" | "specific" | "">("");
  const [items, setItems] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // step 2
  const [locality, setLocality] = useState("");
  const [pincode, setPincode] = useState("");
  const [address, setAddress] = useState("");
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);

  // step 3
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const toggleItem = (id: string) =>
    setItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const onLocality = (val: string) => {
    setLocality(val);
    const match = serviceLocalities.find((l) => l.name === val);
    if (match) setPincode(match.pincode);
  };

  const onPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPhoto(URL.createObjectURL(file));
  };

  const pincodeOk = pincode.length === 6 && isPincodeServiceable(pincode);
  const pincodeBad = pincode.length === 6 && !pincodeOk;

  const goNext = () => {
    if (step === 1) {
      if (!scrapMode) return toast.error("Tell us what you're clearing.");
      if (scrapMode === "specific" && items.length === 0)
        return toast.error("Pick at least one item, or choose Mixed scrap.");
    }
    if (step === 2) {
      if (!locality) return toast.error("Select your locality.");
      if (!pincodeOk) return toast.error("Enter a serviceable 6-digit pincode.");
      if (!address.trim()) return toast.error("Add your flat / house address.");
    }
    setStep((s) => Math.min(3, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return toast.error("Pick a date.");
    if (!slot) return toast.error("Pick a time slot.");
    if (!name.trim() || phone.trim().length < 10)
      return toast.error("Add your name and a valid phone number.");

    setSaving(true);
    const { error } = await supabase.from("leads").insert({
      scrap_mode: scrapMode || "mixed",
      items: scrapMode === "specific" ? items : [],
      size_tier: null,
      has_photo: !!photo,
      locality,
      pincode,
      address: address.trim(),
      name: name.trim(),
      phone: phone.trim(),
      preferred_date: date,
      slot,
      lat: geo?.lat ?? null,
      lng: geo?.lng ?? null,
      status: "new",
    });
    setSaving(false);

    if (error) {
      toast.error("Couldn't save your booking. Please try again.");
      return;
    }
    toast.success("Pickup booked! We'll confirm on WhatsApp shortly.");
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (submitted) {
    return (
      <section className="relative overflow-hidden bg-gradient-navy py-24 text-navy-foreground">
        <div className="pointer-events-none absolute -left-24 -top-24 size-72 rounded-full bg-brand-green/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 size-72 rounded-full bg-brand-green/10 blur-3xl" />
        <div className="relative mx-auto max-w-xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 16 }}
            className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green"
          >
            <PartyPopper className="size-10" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-8 text-3xl font-bold sm:text-4xl"
          >
            Thank you, {name.split(" ")[0] || "friend"}!
          </motion.h1>
          <p className="mt-4 text-navy-foreground/80">
            Your pickup is booked. Our nearest Bengaluru agent will confirm your slot on WhatsApp,
            arrive with a certified weighing scale, bag everything for you, and pay you on the spot.
          </p>

          <motion.blockquote
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-8 max-w-md rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-6"
          >
            <p className="text-lg font-semibold italic leading-relaxed text-gradient">
              “The greatest threat to our planet is the belief that someone else will save it.”
            </p>
            <footer className="mt-3 text-sm text-navy-foreground/60">
              You just took your turn — every kilo you recycle keeps Bengaluru cleaner. 🌱
            </footer>
          </motion.blockquote>

          <div className="mt-8 rounded-2xl border border-navy-foreground/15 bg-navy-foreground/5 p-5 text-left text-sm">
            <p className="flex items-center gap-2">
              <MapPin className="size-4 text-brand-green" /> {locality}, Bengaluru {pincode}
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Clock className="size-4 text-brand-green" /> {date} · {slot}
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Phone className="size-4 text-brand-green" /> {phone}
            </p>
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              variant="hero"
              size="lg"
              onClick={() => {
                setSubmitted(false);
                setStep(1);
              }}
            >
              Book another pickup
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <Link to="/materials">See ₹ rates</Link>
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Book a pickup · Bengaluru"
        title={<>Doorstep pickup, <span className="text-gradient">made easy</span></>}
        subtitle="Pick a slot in a few taps. Our agent comes to your door, weighs on a certified scale at today's live ₹ rate, and pays you on the spot — across Bengaluru."
      />

      <section className="bg-background py-12 md:py-20">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          {/* progress */}
          <div className="mb-8 flex items-center gap-2">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex flex-1 items-center gap-2">
                <div
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                    step > n
                      ? "bg-gradient-brand text-primary-foreground"
                      : step === n
                        ? "bg-foreground text-background"
                        : "bg-secondary text-muted-foreground",
                  )}
                >
                  {step > n ? <Check className="size-4" /> : n}
                </div>
                {n < 3 && (
                  <div
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors",
                      step > n ? "bg-primary" : "bg-secondary",
                    )}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-8">
            <AnimatePresence mode="wait">
              {/* STEP 1 */}
              {step === 1 && (
                <motion.div
                  key="s1"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold">What are you clearing?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Not sure what's in there? Pick mixed — we'll sort and price it for you.
                  </p>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setScrapMode("mixed")}
                      className={cn(
                        "rounded-2xl border-2 p-5 text-left transition-all",
                        scrapMode === "mixed"
                          ? "border-primary bg-accent shadow-soft"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <Boxes className="size-7 text-primary" />
                        <span className="rounded-full bg-gradient-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                          Easiest
                        </span>
                      </div>
                      <div className="mt-3 font-bold">Mixed household scrap</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Newspaper, plastic, metal, bottles — all together.
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setScrapMode("specific")}
                      className={cn(
                        "rounded-2xl border-2 p-5 text-left transition-all",
                        scrapMode === "specific"
                          ? "border-primary bg-accent shadow-soft"
                          : "border-border hover:border-primary/40",
                      )}
                    >
                      <CheckCircle2 className="size-7 text-primary" />
                      <div className="mt-3 font-bold">Pick specific items</div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        Know what you have? Choose the categories.
                      </div>
                    </button>
                  </div>

                  <AnimatePresence>
                    {scrapMode === "specific" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 flex flex-wrap gap-2">
                          {categories.map((c) => {
                            const active = items.includes(c.name);
                            const Icon = iconForCategory(c.name);
                            return (
                              <button
                                type="button"
                                key={c.id}
                                onClick={() => toggleItem(c.name)}
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
                                  active
                                    ? "border-primary bg-gradient-brand text-primary-foreground shadow-green"
                                    : "border-border bg-background hover:border-primary/40",
                                )}
                              >
                                <Icon className="size-4" />
                                {c.name}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {scrapMode && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 flex items-start gap-3 rounded-2xl border border-primary/20 bg-accent/50 p-5"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-green">
                          <ShieldCheck className="size-5" />
                        </div>
                        <div>
                          <p className="font-semibold">Leave the rest to us</p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            No need to sort, bag or weigh a thing. Our agent comes to your door,
                            weighs everything on a certified digital scale at today's live ₹ rate,
                            bags it up, and pays you on the spot.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8">
                    <h3 className="font-bold">Add a photo (optional)</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Snap it and we'll come prepared.
                    </p>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={onPhoto}
                    />
                    {photo ? (
                      <div className="mt-3 relative w-fit">
                        <img
                          src={photo}
                          alt="Your scrap"
                          className="size-28 rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setPhoto(null)}
                          className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-foreground text-background"
                          aria-label="Remove photo"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-6 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
                      >
                        <Camera className="size-5" />
                        Take or upload a photo
                      </button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="s2"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold">Where in Bengaluru?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We'll check that we cover your area.
                  </p>

                  <div className="mt-6 space-y-5">
                    <div className="space-y-2">
                      <Label>Locality</Label>
                      <Select value={locality} onValueChange={onLocality}>
                        <SelectTrigger className="h-11">
                          <SelectValue placeholder="Select your locality" />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {serviceLocalities.map((l) => (
                            <SelectItem key={l.pincode} value={l.name}>
                              {l.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pin">Pincode</Label>
                      <Input
                        id="pin"
                        inputMode="numeric"
                        maxLength={6}
                        className="h-11"
                        placeholder="6-digit pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
                      />
                      {pincodeOk && (
                        <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
                          <CheckCircle2 className="size-4" /> Great — we pick up here!
                        </p>
                      )}
                      {pincodeBad && (
                        <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                          <Info className="size-4" /> Not live here yet. Try a nearby locality —
                          we're expanding fast.
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="addr">Flat / house & landmark</Label>
                      <Textarea
                        id="addr"
                        rows={3}
                        placeholder="e.g. #12, 3rd Cross, near Forum Mall"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-1.5">
                        <MapPin className="size-4 text-primary" /> Pin your location (optional)
                      </Label>
                      <PickupMap value={geo} onChange={setGeo} />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <motion.form
                  key="s3"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold">When should we come?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pick a day and slot — we'll confirm on WhatsApp.
                  </p>

                  <div className="mt-6 space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred date</Label>
                      <Input
                        id="date"
                        type="date"
                        min={todayStr}
                        className="h-11"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Time slot</Label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {timeSlots.map((s) => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => setSlot(s)}
                            className={cn(
                              "rounded-xl border px-2 py-3 text-sm font-medium transition-all",
                              slot === s
                                ? "border-primary bg-accent text-accent-foreground"
                                : "border-border bg-background hover:border-primary/40",
                            )}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="nm">Your name</Label>
                        <Input
                          id="nm"
                          className="h-11"
                          placeholder="Full name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ph">Phone (WhatsApp)</Label>
                        <Input
                          id="ph"
                          type="tel"
                          inputMode="numeric"
                          className="h-11"
                          placeholder="10-digit mobile"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        />
                      </div>
                    </div>
                  </div>

                  <Button type="submit" variant="hero" size="xl" className="mt-8 w-full" disabled={saving}>
                    {saving ? "Booking…" : "Confirm pickup"}
                    {!saving && <ArrowRight />}
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Free to book · You approve the rate before anything is sold.
                  </p>
                </motion.form>
              )}
            </AnimatePresence>

            {/* nav buttons (steps 1 & 2) */}
            {step < 3 && (
              <div className="mt-8 flex items-center justify-between gap-3">
                {step > 1 ? (
                  <Button type="button" variant="ghost" onClick={goBack}>
                    <ArrowLeft />
                    Back
                  </Button>
                ) : (
                  <span />
                )}
                <Button type="button" variant="hero" size="lg" onClick={goNext}>
                  Continue
                  <ArrowRight />
                </Button>
              </div>
            )}
            {step === 3 && (
              <div className="mt-4">
                <Button type="button" variant="ghost" onClick={goBack}>
                  <ArrowLeft />
                  Back
                </Button>
              </div>
            )}
          </div>

          {/* trust strip */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: ShieldCheck, t: "Certified scale" },
              { icon: Wallet, t: "Instant payment" },
              { icon: Clock, t: "Same / next day" },
              { icon: CheckCircle2, t: "Free to book" },
            ].map((r) => (
              <div
                key={r.t}
                className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-xs font-medium"
              >
                <r.icon className="size-4 shrink-0 text-primary" />
                {r.t}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
