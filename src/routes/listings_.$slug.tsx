import { useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { useScrapCategories } from "@/lib/scrap-categories";
import {
  conditionLabel,
  formatListingPrice,
  useListing,
} from "@/lib/scrap-listings";
import { businessContact } from "@/lib/seo";

export const Route = createFileRoute("/listings_/$slug")({
  head: () => ({
    meta: [
      { title: "Scrap Listing | HuluMart" },
      { name: "description", content: "View this scrap listing and book a free doorstep pickup in Bengaluru." },
    ],
  }),
  component: ListingDetailPage,
});

function ListingDetailPage() {
  const { slug } = useParams({ from: "/listings_/$slug" });
  const { data: listing, isLoading, isError } = useListing(slug);
  const { data: categories = [] } = useScrapCategories();
  const [activeImage, setActiveImage] = useState(0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-3xl bg-secondary" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 animate-pulse rounded bg-secondary" />
            <div className="h-5 w-1/2 animate-pulse rounded bg-secondary" />
            <div className="h-24 animate-pulse rounded bg-secondary" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
        <Package className="mx-auto size-12 text-muted-foreground" />
        <h1 className="mt-5 text-2xl font-bold">Listing not found</h1>
        <p className="mt-2 text-muted-foreground">
          This listing may have been sold or removed. Browse what's available now.
        </p>
        <Button asChild variant="hero" className="mt-6">
          <Link to="/listings">
            <ArrowLeft className="size-4" /> Back to listings
          </Link>
        </Button>
      </div>
    );
  }

  const categoryName = categories.find((c) => c.id === listing.category_id)?.name ?? "Scrap";
  const images = listing.images.length ? listing.images : [];
  const numericPrice = listing.price && /^\d/.test(listing.price.trim());
  const whatsappHref = `https://wa.me/91${businessContact.phone}?text=${encodeURIComponent(
    `Hi HuluMart, I'm interested in the listing "${listing.title}".`,
  )}`;

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12 lg:px-8">
        <Link
          to="/listings"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="size-4" /> All listings
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Gallery */}
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-border bg-secondary shadow-soft">
                {images[activeImage] ? (
                  <img
                    src={images[activeImage]}
                    alt={listing.title}
                    className="size-full object-cover"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Package className="size-12" />
                    <span className="text-sm">No photo provided</span>
                  </div>
                )}
                {listing.featured && (
                  <span className="absolute left-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground shadow">
                    Featured
                  </span>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 grid grid-cols-5 gap-2.5">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                        i === activeImage ? "border-primary" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={src} alt={`View ${i + 1}`} className="size-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Reveal>

          {/* Details */}
          <Reveal delay={0.05}>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                  <Tag className="size-3.5" /> {categoryName}
                  {listing.subcategory ? ` · ${listing.subcategory}` : ""}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold">
                  <BadgeCheck className="size-3.5 text-primary" /> {conditionLabel(listing.condition)}
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{listing.title}</h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {listing.location && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-4 text-primary" /> {listing.location}
                  </span>
                )}
                {listing.quantity && (
                  <span className="flex items-center gap-1.5">
                    <Package className="size-4 text-primary" /> {listing.quantity}
                  </span>
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-primary/20 bg-accent/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary/80">Indicative rate</p>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-primary">
                    {formatListingPrice(listing.price)}
                  </span>
                  {numericPrice && <span className="text-sm font-medium text-muted-foreground">{listing.unit}</span>}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Final price confirmed after certified weighing at your doorstep.
                </p>
              </div>

              {listing.description && (
                <div className="mt-6">
                  <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Description</h2>
                  <p className="mt-2 whitespace-pre-line leading-relaxed text-foreground/90">
                    {listing.description}
                  </p>
                </div>
              )}

              {/* CTAs */}
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button asChild variant="hero" size="lg" className="flex-1">
                  <Link to="/pickup">
                    Book a free pickup
                    <ArrowRight />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" /> Enquire on WhatsApp
                  </a>
                </Button>
              </div>
              <Button asChild variant="ghost" size="sm" className="mt-2">
                <a href={businessContact.phoneHref}>
                  <Phone className="size-4" /> Call {businessContact.phone}
                </a>
              </Button>

              {/* Trust strip */}
              <div className="mt-7 grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3">
                {[
                  { icon: ShieldCheck, label: "Certified weighing" },
                  { icon: Truck, label: "Doorstep pickup" },
                  { icon: CalendarClock, label: "Instant payment" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 text-sm">
                    <item.icon className="size-4 shrink-0 text-primary" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* How pickup works */}
        <section className="mt-16 rounded-3xl bg-secondary/50 p-6 sm:p-10">
          <h2 className="text-center text-2xl font-bold">How a pickup works</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { step: "01", title: "Book online", text: "Pick a slot and share your Bengaluru address — takes under a minute." },
              { step: "02", title: "We collect", text: "A verified agent weighs your scrap on a certified scale at your door." },
              { step: "03", title: "Get paid", text: "Approve the quote and receive instant payment on the spot." },
            ].map((s) => (
              <div key={s.step} className="rounded-2xl border border-border bg-card p-5">
                <div className="text-sm font-extrabold text-primary">{s.step}</div>
                <h3 className="mt-2 text-lg font-bold">{s.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {["No hidden charges", "Same-day slots", "Responsible recycling"].map((item) => (
              <span key={item} className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" /> {item}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
