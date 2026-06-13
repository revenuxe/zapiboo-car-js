import { useEffect, useRef, useState } from "react";
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
  Chrome,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PickupMap } from "@/components/PickupMap";
import { supabase } from "@/integrations/supabase/client";
import { householdTypes } from "@/lib/bangalore-data";
import { useScrapCategories } from "@/lib/scrap-categories";
import { isPincodeAvailable, useServiceAvailability } from "@/lib/service-availability";
import { displayName, useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type PickupSearch = {
  mode?: "mixed" | "specific";
  item?: string;
  pincode?: string;
  bookingAuth?: "1";
};

// Best-effort icon match for a live category by keyword; falls back to a generic box.
function iconForCategory(name: string) {
  const key = name.toLowerCase();
  const match = householdTypes.find(
    (t) => key.includes(t.name.toLowerCase().split(" ")[0]) || t.name.toLowerCase().includes(key),
  );
  return match?.icon ?? Boxes;
}

export const Route = createFileRoute("/pickup")({
  validateSearch: (search: Record<string, unknown>): PickupSearch => {
    const parsed: PickupSearch = {};
    if (search.mode === "mixed" || search.mode === "specific") parsed.mode = search.mode;
    if (typeof search.item === "string") parsed.item = search.item;
    if (typeof search.pincode === "string" && /^\d{6}$/.test(search.pincode)) {
      parsed.pincode = search.pincode;
    }
    if (search.bookingAuth === "1") parsed.bookingAuth = "1";
    return parsed;
  },
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
        content:
          "Free doorstep pickup for household scrap in Bengaluru. Fair rates, instant payment.",
      },
    ],
    links: [{ rel: "canonical", href: "/pickup" }],
  }),
  component: Pickup,
});

const timeSlots = ["Morning (8–11)", "Midday (11–2)", "Afternoon (2–5)", "Evening (5–8)"];
const todayStr = new Date().toISOString().split("T")[0];
const pickupDraftKey = "hulumart-pickup-draft";

function imageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn't read the photo."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Couldn't process the photo."));
      img.onload = () => {
        const maxSide = 1200;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Couldn't prepare the photo."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.78));
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

function Pickup() {
  const pickupSearch = Route.useSearch();
  const { data: categories = [] } = useScrapCategories();
  const { data: availability } = useServiceAvailability();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // step 1
  const [scrapMode, setScrapMode] = useState<"mixed" | "specific" | "">("");
  const [items, setItems] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // step 2
  const [pincode, setPincode] = useState(pickupSearch.pincode ?? "");
  const [address, setAddress] = useState("");
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);

  // step 3 auth gate
  const [authTab, setAuthTab] = useState<"signin" | "signup">("signin");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authBusy, setAuthBusy] = useState(false);

  // final step
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  const progressSteps = user ? [1, 2, 4] : [1, 2, 3, 4];
  const currentProgress = user && step === 4 ? 3 : step;
  const bookingRedirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/pickup?bookingAuth=1` : undefined;

  const toggleItem = (id: string) =>
    setItems((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const savePickupDraft = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      pickupDraftKey,
      JSON.stringify({
        scrapMode,
        items,
        pincode,
        address,
        geo,
        date,
        slot,
        name,
        phone,
      }),
    );
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const returningFromBookingAuth = pickupSearch.bookingAuth === "1";
    const rawDraft = window.sessionStorage.getItem(pickupDraftKey);

    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft) as {
          scrapMode?: "mixed" | "specific" | "";
          items?: string[];
          pincode?: string;
          address?: string;
          geo?: { lat: number; lng: number } | null;
          date?: string;
          slot?: string;
          name?: string;
          phone?: string;
        };
        if (draft.scrapMode) setScrapMode(draft.scrapMode);
        if (Array.isArray(draft.items)) setItems(draft.items);
        if (draft.pincode) setPincode(draft.pincode);
        if (draft.address) setAddress(draft.address);
        if (draft.geo) setGeo(draft.geo);
        if (draft.date) setDate(draft.date);
        if (draft.slot) setSlot(draft.slot);
        if (draft.name) setName(draft.name);
        if (draft.phone) setPhone(draft.phone);
      } catch {
        window.sessionStorage.removeItem(pickupDraftKey);
      }
    }

    if (returningFromBookingAuth) {
      setStep(user ? 4 : 3);
      params.delete("bookingAuth");
      const query = params.toString();
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}`,
      );
    }
  }, [pickupSearch.bookingAuth, user]);

  useEffect(() => {
    if (!pickupSearch.mode) return;

    if (pickupSearch.mode === "mixed") {
      setScrapMode("mixed");
      setItems([]);
      return;
    }

    setScrapMode("specific");
    if (!pickupSearch.item) return;

    const requested = pickupSearch.item.toLowerCase();
    const matchedCategory =
      categories.find((category) => category.name.toLowerCase() === requested) ??
      categories.find((category) => category.name.toLowerCase().includes(requested)) ??
      categories.find((category) => requested.includes(category.name.toLowerCase()));

    setItems([matchedCategory?.name ?? pickupSearch.item]);
  }, [categories, pickupSearch.item, pickupSearch.mode]);

  useEffect(() => {
    if (!user) return;

    if (step === 3) setStep(4);
    if (!authEmail && user.email) setAuthEmail(user.email);
    if (!name) setName(displayName(user));

    const meta = user.user_metadata as { phone?: string; full_name?: string } | undefined;
    if (!phone && meta?.phone) setPhone(meta.phone);
    if (!authName && meta?.full_name) setAuthName(meta.full_name);
    if (!authPhone && meta?.phone) setAuthPhone(meta.phone);

    let ignore = false;
    supabase
      .from("user_profiles")
      .select("full_name, whatsapp, address, pincode, lat, lng")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (ignore || error || !data) return;
        if (!name && data.full_name) setName(data.full_name);
        if (!phone && data.whatsapp) setPhone(data.whatsapp);
        if (!address && data.address) setAddress(data.address);
        if (!pincode && data.pincode) setPincode(data.pincode);
        if (!geo && data.lat != null && data.lng != null) setGeo({ lat: data.lat, lng: data.lng });
      });

    return () => {
      ignore = true;
    };
  }, [address, authEmail, authName, authPhone, geo, name, phone, pincode, step, user]);

  const signInDuringBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim()) return toast.error("Enter your email.");
    if (!authPassword) return toast.error("Enter your password.");

    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail.trim(),
      password: authPassword,
    });
    setAuthBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Signed in. Let's finish your booking.");
    setStep(4);
  };

  const signInWithGoogleDuringBooking = async () => {
    savePickupDraft();
    setAuthBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: bookingRedirectTo },
    });
    if (error) {
      setAuthBusy(false);
      toast.error(error.message);
    }
  };

  const signUpDuringBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authName.trim().length < 2) return toast.error("Enter your name.");
    if (authPhone.trim().length < 10) return toast.error("Enter a valid WhatsApp number.");
    if (!authEmail.trim()) return toast.error("Enter your email.");
    if (authPassword.length < 6) return toast.error("Password must be at least 6 characters.");

    savePickupDraft();
    setAuthBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email: authEmail.trim(),
      password: authPassword,
      options: {
        emailRedirectTo: bookingRedirectTo,
        data: { full_name: authName.trim(), phone: authPhone.trim() },
      },
    });
    setAuthBusy(false);
    if (error) return toast.error(error.message);

    setName(authName.trim());
    setPhone(authPhone.trim());
    if (data.session) {
      toast.success("Account created. Let's finish your booking.");
      setStep(4);
    } else {
      toast.success("Account created. Please verify your email, then sign in here.");
      setAuthTab("signin");
    }
  };

  const onPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file.");
      return;
    }
    try {
      setPhoto(await imageToDataUrl(file));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't process the photo.");
    }
  };

  const pincodeOk = pincode.length === 6 && isPincodeAvailable(pincode, availability);
  const pincodeBad = pincode.length === 6 && !pincodeOk;

  const goNext = () => {
    if (step === 1) {
      if (!scrapMode) return toast.error("Tell us what you're clearing.");
      if (scrapMode === "specific" && items.length === 0)
        return toast.error("Pick at least one item, or choose Mixed scrap.");
    }
    if (step === 2) {
      if (!pincodeOk) return toast.error("Enter a serviceable 6-digit pincode.");
      if (!address.trim()) return toast.error("Add your flat / house address.");
    }
    if (step === 2) {
      setStep(user ? 4 : 3);
    } else {
      setStep((s) => Math.min(4, s + 1));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => {
      if (s === 4) return user ? 2 : 3;
      return Math.max(1, s - 1);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please sign in before confirming your pickup.");
      setStep(3);
      return;
    }
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
      photo_url: photo,
      locality: null,
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
    const { error: profileError } = await supabase.from("user_profiles").upsert(
      {
        user_id: user.id,
        full_name: name.trim(),
        whatsapp: phone.trim(),
        address: address.trim(),
        pincode,
        lat: geo?.lat ?? null,
        lng: geo?.lng ?? null,
      },
      { onConflict: "user_id" },
    );
    if (profileError) {
      console.error(profileError);
      toast.warning("Pickup saved, but we couldn't save these details for next time.");
    }
    if (typeof window !== "undefined") window.sessionStorage.removeItem(pickupDraftKey);
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
              <MapPin className="size-4 text-brand-green" /> Bengaluru {pincode}
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
      <section className="bg-background py-8 md:py-12">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div className="mb-6">
            <h1 className="text-left text-2xl font-bold tracking-normal text-foreground sm:text-3xl">
              Booking
            </h1>
          </div>

          {/* progress */}
          <div className="mb-8 flex items-center gap-2">
            {progressSteps.map((stepNumber, index) => {
              const visualStep = index + 1;
              return (
                <div key={stepNumber} className="flex flex-1 items-center gap-2">
                  <div
                    className={cn(
                      "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors",
                      currentProgress > visualStep
                        ? "bg-gradient-brand text-primary-foreground"
                        : currentProgress === visualStep
                          ? "bg-foreground text-background"
                          : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {currentProgress > visualStep ? <Check className="size-4" /> : visualStep}
                  </div>
                  {index < progressSteps.length - 1 && (
                    <div
                      className={cn(
                        "h-1 flex-1 rounded-full transition-colors",
                        currentProgress > visualStep ? "bg-primary" : "bg-secondary",
                      )}
                    />
                  )}
                </div>
              );
            })}
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
                <motion.div
                  key="s3-auth"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="mb-4">
                    <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
                      Customer account
                    </p>
                    <h2 className="mt-1 text-2xl font-extrabold leading-tight">
                      {authTab === "signin" ? "Sign in to continue" : "Create your account"}
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Save your address and WhatsApp number for faster pickups.
                    </p>
                  </div>

                  {authLoading ? (
                    <div className="flex items-center justify-center rounded-2xl border border-border bg-background py-10">
                      <Loader2 className="size-6 animate-spin text-primary" />
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-border bg-background p-3 shadow-soft sm:p-4">
                      <Button
                        type="button"
                        variant="google"
                        size="lg"
                        className="mb-3 h-11 w-full rounded-xl text-sm"
                        disabled={authBusy}
                        onClick={signInWithGoogleDuringBooking}
                      >
                        {authBusy ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Chrome className="size-4" />
                        )}
                        Continue with Google
                      </Button>
                      <div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="h-px flex-1 bg-border" />
                        or
                        <span className="h-px flex-1 bg-border" />
                      </div>

                      <Tabs
                        value={authTab}
                        onValueChange={(v) => setAuthTab(v as "signin" | "signup")}
                      >
                        <TabsList className="grid h-10 w-full grid-cols-2 rounded-xl bg-muted p-1">
                          <TabsTrigger value="signin" className="rounded-xl">
                            Sign in
                          </TabsTrigger>
                          <TabsTrigger value="signup" className="rounded-xl">
                            Create account
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="signin" className="mt-4">
                          <form onSubmit={signInDuringBooking} className="space-y-3">
                            <div className="space-y-1.5">
                              <Label htmlFor="booking-si-email">Email</Label>
                              <Input
                                id="booking-si-email"
                                type="email"
                                autoComplete="email"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="h-11 rounded-xl bg-background px-3"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="booking-si-password">Password</Label>
                              <Input
                                id="booking-si-password"
                                type="password"
                                autoComplete="current-password"
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                                placeholder="Password"
                                className="h-11 rounded-xl bg-background px-3"
                              />
                            </div>
                            <Button
                              type="submit"
                              variant="hero"
                              size="lg"
                              className="h-11 w-full rounded-xl text-sm"
                              disabled={authBusy}
                            >
                              {authBusy ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                "Sign in and continue"
                              )}
                            </Button>
                          </form>
                        </TabsContent>

                        <TabsContent value="signup" className="mt-4">
                          <form onSubmit={signUpDuringBooking} className="space-y-3">
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="space-y-1.5">
                                <Label htmlFor="booking-su-name">Full name</Label>
                                <Input
                                  id="booking-su-name"
                                  value={authName}
                                  onChange={(e) => setAuthName(e.target.value)}
                                  placeholder="Your name"
                                  className="h-11 rounded-xl bg-background px-3"
                                />
                              </div>
                              <div className="space-y-1.5">
                                <Label htmlFor="booking-su-phone">WhatsApp</Label>
                                <Input
                                  id="booking-su-phone"
                                  type="tel"
                                  inputMode="numeric"
                                  maxLength={10}
                                  value={authPhone}
                                  onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ""))}
                                  placeholder="10-digit mobile"
                                  className="h-11 rounded-xl bg-background px-3"
                                />
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="booking-su-email">Email</Label>
                              <Input
                                id="booking-su-email"
                                type="email"
                                autoComplete="email"
                                value={authEmail}
                                onChange={(e) => setAuthEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="h-11 rounded-xl bg-background px-3"
                              />
                            </div>
                            <div className="space-y-1.5">
                              <Label htmlFor="booking-su-password">Password</Label>
                              <Input
                                id="booking-su-password"
                                type="password"
                                autoComplete="new-password"
                                value={authPassword}
                                onChange={(e) => setAuthPassword(e.target.value)}
                                placeholder="At least 6 characters"
                                className="h-11 rounded-xl bg-background px-3"
                              />
                            </div>
                            <Button
                              type="submit"
                              variant="hero"
                              size="lg"
                              className="h-11 w-full rounded-xl text-sm"
                              disabled={authBusy}
                            >
                              {authBusy ? (
                                <Loader2 className="size-4 animate-spin" />
                              ) : (
                                "Create account and continue"
                              )}
                            </Button>
                          </form>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </motion.div>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <motion.form
                  key="s4"
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

                  <Button
                    type="submit"
                    variant="hero"
                    size="xl"
                    className="mt-8 w-full"
                    disabled={saving}
                  >
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
            {step >= 3 && (
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
