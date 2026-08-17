import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MapPin, Phone, Recycle, Scale, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { householdRates } from "@/lib/bangalore-data";
import {
  absoluteUrl,
  breadcrumbSchema,
  businessContact,
  faqSchema,
  getAreaBySlug,
  organizationSchema,
  scrapPickupServiceSchema,
} from "@/lib/seo";
import heroImg from "@/assets/hero-scrap.webp";

const pickupSteps = (areaName: string) => [
  { title: "Tell us what you have", text: "Choose mixed household scrap or the materials you want to sell, then add an optional photo for a clearer pickup estimate." },
  { title: "Choose a convenient slot", text: `Enter your ${areaName} address and serviceable pincode, then select the date and time that works for you.` },
  { title: "Weigh, collect and pay", text: "The pickup is confirmed, items are checked and weighed at collection, and payment is completed after pickup." },
];

const areaFaq = (areaName: string, pincode: string) => [
  { question: `Do you offer doorstep scrap pickup in ${areaName}?`, answer: `Yes. HuluMart offers doorstep scrap pickup in ${areaName}, Bangalore, subject to slot availability for pincode ${pincode}.` },
  { question: `What scrap can I sell in ${areaName}?`, answer: "You can request collection for newspaper, books, cardboard, plastic, metal, e-waste and selected old appliances. For mixed material, choose mixed household scrap while booking." },
  { question: `How are scrap rates decided in ${areaName}?`, answer: "Rates depend on the material, grade and current market value. The booking flow shows the applicable material rates, and collection is weighed transparently at pickup." },
  { question: `When will my ${areaName} scrap pickup be confirmed?`, answer: "After you book a preferred date and slot, the HuluMart team confirms the pickup details on WhatsApp or phone." },
  { question: `Is there a minimum quantity for scrap pickup in ${areaName}?`, answer: "Availability can depend on the material and quantity. Share the items, approximate quantity and a photo while booking so the team can confirm the most suitable pickup option." },
  { question: `Can apartments and offices book scrap collection in ${areaName}?`, answer: "Yes. Residents, apartment associations, shops and small offices can book a pickup. For larger clear-outs, mention access details, floor, lift availability and the type of material in the booking notes." },
];

export const Route = createFileRoute("/areas_/$area")({
  loader: ({ params }) => {
    const area = getAreaBySlug(params.area);
    if (!area) throw notFound();
    return { area };
  },
  head: ({ params }) => {
    const area = getAreaBySlug(params.area);
    if (!area) return {};
    const title = `Best Scrap Buyers in ${area.name}, Bangalore | Doorstep Scrap Collection`;
    const description = `Sell scrap online in ${area.name}, Bangalore with HuluMart. Book doorstep scrap collection for paper, metal, plastic, e-waste and appliances with certified weighing and instant payment.`;
    const path = `/areas/${area.slug}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absoluteUrl(path) },
        { property: "og:image", content: heroImg },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify([
            organizationSchema(path),
            scrapPickupServiceSchema(path, area),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: `Scrap Buyers in ${area.name}`, path },
            ]),
            faqSchema(areaFaq(area.name, area.pincode)),
          ]),
        },
      ],
    };
  },
  component: AreaLandingPage,
});

function AreaLandingPage() {
  const { area } = Route.useLoaderData();

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt={`Scrap collection service for ${area.name}, Bangalore`}
            width={1920}
            height={1080}
            className="h-full w-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-navy/50" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-brand-green">
              Scrap pickup in {area.name}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] sm:text-6xl">
              Best Scrap Buyers in <span className="text-gradient">{area.name}</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/75 sm:text-lg">
              HuluMart offers doorstep scrap collection in {area.name}, Bangalore for paper,
              raddi, metal, plastic, e-waste and old appliances. Get transparent rates,
              certified weighing and instant payment.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="xl">
                <Link to="/pickup">
                  Book pickup in {area.name}
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outlineLight" size="xl">
                <a href={businessContact.phoneHref}>
                  <Phone className="size-4" /> Call {businessContact.phone}
                </a>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-navy-foreground/70">
              <span className="flex items-center gap-1.5">
                <Star className="size-4 fill-brand-green text-brand-green" /> 4.9/5 pickup rating
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-brand-green" /> Same-day slots available
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-brand-green" /> Pincode {area.pincode}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              What we buy
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Scrap collection for homes, shops and apartments in {area.name}
            </h2>
            <p className="mt-4 text-muted-foreground">
              Book one pickup for mixed household scrap or select specific materials. Our agent
              confirms the slot, arrives at your address, weighs everything in front of you, and
              completes payment after pickup.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {householdRates.slice(0, 6).map((rate) => (
                <div key={rate.name} className="rounded-xl border border-border bg-card p-4">
                  <h3 className="text-sm font-bold">{rate.name}</h3>
                  <p className="mt-2 text-lg font-extrabold text-primary">
                    {rate.price} <span className="text-xs font-medium text-muted-foreground">{rate.unit}</span>
                  </p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-xl font-bold">Why choose HuluMart in {area.name}?</h2>
              <ul className="mt-5 space-y-4">
                {[
                  "Free doorstep pickup for serviceable Bangalore pincodes",
                  "Certified digital weighing at your doorstep",
                  "Transparent rates before collection",
                  "Instant payment after pickup",
                  "Support for paper, plastic, metal, appliances and e-waste",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              {area.nearby.length > 0 && (
                <div className="mt-6 border-t border-border pt-5">
                  <p className="text-sm font-semibold">Nearby localities</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {area.nearby.map((nearby: string) => (
                      <span key={nearby} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">
                        {nearby}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">How pickup works</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Sell scrap in {area.name} without a trip to the kabadi shop</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              Whether you are clearing a flat, preparing for a move, managing apartment waste or
              sorting an office store room, HuluMart makes scrap collection in {area.name} simple.
              Book online, keep the material ready, and our team confirms the pickup before coming
              to your location.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {pickupSteps(area.name).map((step, index) => {
              const Icon = [Recycle, Truck, Scale][index];
              return (
                <Reveal key={step.title} delay={index * 0.08}>
                  <article className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="size-5" /></div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-wider text-primary">Step {index + 1}</p>
                    <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Scrap buyer services in {area.name}</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">One local pickup service for everyday recyclable material</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">If you are searching for a kabadiwala, scrap dealer, raddi buyer or e-waste pickup in {area.name}, start with the material you have. HuluMart helps you book a clear collection request and understand what information makes a pickup easier to confirm.</p>
          </Reveal>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Paper & raddi", "Newspapers, books, magazines and dry cardboard from homes, flats and shops."],
              ["Metal scrap", "Iron, steel, aluminium, copper, brass and old household metal items."],
              ["Plastic & packaging", "Sorted bottles, containers and packaging material from regular clear-outs."],
              ["E-waste & appliances", "Old electronics and selected appliances—describe the item and attach a photo when booking."],
            ].map(([title, text]) => <Reveal key={title}><article className="h-full rounded-2xl border border-border bg-card p-5 shadow-soft"><h3 className="text-lg font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p><Link to="/pickup" search={{ pincode: area.pincode }} className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">Book pickup <ArrowRight className="size-4" /></Link></article></Reveal>)}
          </div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_0.9fr] lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Local scrap guide</p>
            <h2 className="mt-3 text-3xl font-bold">What to keep ready for a {area.name} scrap pickup</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-muted-foreground">
              <p>Separate dry paper, cardboard, plastic and metal where practical. This makes weighing quicker and helps identify the right rate for each material.</p>
              <p>For old appliances or e-waste, mention the item while booking and add a photo if possible. It helps the team prepare for collection and explain whether the item is priced by weight or by piece.</p>
              <p>For apartment or gated-community pickups in {area.name}, please arrange entry approval and keep the material near a convenient collection point when possible.</p>
            </div>
            <Button asChild variant="hero" className="mt-7"><Link to="/pickup">Schedule your {area.name} pickup <ArrowRight /></Link></Button>
          </Reveal>
          <Reveal delay={0.1}>
            <aside className="rounded-2xl border border-border bg-card p-6 shadow-soft">
              <h2 className="text-xl font-bold">Areas around {area.name}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">We also coordinate doorstep pickup across major Bengaluru serviceable pincodes. Check your exact address when booking.</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {(area.nearby.length ? area.nearby : ["Bengaluru"]).map((nearby) => <span key={nearby} className="rounded-full bg-secondary px-3 py-1.5 text-sm font-medium">{nearby}</span>)}
              </div>
              <Link to="/areas" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">View all scrap pickup areas <ArrowRight className="size-4" /></Link>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="bg-gradient-navy py-16 text-navy-foreground sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">Ready when you are</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Book a doorstep scrap pickup in {area.name}</h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-navy-foreground/75">Choose what you want to sell, add your {area.pincode} address and select a preferred slot. Keep a photo ready for unusual, bulky or mixed material so we can help confirm the request faster.</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row"><Button asChild variant="hero" size="lg"><Link to="/pickup" search={{ pincode: area.pincode }}>Book scrap pickup <ArrowRight /></Link></Button><Button asChild variant="outlineLight" size="lg"><Link to="/materials">Check scrap rates</Link></Button></div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm"><h3 className="text-xl font-bold">Before you book</h3><ul className="mt-5 space-y-3 text-sm text-navy-foreground/80">{["Keep the material dry and accessible", "Mention your building, shop or office access details", "Select the closest available pickup slot", "Add a photo for e-waste, appliances or bulk scrap"].map((item) => <li key={item} className="flex gap-3"><CheckCircle2 className="size-5 shrink-0 text-brand-green" />{item}</li>)}</ul></div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Fair-value collection</p>
            <h2 className="mt-3 text-3xl font-bold">How scrap value is worked out in {area.name}</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">Scrap value is not one fixed price for every bag. Paper, cardboard, plastic, iron, aluminium, copper and e-waste are different materials with different market demand. Separating what you can helps the pickup team identify each category clearly and gives you a more transparent collection experience.</p>
          </Reveal>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {[
              ["Material and grade", "Clean, separated materials are easier to classify. Mixed or contaminated material may be handled differently from sorted paper, metal or plastic."],
              ["Current listed rate", "Use our live rate page as a helpful reference before booking. Final handling depends on the material checked at collection."],
              ["Quantity and access", "For bulky appliances, office clear-outs or apartment collections, access, loading needs and quantity help us plan the right pickup."],
            ].map(([title, text], index) => <Reveal key={title} delay={index * 0.08}><article className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft"><p className="text-xs font-bold uppercase tracking-wider text-primary">{String(index + 1).padStart(2, "0")}</p><h3 className="mt-3 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-muted-foreground">{text}</p></article></Reveal>)}
          </div>
          <div className="mt-8 text-center"><Link to="/materials" className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">See current scrap rates <ArrowRight className="size-4" /></Link></div>
        </div>
      </section>

      <section className="bg-background py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <Reveal>
            <article className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">For homes and apartments</p>
              <h2 className="mt-3 text-2xl font-bold">A simpler way to clear household scrap in {area.name}</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">Keep newspaper, cartons, bottles, old utensils and small e-waste dry until collection. If your building has security or loading rules, choose a slot when access is easy and include any gate or tower details in the address. This keeps the pickup smooth for you and your community.</p>
            </article>
          </Reveal>
          <Reveal delay={0.1}>
            <article className="h-full rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">For shops and offices</p>
              <h2 className="mt-3 text-2xl font-bold">Planning a larger scrap clear-out?</h2>
              <p className="mt-4 leading-relaxed text-muted-foreground">For cartons, packaging material, metal fixtures, old electronics or a storage-room clean-up around {area.name}, add a clear description and photos. Mention approximate quantity and pickup access so our team can confirm the right next step before the visit.</p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/40 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <Reveal className="text-center"><p className="text-sm font-semibold uppercase tracking-wider text-primary">Questions answered</p><h2 className="mt-3 text-3xl font-bold">Scrap pickup FAQs for {area.name}</h2></Reveal>
          <div className="mt-8 space-y-3">
            {areaFaq(area.name, area.pincode).map((item) => <Reveal key={item.question}><article className="rounded-2xl border border-border bg-card p-5 shadow-soft"><h3 className="font-bold">{item.question}</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.answer}</p></article></Reveal>)}
          </div>
        </div>
      </section>
    </>
  );
}
