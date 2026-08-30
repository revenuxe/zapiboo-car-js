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
import { s3UploadsEnabled, uploadDataUrlToS3, uploadImageToS3 } from "@/lib/s3-upload";
import { vehicleCategories, vehicleCategoryById } from "@/lib/bangalore-data";
import { isPincodeAvailable, useServiceAvailability } from "@/lib/service-availability";
import { displayName, useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

type PickupSearch = {
  pincode?: string;
  bookingAuth?: "1";
};

export const Route = createFileRoute("/pickup")({
  validateSearch: (search: Record<string, unknown>): PickupSearch => {
    const parsed: PickupSearch = {};
    if (typeof search.pincode === "string" && /^\d{6}$/.test(search.pincode)) {
      parsed.pincode = search.pincode;
    }
    if (search.bookingAuth === "1") parsed.bookingAuth = "1";
    return parsed;
  },
  head: () => ({
    meta: [
      { title: "Book a Free Vehicle Inspection in Bengaluru | ZAPIBOO" },
      {
        name: "description",
        content:
          "Book a free doorstep vehicle inspection across Bengaluru in a few taps. Get a fair market-linked offer and same-day payment.",
      },
      { property: "og:title", content: "Book a Free Vehicle Inspection in Bengaluru | ZAPIBOO" },
      {
        property: "og:description",
        content:
          "Free doorstep vehicle inspection in Bengaluru. Fair market-linked offers and same-day payment.",
      },
    ],
    links: [{ rel: "canonical", href: "/pickup" }],
  }),
  component: Pickup,
});

const timeSlots = ["Morning (8–11)", "Midday (11–2)", "Afternoon (2–5)", "Evening (5–8)"];
const todayStr = new Date().toISOString().split("T")[0];
const pickupDraftKey = "zapiboo-pickup-draft";

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

type PickupPhoto = {
  id: string;
  previewUrl: string;
  file: File | null;
  uploadedUrl: string | null;
};

function Pickup() {
  const pickupSearch = Route.useSearch();
  const { data: availability } = useServiceAvailability();
  const { user, loading: authLoading } = useAuth();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [profileStatus, setProfileStatus] = useState<"idle" | "loading" | "filled" | "missing">(
    "idle",
  );

  // steps 1–2: vehicle type, then body style and photo
  const [vehicleType, setVehicleType] = useState<string>("");
  const [vehicleDetails, setVehicleDetails] = useState<string[]>([]);
  const [photo, setPhoto] = useState<PickupPhoto | null>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoUploadPromiseRef = useRef<Promise<string> | null>(null);
  const photoUploadIdRef = useRef<string | null>(null);

  // step 4
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

  // step 5
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);

  // Flow order: vehicle type, vehicle details, sign in (if needed), address, schedule.
  const progressSteps = user ? [1, 2, 4, 5] : [1, 2, 3, 4, 5];
  const currentProgress = Math.max(1, progressSteps.indexOf(step) + 1);

  const bookingRedirectTo =
    typeof window !== "undefined" ? `${window.location.origin}/pickup?bookingAuth=1` : undefined;

  const selectedVehicleCategory = vehicleCategoryById(vehicleType);

  const toggleItem = (id: string) =>
    setVehicleDetails((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));

  const uploadPickupPhoto = async (snapshot: PickupPhoto): Promise<string> => {
    try {
      if (snapshot.file) {
        return await uploadImageToS3(snapshot.file, "pickups", { maxDim: 1200, quality: 0.78 });
      }
      return await uploadDataUrlToS3(snapshot.previewUrl, "pickups");
    } catch (primaryError) {
      try {
        return await uploadDataUrlToS3(snapshot.previewUrl, "pickups");
      } catch {
        throw primaryError instanceof Error
          ? primaryError
          : new Error("Couldn't upload the photo. Please try again.");
      }
    }
  };

  const beginPhotoUpload = (snapshot: PickupPhoto, notify = false): Promise<string> => {
    if (snapshot.uploadedUrl) return Promise.resolve(snapshot.uploadedUrl);
    // Cloud image storage is temporarily disabled — keep the photo local only.
    if (!s3UploadsEnabled) return Promise.resolve("");
    if (photoUploadPromiseRef.current && photoUploadIdRef.current === snapshot.id) {
      return photoUploadPromiseRef.current;
    }

    setPhotoUploading(true);
    photoUploadIdRef.current = snapshot.id;
    const promise = uploadPickupPhoto(snapshot)
      .then((url) => {
        setPhoto((current) => (current?.id === snapshot.id ? { ...current, uploadedUrl: url } : current));
        if (notify) toast.success("Photo saved securely.");
        return url;
      })
      .catch((err) => {
        if (notify) toast.error(err instanceof Error ? err.message : "Couldn't upload the photo.");
        throw err;
      })
      .finally(() => {
        if (photoUploadPromiseRef.current === promise) {
          photoUploadPromiseRef.current = null;
          photoUploadIdRef.current = null;
          setPhotoUploading(false);
        }
      });
    photoUploadPromiseRef.current = promise;
    return promise;
  };

  const savePickupDraft = () => {
    if (typeof window === "undefined") return;
    window.sessionStorage.setItem(
      pickupDraftKey,
      JSON.stringify({
        step,
        flowVersion: 2,
        vehicleType,
        vehicleDetails,
        pincode,
        address,
        geo,
        date,
        slot,
        name,
        phone,
        photo: photo
          ? { id: photo.id, previewUrl: photo.previewUrl, uploadedUrl: photo.uploadedUrl }
          : null,
      }),
    );
  };

  // Restore any in-progress booking draft once on mount. This keeps the whole
  // flow — including which step the user was on — intact across a full page
  // reload (returning from Google OAuth) or any remount triggered by an auth
  // state change, so signing in never bounces back to step 1.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawDraft = window.sessionStorage.getItem(pickupDraftKey);
    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft) as {
          step?: number;
          flowVersion?: number;
          vehicleType?: string;
          vehicleDetails?: string[];
          pincode?: string;
          address?: string;
          geo?: { lat: number; lng: number } | null;
          date?: string;
          slot?: string;
          name?: string;
          phone?: string;
          photo?: { id?: string; previewUrl?: string; uploadedUrl?: string | null } | null;
        };
        if (draft.vehicleType) setVehicleType(draft.vehicleType);
        if (Array.isArray(draft.vehicleDetails)) setVehicleDetails(draft.vehicleDetails);
        if (draft.pincode) setPincode(draft.pincode);
        if (draft.address) setAddress(draft.address);
        if (draft.geo) setGeo(draft.geo);
        if (draft.date) setDate(draft.date);
        if (draft.slot) setSlot(draft.slot);
        if (draft.name) setName(draft.name);
        if (draft.phone) setPhone(draft.phone);
        if (draft.photo?.previewUrl) {
          setPhoto({
            id: draft.photo.id || crypto.randomUUID(),
            previewUrl: draft.photo.previewUrl,
            file: null,
            uploadedUrl: draft.photo.uploadedUrl ?? null,
          });
        }
        if (typeof draft.step === "number" && draft.step >= 1 && draft.step <= 5) {
          // Translate drafts saved before vehicle details became their own step.
          const restoredStep =
            draft.flowVersion === 2
              ? draft.step
              : ({ 1: 2, 2: 4, 3: 3, 4: 5 }[draft.step] ?? 1);
          setStep(restoredStep);
        }
      } catch {
        window.sessionStorage.removeItem(pickupDraftKey);
      }
    }

    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the draft on every meaningful change (once hydrated) so the flow
  // survives reloads/remounts and always resumes from the right step.
  useEffect(() => {
    if (!hydrated || submitted) return;
    savePickupDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, submitted, step, vehicleType, vehicleDetails, pincode, address, geo, date, slot, name, phone, photo]);

  // Strip the bookingAuth flag out of the URL after returning from OAuth.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (pickupSearch.bookingAuth !== "1") return;
    const params = new URLSearchParams(window.location.search);
    params.delete("bookingAuth");
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  }, [pickupSearch.bookingAuth]);

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
    setProfileStatus((s) => (s === "idle" ? "loading" : s));
    supabase
      .from("user_profiles")
      .select("full_name, whatsapp, address, pincode, lat, lng")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (ignore) return;
        if (error || !data) {
          setProfileStatus((s) => (s === "filled" ? s : "missing"));
          return;
        }
        if (!name && data.full_name) setName(data.full_name);
        if (!phone && data.whatsapp) setPhone(data.whatsapp);
        if (!address && data.address) setAddress(data.address);
        if (!pincode && data.pincode) setPincode(data.pincode);
        if (!geo && data.lat != null && data.lng != null) setGeo({ lat: data.lat, lng: data.lng });
        const hasSaved = Boolean(data.address?.trim()) && Boolean(data.pincode?.trim());
        setProfileStatus(hasSaved ? "filled" : "missing");
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
    toast.success("Signed in. Your saved address is filled in.");
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
      toast.success("Account created. Let's add your pickup address.");
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
      const previewUrl = await imageToDataUrl(file);
      const nextPhoto: PickupPhoto = {
        id: crypto.randomUUID(),
        previewUrl,
        file,
        uploadedUrl: null,
      };
      setPhoto(nextPhoto);
      if (!s3UploadsEnabled) return;
      beginPhotoUpload(nextPhoto, true).catch(() => {
        // The booking submit path retries and blocks if the early upload fails.
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't process the photo.");
    }
  };

  const pincodeOk = pincode.length === 6 && isPincodeAvailable(pincode, availability);
  const pincodeBad = pincode.length === 6 && !pincodeOk;
  const addressOk = address.trim().length >= 10;
  const addressTooShort = address.trim().length > 0 && !addressOk;
  const addressStepReady = pincodeOk && addressOk;

  const goNext = () => {
    if (step === 1) {
      if (!vehicleType) return toast.error("Tell us what vehicle you're selling.");
    }
    if (step === 2) {
      if (vehicleDetails.length === 0)
        return toast.error("Pick the body style that matches your vehicle.");
    }
    if (step === 4) {
      if (!pincode.trim()) return toast.error("Add your pincode so we can check coverage.");
      if (pincode.length !== 6) return toast.error("Pincode must be 6 digits.");
      if (!pincodeOk) return toast.error("We don't pick up at this pincode yet.");
      if (!address.trim()) return toast.error("Add your flat / house address.");
      if (!addressOk)
        return toast.error("Address looks too short — add your flat, street and a landmark.");
    }
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(user ? 4 : 3);
    } else if (step === 4) {
      setStep(5);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setStep((s) => {
      if (s === 5) return 4;
      if (s === 4) return user ? 2 : 3;
      if (s === 3) return 2;
      if (s === 2) return 1;
      return 1;
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
    if (!pincodeOk || !addressOk) {
      setStep(4);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return toast.error("Please complete your pickup address and a serviceable pincode.");
    }
    if (!date) return toast.error("Pick a date.");
    if (!slot) return toast.error("Pick a time slot.");
    if (!name.trim() || phone.trim().length < 10)
      return toast.error("Add your name and a valid phone number.");


    setSaving(true);

    // Upload the (optional) compressed photo to S3 so we store a URL, not the
    // full base64 blob, in the database.
    let photoUrl: string | null = null;
    if (photo) {
      try {
        photoUrl = (photo.uploadedUrl ?? (await beginPhotoUpload(photo))) || null;
      } catch {
        // Photo storage is optional — never block the booking on it.
        photoUrl = null;
      }
    }

    const { error } = await supabase.from("leads").insert({
      vehicle_type: vehicleType || "car",
      items: vehicleDetails,
      has_photo: !!photoUrl,
      photo_url: photoUrl,
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
                  <h2 className="text-xl font-bold">What are you selling?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Pick your vehicle type — then choose the body style that matches it.
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {vehicleCategories.map((category) => {
                      const Icon = category.icon;
                      const active = vehicleType === category.id;
                      return (
                        <button
                          type="button"
                          key={category.id}
                          onClick={() => {
                            setVehicleType(category.id);
                            setVehicleDetails([]);
                          }}
                          className={cn(
                            "rounded-2xl border-2 p-5 text-left transition-all",
                            active
                              ? "border-primary bg-accent shadow-soft"
                              : "border-border hover:border-primary/40",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <Icon className="size-7 text-primary" />
                            {category.badge && (
                              <span className="rounded-full bg-gradient-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                                {category.badge}
                              </span>
                            )}
                          </div>
                          <div className="mt-3 font-bold">{category.name}</div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {category.tagline}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <motion.div
                  key="s2-vehicle-details"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold">Tell us about your vehicle</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Choose the body style that matches it, then add a photo if you like.
                  </p>
                  <AnimatePresence>
                    {selectedVehicleCategory && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-5 flex flex-wrap gap-2">
                          {selectedVehicleCategory.subcategories.map((sub) => {
                            const active = vehicleDetails.includes(sub);
                            const Icon = selectedVehicleCategory.icon;
                            return (
                              <button
                                type="button"
                                key={sub}
                                onClick={() => toggleItem(sub)}
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition-all",
                                  active
                                    ? "border-primary bg-gradient-brand text-primary-foreground shadow-green"
                                    : "border-border bg-background hover:border-primary/40",
                                )}
                              >
                                <Icon className="size-4" />
                                {sub}
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
                          src={photo.previewUrl}
                          alt="Your vehicle"
                          className="size-28 rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setPhoto(null);
                            if (fileRef.current) fileRef.current.value = "";
                          }}
                          className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-foreground text-background"
                          aria-label="Remove photo"
                        >
                          <X className="size-3.5" />
                        </button>
                        <div className="mt-2 text-xs font-medium text-muted-foreground">
                          {photo.uploadedUrl
                            ? "Photo saved securely."
                            : photoUploading
                              ? "Saving photo securely…"
                              : "Photo will be saved before booking."}
                        </div>
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

              {/* STEP 4 */}
              {step === 4 && (
                <motion.div
                  key="s4-address"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold">Where in Bengaluru?</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    We'll check that we cover your area.
                  </p>

                  {user && profileStatus === "loading" && (
                    <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm text-muted-foreground">
                      <Loader2 className="size-4 animate-spin" /> Loading your saved address…
                    </div>
                  )}
                  {user && profileStatus === "filled" && addressStepReady && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2.5 text-sm font-medium text-primary">
                      <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                      <span>Auto-filled from your account. Edit anything that changed.</span>
                    </div>
                  )}
                  {user && profileStatus === "missing" && !addressStepReady && (
                    <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm font-medium text-destructive">
                      <Info className="mt-0.5 size-4 shrink-0" />
                      <span>
                        No saved address on your account yet — add it below and we'll remember it
                        for your next pickup.
                      </span>
                    </div>
                  )}

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
                        aria-invalid={pincodeBad}
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
                      {pincode.length > 0 && pincode.length < 6 && (
                        <p className="text-sm text-muted-foreground">
                          {6 - pincode.length} more digit{6 - pincode.length > 1 ? "s" : ""} to go.
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
                        aria-invalid={addressTooShort}
                      />
                      {addressTooShort && (
                        <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
                          <Info className="size-4" /> Add a bit more detail — flat/house number,
                          street and a landmark.
                        </p>
                      )}
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

              {/* STEP 5 */}
              {step === 5 && (
                <motion.form
                  key="s5-schedule"
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

            {/* nav buttons (vehicle + address steps) */}
            {step !== 3 && step !== 5 && (
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
            {(step === 3 || step === 5) && (
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
