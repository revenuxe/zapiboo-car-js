import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  Gauge,
  MapPin,
  Phone,
  Recycle,
  Scale,
  SearchCheck,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { isPincodeAvailable, useServiceAvailability } from "@/lib/service-availability";
import {
  absoluteUrl,
  breadcrumbSchema,
  businessContact,
  organizationSchema,
  serviceAreas,
  serviceSchema,
} from "@/lib/seo";
import heroImg from "@/assets/hero-scrap.webp";

const pageTitle = "Scrap Cars Buyers in Bangalore | Sell Old Car Scrap | ZAPIBOO";
const pageDescription =
  "Sell scrap cars in Bangalore with ZAPIBOO. Get help with old car scrap price, vehicle scrap valuation, negotiation, towing, documents, transparent weighing and responsible recycling.";

const bookingSearch = { mode: "specific" as const, item: "Car Scrap" };

const priceFactors = [
  "Vehicle make, model, year and current condition",
  "Body shell weight, engine, gearbox, tyres and reusable parts",
  "Ferrous and non-ferrous metal recovery value",
  "RC/document status and whether dismantling or towing is needed",
  "Current Bangalore scrap car buyer demand and transport distance",
];

const services = [
  {
    icon: SearchCheck,
    title: "Scrap car valuation",
    text: "Share your car details, photos and location. ZAPIBOO helps estimate fair scrap car value before you commit.",
  },
  {
    icon: BadgeCheck,
    title: "Best rate support",
    text: "We help compare buyer interest and negotiate transparently for old car scrap, accident car scrap and dead vehicles.",
  },
  {
    icon: Truck,
    title: "Towing and transport",
    text: "For non-running cars, we help coordinate pickup, loading and movement to the buyer or dismantling yard.",
  },
  {
    icon: FileCheck2,
    title: "Document guidance",
    text: "We guide you on basic ownership details, RC status and proof needed for a clean vehicle scrap sale.",
  },
  {
    icon: Scale,
    title: "Transparent weighing",
    text: "Metal value, parts value and deductions are explained clearly so the settlement does not feel random.",
  },
  {
    icon: Recycle,
    title: "Responsible recycling",
    text: "Recovered car metal, usable parts and recyclable materials are routed through practical recycling channels.",
  },
];

const carTypes = [
  "Old petrol and diesel cars",
  "Accident damaged cars",
  "Non-running cars",
  "Flood damaged vehicles",
  "Body shell and chassis scrap",
  "Engine and gearbox scrap",
  "Commercial car scrap",
  "Car parts and mixed automobile scrap",
];

const steps = [
  {
    step: "01",
    title: "Share car details",
    text: "Send model, year, condition, photos, location and document status so we can understand the scrap value.",
  },
  {
    step: "02",
    title: "Get buyer guidance",
    text: "ZAPIBOO helps with price discussion, negotiation and clarity on towing or dismantling requirements.",
  },
  {
    step: "03",
    title: "Pickup and settlement",
    text: "Once you approve the quote, transport is coordinated and payment is completed with transparent confirmation.",
  },
];

const faq = [
  {
    q: "How do I sell my scrap car in Bangalore?",
    a: "Book a car scrap request with ZAPIBOO, share vehicle photos and location, then our team helps with valuation, buyer coordination, transport and transparent settlement.",
  },
  {
    q: "Do you buy accident or non-running cars?",
    a: "Yes. ZAPIBOO can help with accident cars, dead cars, old cars, body shells, engine scrap and mixed automobile scrap depending on condition and documents.",
  },
  {
    q: "Is towing available for car scrap?",
    a: "For eligible locations, ZAPIBOO helps coordinate towing or transport so the vehicle can be moved safely to the buyer or dismantling yard.",
  },
  {
    q: "How is scrap car price calculated?",
    a: "The price depends on vehicle weight, usable parts, engine and gearbox condition, metal recovery value, documents, market rates and transport cost.",
  },
];

export const Route = createFileRoute("/scrap-cars")({
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: "description", content: pageDescription },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: pageDescription },
      { property: "og:url", content: absoluteUrl("/scrap-cars") },
      { property: "og:image", content: heroImg },
      { name: "twitter:title", content: pageTitle },
      { name: "twitter:description", content: pageDescription },
    ],
    links: [{ rel: "canonical", href: "/scrap-cars" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          organizationSchema("/scrap-cars"),
          serviceSchema("/scrap-cars"),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Scrap Cars", path: "/scrap-cars" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: { "@type": "Answer", text: item.a },
            })),
          },
        ]),
      },
    ],
  }),
  component: ScrapCarsPage,
});

function ScrapCarsPage() {
  const { data: availability } = useServiceAvailability();
  const [pincode, setPincode] = useState("");
  const [checked, setChecked] = useState(false);
  const cleanPincode = pincode.replace(/\D/g, "").slice(0, 6);
  const pincodeReady = cleanPincode.length === 6;
  const available = pincodeReady && isPincodeAvailable(cleanPincode, availability);
  const unavailable =
    checked && pincodeReady && availability && !isPincodeAvailable(cleanPincode, availability);
  const incomplete = checked && !pincodeReady;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Scrap car buyers and vehicle scrap recycling in Bangalore"
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-navy/55" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-28 lg:px-8">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-brand-green backdrop-blur"
            >
              <Car className="size-4" /> Scrap car buyers in Bangalore
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl md:text-6xl"
            >
              Sell your <span className="text-gradient">scrap car</span> for a better rate
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg"
            >
              ZAPIBOO helps Bangalore sellers with old car scrap valuation, buyer negotiation,
              towing coordination, document guidance, transparent weighing and responsible vehicle
              recycling.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="mt-7 max-w-2xl"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero" size="xl">
                  <Link to="/pickup" search={bookingSearch}>
                    Book car scrap pickup
                    <ArrowRight />
                  </Link>
                </Button>
                <form
                  className="flex min-w-0 flex-1 rounded-2xl border border-white/20 bg-white/10 p-1.5 shadow-elevated backdrop-blur"
                  onSubmit={(event) => {
                    event.preventDefault();
                    setChecked(true);
                  }}
                >
                  <label className="flex min-w-0 flex-1 items-center gap-2 px-3 text-navy-foreground">
                    <MapPin className="size-4 shrink-0 text-primary" />
                    <span className="sr-only">Check pincode availability for car scrap</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={cleanPincode}
                      maxLength={6}
                      onChange={(event) => {
                        setPincode(event.target.value);
                        setChecked(false);
                      }}
                      placeholder="Enter pincode"
                      className="h-11 min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-navy-foreground/55"
                    />
                  </label>
                  {checked && available ? (
                    <Button
                      asChild
                      variant="hero"
                      size="lg"
                      className="h-11 rounded-xl px-4 text-sm"
                    >
                      <Link
                        to="/pickup"
                        search={{ ...bookingSearch, pincode: cleanPincode }}
                      >
                        Book
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      variant="outlineLight"
                      size="lg"
                      className="h-11 rounded-xl px-4 text-sm"
                    >
                      Check
                    </Button>
                  )}
                </form>
              </div>
              <div className="mt-3 min-h-5 text-xs font-medium leading-relaxed sm:text-sm">
                {!checked && (
                  <span className="text-navy-foreground/70">
                    Check car scrap pickup support for your 6-digit Bangalore pincode.
                  </span>
                )}
                {incomplete && (
                  <span className="text-navy-foreground/75">
                    Enter a valid 6-digit Bangalore pincode.
                  </span>
                )}
                {checked && available && (
                  <span className="text-primary">
                    Car scrap support is available in {cleanPincode}. You can book now.
                  </span>
                )}
                {unavailable && (
                  <span className="text-navy-foreground/75">
                    Not available in {cleanPincode} yet. Call {businessContact.phone} for help.
                  </span>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:px-6 md:py-12 lg:grid-cols-4 lg:px-8">
          {[
            { value: "Quote", label: "Inspection-based pricing" },
            { value: "Towing", label: "Transport coordination" },
            { value: "Clear", label: "Rate and deduction clarity" },
            { value: "Bengaluru", label: "Local buyer network" },
          ].map((item) => (
            <Reveal key={item.label} className="text-center">
              <div className="text-2xl font-extrabold text-gradient md:text-4xl">{item.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Old car scrap value
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              What affects your scrap car price?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Scrap car price in Bangalore is not a flat number. ZAPIBOO helps you understand the
              vehicle scrap value by looking at body metal, reusable parts, running condition,
              documents and transport needs.
            </p>
            <Button asChild variant="hero" size="lg" className="mt-8">
              <Link to="/pickup" search={bookingSearch}>
                Get car scrap quote
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-3 sm:grid-cols-2">
              {priceFactors.map((factor) => (
                <div key={factor} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <CheckCircle2 className="size-5 text-primary" />
                  <p className="mt-3 text-sm font-medium leading-relaxed">{factor}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Vehicle scrap services
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Complete support for selling scrap cars in Bangalore
            </h2>
            <p className="mt-4 text-muted-foreground">
              From scrap car valuation to towing and settlement, ZAPIBOO keeps the process simple,
              transparent and practical for car owners, garages and businesses.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.title} delay={(index % 3) * 0.05}>
                <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
                    <service.icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {service.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              From old car to clean settlement
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((item) => (
              <Reveal key={item.step}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="text-sm font-extrabold text-primary">{item.step}</div>
                  <h3 className="mt-3 text-xl font-bold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-accent/25 py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <Reveal>
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                What car scrap do we help with?
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Old cars, accident cars, dead vehicles and parts
              </h2>
              <p className="text-muted-foreground">
                ZAPIBOO can help sellers looking for scrap car buyers near me, old car scrap
                buyers in Bangalore, junk car buyers, vehicle scrap dealers and car dismantling
                support.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-3 sm:grid-cols-2">
              {carTypes.map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <Wrench className="size-5 shrink-0 text-primary" />
                  <span className="text-sm font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <Reveal className="lg:col-span-1">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Documents and safety
            </p>
            <h2 className="mt-3 text-3xl font-bold">Clear, careful car scrap handling</h2>
            <p className="mt-4 text-muted-foreground">
              Vehicle scrap can involve ownership checks, transport, towing and dismantling. We
              keep those steps visible so sellers know what is happening.
            </p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-2">
            {[
              { icon: ClipboardCheck, title: "Ownership clarity", text: "Share basic vehicle and owner details before buyer coordination." },
              { icon: FileCheck2, title: "RC and proof guidance", text: "We guide you on the details a buyer may need for a clean sale." },
              { icon: ShieldCheck, title: "Careful movement", text: "Pickup or towing is planned based on the vehicle condition and access." },
              { icon: Gauge, title: "Part-wise value", text: "Engine, gearbox, tyres and body metal are discussed clearly where relevant." },
            ].map((item) => (
              <Reveal key={item.title}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <item.icon className="size-6 text-primary" />
                  <h3 className="mt-4 font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Bangalore coverage
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Scrap car buyer support across major areas
              </h2>
            </div>
            <Button asChild variant="outline" size="lg">
              <Link to="/areas">View all areas</Link>
            </Button>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {serviceAreas.slice(0, 12).map((area) => (
              <Link
                key={area.slug}
                to="/areas/$area"
                params={{ area: area.slug }}
                className="rounded-2xl border border-border bg-card p-4 text-sm font-semibold shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                {area.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Scrap car selling questions
            </h2>
          </Reveal>
          <div className="mt-10 space-y-4">
            {faq.map((item) => (
              <Reveal key={item.q}>
                <article className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <h3 className="font-bold">{item.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-navy py-16 text-navy-foreground md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <Phone className="mx-auto size-9 text-brand-green" />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Ready to sell your old car as scrap?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-navy-foreground/75">
              Book a car scrap request and ZAPIBOO will help with valuation, negotiation, towing
              support and transparent settlement.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link to="/pickup" search={bookingSearch}>
                  Book car scrap pickup
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outlineLight" size="lg">
                <a href={businessContact.phoneHref}>Call {businessContact.phone}</a>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
