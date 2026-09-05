import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ShieldCheck, Wallet, FileCheck2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import {
  absoluteUrl,
  breadcrumbSchema,
  businessContact,
  faqSchema,
  featuredServiceAreas,
  serviceAreas,
  serviceSchema,
} from "@/lib/seo";
import heroImg from "@/assets/hero-vehicles.webp";
import carImg from "@/assets/vehicle-car.webp";
import suvImg from "@/assets/vehicle-suv.webp";
import electricImg from "@/assets/vehicle-electric.webp";
import commercialImg from "@/assets/vehicle-commercial.webp";

const vehicles = [
  { title: "Sell your car", image: carImg },
  { title: "Sell an SUV", image: suvImg },
  { title: "Electric vehicle", image: electricImg },
  { title: "Commercial vehicle", image: commercialImg },
];

const priceBands = [
  { name: "Hatchbacks", examples: "Swift, Alto, i10, Baleno, Tiago", band: "₹1.2L – ₹6.5L" },
  { name: "Sedans", examples: "Dzire, Honda City, Verna, Ciaz", band: "₹2.5L – ₹11L" },
  { name: "Compact SUVs", examples: "Creta, Venue, Brezza, Sonet", band: "₹4.5L – ₹16L" },
  { name: "7-seaters & MUVs", examples: "Ertiga, Innova, XL6, Carens", band: "₹5L – ₹22L" },
  { name: "Luxury cars", examples: "3 Series, C-Class, Q3, XC40", band: "₹9L – ₹45L" },
  { name: "Electric cars", examples: "Nexon EV, Tigor EV, MG ZS EV", band: "₹5L – ₹18L" },
];

const steps = [
  {
    icon: ShieldCheck,
    title: "Share your car details",
    text: "Brand, model year, kilometres driven and your Bangalore locality — takes under a minute, no phone calls.",
  },
  {
    icon: FileCheck2,
    title: "Free 140-point doorstep inspection",
    text: "Our evaluator visits your home or office, checks the engine, body, tyres, RC, insurance and service history.",
  },
  {
    icon: Wallet,
    title: "Same-day payment & free RC transfer",
    text: "Accept the offer and the money is transferred before pickup. We complete the RC transfer, NOC and RTO paperwork free.",
  },
];

const pricingFactors = [
  "Model year and generation — a facelift variant fetches noticeably more",
  "Kilometres driven; under 10,000 km a year keeps resale strong",
  "Service history from an authorised or trusted workshop",
  "Accident, flood and insurance-claim record",
  "Number of previous owners and RC status (KA registration sells fastest)",
  "Tyres, battery, clutch and AC condition on inspection day",
  "Fuel type — petrol and CNG hatchbacks move quickest in Bangalore traffic",
  "Valid insurance, PUC and pending challans or loan hypothecation",
];

const faqs = [
  {
    question: "How do I sell my used car in Bangalore with ZAPIBOO?",
    answer:
      "Share your car's brand, model, year and kilometres, pick a doorstep inspection slot, and get a market-linked offer. Accept it and we pay the same day and handle the RC transfer free of cost.",
  },
  {
    question: "Do you charge anything to buy my car?",
    answer:
      "No. Valuation, the 140-point doorstep inspection, RC transfer, NOC and pickup are all free. The amount you accept is the amount credited to your bank account.",
  },
  {
    question: "How fast will I get paid after selling my car?",
    answer:
      "Payment is initiated the moment you accept the offer — usually the same day, before the vehicle leaves your address.",
  },
  {
    question: "Can I sell a car that still has a loan on it?",
    answer:
      "Yes. We help with loan closure and hypothecation removal. The outstanding amount is settled with your bank and the balance is paid to you.",
  },
  {
    question: "Which areas of Bangalore do you cover?",
    answer:
      "40+ localities including Whitefield, HSR Layout, Koramangala, Indiranagar, Hebbal, JP Nagar, Electronic City, Yelahanka, Marathahalli and HBR Layout.",
  },
  {
    question: "What documents do I need to sell my car?",
    answer:
      "Original RC, valid insurance, PUC certificate, both keys, your PAN and Aadhaar, and Form 35 with the bank NOC if the car was financed.",
  },
];

const title = "Sell Used Car in Bangalore — Best Price, Free Doorstep Inspection | ZAPIBOO";
const description =
  "Sell your used car in Bangalore at the best price. Free doorstep inspection, instant same-day payment, free RC transfer and NOC. Cars, SUVs, EVs and commercial vehicles.";

export const Route = createFileRoute("/sell-used-car")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/sell-used-car") },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/sell-used-car") }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          serviceSchema("/sell-used-car"),
          faqSchema(faqs),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Sell Used Car", path: "/sell-used-car" },
          ]),
        ]),
      },
    ],
  }),
  component: SellUsedCar,
});

function SellUsedCar() {
  const areas = serviceAreas.filter((a) => featuredServiceAreas.includes(a.slug));
  const whatsappHref = `https://wa.me/91${businessContact.phone}?text=${encodeURIComponent("Hi ZAPIBOO, I want a free valuation for my used car in Bangalore.")}`;

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Used cars ready for resale in Bangalore"
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-navy/60" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-20 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-navy-foreground/80">
                <ShieldCheck className="size-3.5" />
                Free doorstep inspection in 40+ areas
              </span>
              <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">
                Sell your used <span className="text-primary">car</span> in{" "}
                <span className="text-primary">Bangalore</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-navy-foreground/80 sm:text-lg">
                Get a fair, market-linked price for your car in minutes — free 140-point doorstep
                inspection, same-day bank transfer and free RC transfer with zero paperwork trips.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button asChild variant="hero" size="xl" className="w-full sm:w-auto">
                  <Link to="/pickup">
                    Get free valuation
                    <ArrowRight />
                  </Link>
                </Button>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#00C875] px-5 py-4 text-base font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#00b36a] sm:w-auto"
                >
                  <WhatsAppIcon className="size-5" />
                  Sell on WhatsApp
                </a>
              </div>
              <p className="mt-6 flex items-center gap-2 text-[11px] text-navy-foreground/70 sm:text-sm">
                <CheckCircle2 className="size-4 shrink-0 text-primary" />
                Transparent offer · Doorstep inspection · Payment before pickup
              </p>
            </div>

            <div className="rounded-3xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-sm sm:p-8">
              <h2 className="text-lg font-bold">Used car price bands in Bangalore</h2>
              <p className="mt-1 text-sm text-navy-foreground/70">
                Indicative resale ranges. Your final offer depends on year, kilometres and condition.
              </p>
              <div className="mt-6 space-y-3">
                {priceBands.slice(0, 4).map((band) => (
                  <div
                    key={band.name}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-navy/40 px-4 py-3"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">{band.name}</div>
                      <div className="truncate text-xs text-navy-foreground/60">{band.examples}</div>
                    </div>
                    <span className="whitespace-nowrap text-sm font-extrabold text-primary">
                      {band.band}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">Start with your vehicle</h2>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Choose a category and the valuation flow opens with your vehicle type already selected.
            </p>
          </Reveal>
          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {vehicles.map((vehicle) => (
              <Link
                key={vehicle.title}
                to="/pickup"
                className="group flex min-h-40 flex-col justify-end rounded-[1.75rem] border border-primary/20 bg-primary/5 p-3 shadow-soft transition-all hover:-translate-y-1 sm:min-h-52 sm:p-5"
              >
                <img
                  src={vehicle.image}
                  alt=""
                  loading="lazy"
                  className="mx-auto h-24 w-full object-contain transition-transform group-hover:scale-105 sm:h-32"
                />
                <span className="mt-3 text-center text-sm font-bold sm:mt-4 sm:text-lg">
                  {vehicle.title}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              How selling works
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Sell your car in three steps, without visiting a showroom
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="h-full rounded-2xl border border-border bg-card p-8 shadow-soft">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-green">
                    <step.icon className="size-7" />
                  </div>
                  <div className="mt-6 text-sm font-semibold text-primary">Step {i + 1}</div>
                  <h3 className="mt-1 text-xl font-bold">{step.title}</h3>
                  <p className="mt-3 text-muted-foreground">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild variant="hero" size="lg">
              <Link to="/pickup">
                Book my free inspection
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">
              What decides your used car's resale value
            </h2>
            <p className="mt-4 text-muted-foreground">
              We benchmark every offer against live Bangalore demand for your exact make, model and
              variant — then adjust for what the inspection finds. Nothing is hidden from you.
            </p>
            <ul className="mt-8 space-y-4">
              {pricingFactors.map((factor) => (
                <li key={factor} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                  <span className="text-foreground">{factor}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <h3 className="text-xl font-bold">Bangalore used car price guide</h3>
              <div className="mt-6 divide-y divide-border">
                {priceBands.map((band) => (
                  <div key={band.name} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0">
                      <div className="font-semibold">{band.name}</div>
                      <div className="truncate text-sm text-muted-foreground">{band.examples}</div>
                    </div>
                    <span className="whitespace-nowrap font-extrabold text-gradient">
                      {band.band}
                    </span>
                  </div>
                ))}
              </div>
              <Button asChild variant="outline" size="lg" className="mt-6 w-full">
                <Link to="/materials">
                  View full price guide
                  <ArrowRight />
                </Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-accent/25 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-primary">
              Doorstep coverage
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Sell your car anywhere in <span className="text-primary">Bangalore</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Free inspection and pickup at homes, apartments and offices across the city.
            </p>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {areas.map((area) => (
              <Link
                key={area.slug}
                to="/pickup"
                className="group flex min-h-20 items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 text-left font-medium shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary"
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="size-4" />
                </span>
                <span className="min-w-0 break-words text-sm leading-tight sm:text-base">
                  {area.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Selling a used car in Bangalore: FAQs
            </h2>
          </Reveal>
          <div className="mt-10 space-y-4">
            {faqs.map((faq, i) => (
              <Reveal key={faq.question} delay={i * 0.05}>
                <details className="group rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <summary className="cursor-pointer list-none font-bold">{faq.question}</summary>
                  <p className="mt-3 text-muted-foreground">{faq.answer}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-navy py-16 text-navy-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to sell your car at the best price?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-navy-foreground/75">
            Book a free doorstep inspection today and get paid the same day, with RC transfer handled
            for you.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="xl">
              <Link to="/pickup">
                Get free valuation
                <ArrowRight />
              </Link>
            </Button>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#00C875] px-6 py-4 text-base font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[#00b36a]"
            >
              <WhatsAppIcon className="size-5" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
