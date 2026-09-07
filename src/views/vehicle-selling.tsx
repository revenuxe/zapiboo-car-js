import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, ChevronDown, MapPin, Phone } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { CarValuationForm } from "@/components/CarValuationForm";
import { WhatsAppIcon } from "@/components/WhatsAppIcon";
import { absoluteUrl, breadcrumbSchema, businessContact, faqSchema, siteUrl } from "@/lib/seo";
import { pageMetadata } from "@/lib/metadata";
import { vehicleSellingContent } from "@/lib/vehicle-selling-content";
import { vehicleSellingLinks, type SellingVehicle } from "@/lib/vehicle-selling-links";
import car from "@/assets/vehicle-car.webp";
import bike from "@/assets/vehicle-bike.webp";
import scooter from "@/assets/vehicle-scooter.webp";
import suv from "@/assets/vehicle-suv.webp";
import commercial from "@/assets/vehicle-commercial.webp";

const images = { car, bike, scooter, suv, commercial };
const container = "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8";
const copy = "text-base leading-relaxed text-muted-foreground";
const button =
  "inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-6 py-3 text-center text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary";

function routeFor(vehicle: SellingVehicle) {
  return vehicleSellingLinks.find((link) => link.key === vehicle)!;
}

export function sellingMetadata(vehicle: SellingVehicle) {
  const content = vehicleSellingContent[vehicle];
  const metadata = pageMetadata(routeFor(vehicle).path, content.title, content.description);
  const image = {
    url: absoluteUrl(images[vehicle].src),
    width: images[vehicle].width,
    height: images[vehicle].height,
    alt: content.imageAlt,
  };
  return {
    ...metadata,
    openGraph: { ...metadata.openGraph, images: [image] },
    twitter: { ...metadata.twitter, images: [image.url] },
  };
}

export default function VehicleSelling({ vehicle }: { vehicle: SellingVehicle }) {
  const content = vehicleSellingContent[vehicle];
  const route = routeFor(vehicle);
  const bookingHref = `/pickup?vehicle=${content.booking}`;
  const whatsappHref = `https://wa.me/${businessContact.phone.replace(/\D/g, "")}?text=${encodeURIComponent(`Hi Zapiboo, I would like to ${route.label.toLowerCase()}. Please help me arrange an inspection.`)}`;
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: route.label, path: route.path },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${absoluteUrl(route.path)}#service`,
            name: content.heading,
            description: content.description,
            url: absoluteUrl(route.path),
            serviceType: `${vehicle === "commercial" ? "Commercial vehicle" : vehicle === "suv" ? "SUV" : `Used ${vehicle}`} inspection and selling assistance`,
            areaServed: { "@type": "City", name: "Bangalore" },
            provider: { "@id": `${siteUrl}/#organization` },
          },
          faqSchema(content.faqs),
        ]}
      />
      <section className="relative overflow-hidden bg-[#121112] py-10 text-white sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_30%,rgba(31,89,104,0.4),transparent_65%)]"
        />
        <div className={`relative ${container}`}>
          <nav aria-label="Breadcrumb" className="mb-8 text-sm text-white/70">
            <ol className="flex flex-wrap gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page">{route.label}</li>
            </ol>
          </nav>
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#ff9292]">
                {content.kicker}
              </p>
              <h1 className="mt-4 text-balance text-4xl font-extrabold leading-[1.12] tracking-tight sm:text-5xl xl:text-6xl">
                {content.heading}
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
                {content.intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link href={bookingHref} className={button}>
                  {content.cta}
                  <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-bold hover:bg-white/10"
                >
                  <WhatsAppIcon className="size-5 text-[#00C875]" />
                  Discuss on WhatsApp
                </a>
              </div>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/65">
                {content.bookingHint}
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-8">
              <Image
                src={images[vehicle]}
                alt={content.imageAlt}
                priority
                sizes="(min-width: 1024px) 550px, (min-width: 640px) 600px, 90vw"
                className="aspect-[4/3] w-full object-contain"
              />
              <div className="flex items-center justify-center gap-2 border-t border-white/15 pt-5 text-sm font-semibold">
                <MapPin aria-hidden="true" className="size-4 text-[#ff9292]" />
                Doorstep inspection in Bangalore
              </div>
            </div>
          </div>
        </div>
      </section>
      <nav aria-label="On this page" className="border-b border-border bg-secondary/40">
        <div className={`${container} flex flex-wrap gap-x-6 gap-y-3 py-5 text-sm font-semibold`}>
          <a href="#valuation" className="hover:text-primary">
            Valuation factors
          </a>
          <a href="#prepare" className="hover:text-primary">
            Inspection checklist
          </a>
          <a href="#selling-process" className="hover:text-primary">
            Selling process
          </a>
          <a href="#faqs" className="hover:text-primary">
            Questions & answers
          </a>
        </div>
      </nav>
      {vehicle === "car" && (
        <section
          id="car-valuation"
          aria-label="Car inspection request"
          className={`${container} scroll-mt-24 pt-10`}
        >
          <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-5 shadow-lg sm:p-8">
            <CarValuationForm />
          </div>
        </section>
      )}
      <section className={`${container} py-14 sm:py-20`}>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
          <h2 className="text-balance text-3xl font-bold tracking-tight">
            {content.overview.title}
          </h2>
          <p className={copy}>{content.overview.text}</p>
        </div>
        <div id="valuation" className="scroll-mt-24 pt-14">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Understand the offer
          </p>
          <h2 className="mt-3 max-w-3xl text-balance text-3xl font-bold">{content.factorsTitle}</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {content.factors.map((factor, index) => (
              <article
                key={factor.title}
                className="rounded-2xl border border-border bg-card p-6 sm:p-8"
              >
                <span aria-hidden="true" className="text-sm font-extrabold text-primary">
                  0{index + 1}
                </span>
                <h3 className="mt-3 text-xl font-bold">{factor.title}</h3>
                <p className={`mt-3 ${copy}`}>{factor.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="prepare"
        className="scroll-mt-24 border-y border-border bg-secondary/40 py-14 sm:py-20"
      >
        <div className={`${container} grid gap-10 lg:grid-cols-2`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Before the visit
            </p>
            <h2 className="mt-3 text-balance text-3xl font-bold">{content.preparationTitle}</h2>
            <ul className="mt-7 space-y-4">
              {content.preparation.map((item) => (
                <li key={item} className={`flex gap-3 ${copy}`}>
                  <Check aria-hidden="true" className="mt-1 size-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="self-start rounded-2xl border border-border bg-card p-6 sm:p-8">
            <h3 className="text-2xl font-bold">{content.documents.title}</h3>
            <p className={`mt-4 ${copy}`}>{content.documents.text}</p>
            <a
              href={businessContact.phoneHref}
              className="mt-6 inline-flex min-h-12 items-center gap-2 font-bold text-primary"
            >
              <Phone aria-hidden="true" className="size-4" />
              Talk through your documents
            </a>
          </div>
        </div>
      </section>
      <section id="selling-process" className={`${container} scroll-mt-24 py-14 sm:py-20`}>
        <h2 className="text-3xl font-bold">From first enquiry to an informed decision</h2>
        <ol className="mt-8 grid gap-7 md:grid-cols-3">
          {content.steps.map((step, index) => (
            <li key={step.title}>
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
              <p className={`mt-3 ${copy}`}>{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-12 rounded-2xl border border-border bg-secondary/30 p-6 sm:p-8">
          <h2 className="max-w-3xl text-balance text-2xl font-bold">{content.local.title}</h2>
          <p className={`mt-4 max-w-4xl ${copy}`}>{content.local.text}</p>
          <Link href={bookingHref} className={`mt-6 ${button}`}>
            Check inspection availability
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>
      <section
        id="faqs"
        className="scroll-mt-24 border-y border-border bg-secondary/40 py-14 sm:py-20"
      >
        <div className={container}>
          <h2 className="text-3xl font-bold">Questions before you sell</h2>
          <div className="mt-8 grid items-start gap-4 lg:grid-cols-2">
            {content.faqs.map(({ question, answer }) => (
              <details key={question} className="group rounded-xl border border-border bg-card">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-bold [&::-webkit-details-marker]:hidden">
                  {question}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-5 shrink-0 transition-transform group-open:rotate-180"
                  />
                </summary>
                <p className={`px-5 pb-5 ${copy}`}>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className={`${container} py-14 sm:py-20`}>
        <div className="rounded-3xl bg-[#121112] px-6 py-10 text-center text-white sm:p-12">
          <h2 className="text-balance text-3xl font-bold">
            Ready to discuss your{" "}
            {vehicle === "commercial" ? "commercial vehicle" : vehicle === "suv" ? "SUV" : vehicle}?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-white/75">
            Arrange a free inspection, understand the offer and decide whether to proceed. Confirm
            the available appointment for your location.
          </p>
          <Link href={bookingHref} className={`mt-7 ${button}`}>
            {content.cta}
            <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
          </Link>
        </div>
        <nav aria-label="Other vehicle selling guides" className="mt-10">
          <h2 className="text-lg font-bold">Selling another kind of vehicle?</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {vehicleSellingLinks
              .filter((link) => link.key !== vehicle)
              .map((link) => (
                <li key={link.key}>
                  <Link
                    href={link.path}
                    className="flex h-full min-h-12 items-center justify-between gap-3 rounded-xl border border-border p-4 text-sm font-semibold hover:border-primary hover:text-primary"
                  >
                    {link.label}
                    <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      </section>
    </>
  );
}
