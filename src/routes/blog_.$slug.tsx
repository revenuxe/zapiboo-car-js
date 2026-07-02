import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeIndianRupee,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { householdRates } from "@/lib/bangalore-data";
import { getBlogPost } from "@/lib/blog";
import {
  absoluteUrl,
  blogPostingSchema,
  breadcrumbSchema,
  businessContact,
  faqSchema,
  organizationSchema,
  serviceSchema,
  getAreaBySlug,
} from "@/lib/seo";

/* ---------------- Article content (HBR Layout) ---------------- */

const faqs = [
  {
    question: "Who is the best scrap buyer in HBR Layout, Bangalore?",
    answer:
      "HuluMart is a trusted scrap buyer in HBR Layout offering free doorstep pickup, transparent ₹ per kg rates, certified digital weighing and instant UPI or cash payment. You can book a slot online in under a minute and our team collects paper, plastic, metal, e-waste and old appliances right from your door.",
  },
  {
    question: "What are today's scrap rates in HBR Layout?",
    answer:
      "Indicative HBR Layout scrap rates are around ₹15/kg for newspaper, ₹8/kg for cardboard, ₹10/kg for mixed plastic, ₹28/kg for iron & steel, ₹105/kg for aluminium, ₹520/kg for copper and ₹35/kg for e-waste. Rates are confirmed live at your doorstep on a certified scale before payment.",
  },
  {
    question: "Is doorstep scrap pickup free in HBR Layout?",
    answer:
      "Yes. Doorstep collection in HBR Layout (560043) and nearby areas like Kalyan Nagar, Banaswadi and Hennur is completely free. There are no visiting or weighing charges — you only receive money for the scrap you sell.",
  },
  {
    question: "How quickly can I get a scrap pickup in HBR Layout?",
    answer:
      "Same-day and next-day slots are usually available in HBR Layout. Book online or on WhatsApp, choose a convenient time, and our verified agent arrives with a digital scale and instant payment.",
  },
  {
    question: "What items can I sell to a scrap buyer in HBR Layout?",
    answer:
      "You can sell newspaper and raddi, books, cardboard, plastic, PET bottles, iron, steel, aluminium, copper, brass, e-waste, batteries and old appliances such as fridges, ACs and washing machines. Old laptops and cars can also be sold through HuluMart's dedicated buyback services.",
  },
];

const pickupSteps = [
  {
    icon: CalendarDays,
    title: "1 · Book your slot online",
    text: "Pick your materials, HBR Layout address and a convenient time. Booking takes under a minute — no obligation.",
  },
  {
    icon: Truck,
    title: "2 · We arrive at your door",
    text: "A verified HuluMart agent reaches your doorstep in HBR Layout with a certified digital weighing scale.",
  },
  {
    icon: BadgeIndianRupee,
    title: "3 · Certified weighing",
    text: "Everything is weighed transparently in front of you and priced at the live ₹ per kg rate.",
  },
  {
    icon: Wallet,
    title: "4 · Instant payment",
    text: "Get paid instantly via UPI or cash the moment weighing is done. No waiting, no deductions.",
  },
];

const nearbyAreaSlugs = ["kalyan-nagar", "banaswadi", "hennur", "nagawara", "kammanahalli"];

export const Route = createFileRoute("/blog_/$slug")({
  loader: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ params }) => {
    const post = getBlogPost(params.slug);
    if (!post) return {};
    const path = `/blog/${post.slug}`;
    const image = absoluteUrl(post.heroImage);

    return {
      meta: [
        { title: `${post.title} | HuluMart` },
        { name: "description", content: post.description },
        { name: "keywords", content: post.tags.join(", ") },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: absoluteUrl(path) },
        { property: "og:image", content: image },
        { property: "article:published_time", content: post.datePublished },
        { property: "article:modified_time", content: post.dateModified ?? post.datePublished },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.description },
        { name: "twitter:image", content: image },
      ],
      links: [{ rel: "canonical", href: path }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify([
            organizationSchema(path),
            blogPostingSchema({
              path,
              title: post.title,
              description: post.description,
              image,
              datePublished: post.datePublished,
              dateModified: post.dateModified,
              keywords: post.tags,
            }),
            serviceSchema(path, getAreaBySlug("hbr-layout")),
            faqSchema(faqs),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path },
            ]),
          ]),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const nearby = nearbyAreaSlugs
    .map((slug) => getAreaBySlug(slug))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  return (
    <article className="bg-background">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="mx-auto max-w-3xl px-4 pt-8 text-sm text-muted-foreground sm:px-6"
      >
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link to="/" className="hover:text-foreground">Home</Link>
          </li>
          <ChevronRight className="size-3.5" />
          <li>
            <Link to="/blog" className="hover:text-foreground">Blog</Link>
          </li>
          <ChevronRight className="size-3.5" />
          <li className="text-foreground">Scrap Buyer in HBR Layout</li>
        </ol>
      </nav>

      {/* Header */}
      <header className="mx-auto max-w-3xl px-4 pt-6 sm:px-6">
        <span className="inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-foreground">
          {post.category}
        </span>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight text-foreground sm:text-4xl md:text-5xl">
          Scrap Buyer in HBR Layout, Bangalore — Rates, Doorstep Pickup &amp; Full Guide
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-4" /> Updated {formatDate(post.dateModified ?? post.datePublished)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-4" /> {post.readingMinutes} min read
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-4" /> HBR Layout · 560043
          </span>
        </div>
      </header>

      {/* Hero image */}
      <div className="mx-auto mt-8 max-w-4xl px-4 sm:px-6">
        <img
          src={post.heroImage}
          alt={post.heroAlt}
          width={1600}
          height={900}
          className="aspect-[16/9] w-full rounded-3xl object-cover shadow-elevated"
        />
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="prose-content space-y-6 text-base leading-relaxed text-muted-foreground">
          <p className="text-lg text-foreground">
            Searching for a reliable <strong>scrap buyer in HBR Layout, Bangalore</strong>? Whether
            it&apos;s months of stacked-up newspapers, cardboard from a recent move, leftover metal
            from a renovation, or an old appliance taking up space — HuluMart makes selling scrap in
            HBR Layout genuinely effortless. Book a free doorstep pickup, get your scrap weighed on a
            certified digital scale, and receive instant payment at today&apos;s best rates.
          </p>
          <p>
            This guide covers everything a resident, apartment community or business in HBR Layout
            (pincode 560043) needs: live scrap rates per kg, what we buy, how doorstep collection
            works, and why HuluMart has become one of the most trusted scrap dealers in the area.
          </p>

          {/* Quick CTA card */}
          <div className="not-prose rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <p className="font-semibold text-foreground">
              In a hurry? Book a free HBR Layout scrap pickup in under a minute.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="hero" size="sm">
                <Link to="/pickup">
                  Book a pickup <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a href={businessContact.phoneHref}>
                  <Phone className="size-4" /> Call {businessContact.phone}
                </a>
              </Button>
            </div>
          </div>

          <h2 className="pt-4 text-2xl font-bold text-foreground">
            Today&apos;s scrap rates in HBR Layout (₹ per kg)
          </h2>
          <p>
            Below are indicative HuluMart scrap rates for HBR Layout. Final rates are always
            confirmed live at your doorstep on a certified scale before you get paid — no hidden
            deductions. For the full, always-updated list see our{" "}
            <Link to="/materials" className="font-semibold text-primary hover:underline">
              scrap rates page
            </Link>
            .
          </p>
        </div>

        {/* Rates table */}
        <div className="not-prose my-8 overflow-hidden rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary text-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Material</th>
                <th className="px-4 py-3 text-right font-semibold">Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {householdRates.map((rate) => (
                <tr key={rate.name} className="bg-card">
                  <td className="px-4 py-3 text-foreground">{rate.name}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">
                    {rate.price} <span className="text-xs text-muted-foreground">{rate.unit}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prose-content space-y-6 text-base leading-relaxed text-muted-foreground">
          <h2 className="pt-2 text-2xl font-bold text-foreground">
            What can you sell to a scrap buyer in HBR Layout?
          </h2>
          <p>
            HuluMart buys a wide range of household, society and commercial scrap in HBR Layout:
          </p>
          <ul className="space-y-2">
            {[
              "Newspaper, raddi, books, magazines and cardboard",
              "Plastic, PET bottles, containers and mixed plastic",
              "Iron, steel, aluminium, copper and brass",
              "E-waste — old laptops, CPUs, wires, chargers and circuit boards",
              "Batteries, inverters and UPS units",
              "Old appliances — fridge, AC, washing machine, microwave and more",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p>
            Selling a computer or laptop? Get an instant quote with our{" "}
            <Link to="/sell/$category" params={{ category: "laptops" }} className="font-semibold text-primary hover:underline">
              laptop buyback service
            </Link>
            . Have an old vehicle? Explore{" "}
            <Link to="/scrap-cars" className="font-semibold text-primary hover:underline">
              scrap car collection
            </Link>
            . Running a business or office in HBR Layout? See our{" "}
            <Link to="/top-scrap-buyers" className="font-semibold text-primary hover:underline">
              commercial scrap buying services
            </Link>
            .
          </p>
        </div>

        {/* How pickup works */}
        <h2 className="not-prose mt-12 mb-6 text-2xl font-bold text-foreground">
          How doorstep scrap pickup works in HBR Layout
        </h2>
        <div className="not-prose grid gap-4 sm:grid-cols-2">
          {pickupSteps.map((step) => (
            <Reveal key={step.title}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
                <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                  <step.icon className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="prose-content mt-12 space-y-6 text-base leading-relaxed text-muted-foreground">
          <h2 className="text-2xl font-bold text-foreground">
            Why HuluMart is HBR Layout&apos;s trusted scrap buyer
          </h2>
          <ul className="space-y-3">
            {[
              ["Certified weighing", "Every pickup uses a digital scale weighed in front of you — no guesswork, no under-weighing."],
              ["Live, transparent rates", "You always see the current ₹ per kg rate before you sell."],
              ["Instant payment", "Get paid on the spot via UPI or cash the moment weighing is done."],
              ["Free doorstep service", "Zero visiting or handling charges anywhere in HBR Layout and nearby areas."],
              ["Verified agents", "Trained, background-checked collection agents you can trust at your door."],
              ["Responsible recycling", "Your scrap is channelled to authorised recyclers, keeping HBR Layout cleaner and greener."],
            ].map(([title, text]) => (
              <li key={title} className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                <span>
                  <strong className="text-foreground">{title}:</strong> {text}
                </span>
              </li>
            ))}
          </ul>

          <h2 className="pt-4 text-2xl font-bold text-foreground">
            Scrap pickup areas near HBR Layout
          </h2>
          <p>
            Besides HBR Layout, HuluMart offers doorstep scrap collection across the surrounding
            neighbourhoods. Book a pickup in any of these areas:
          </p>
        </div>

        <div className="not-prose my-6 flex flex-wrap gap-2">
          <Link
            to="/areas/$area"
            params={{ area: "hbr-layout" }}
            className="rounded-full border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            HBR Layout
          </Link>
          {nearby.map((area) => (
            <Link
              key={area.slug}
              to="/areas/$area"
              params={{ area: area.slug }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
            >
              {area.name}
            </Link>
          ))}
          <Link
            to="/areas"
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            All areas →
          </Link>
        </div>

        {/* FAQ */}
        <h2 className="not-prose mt-12 mb-6 text-2xl font-bold text-foreground">
          Frequently asked questions
        </h2>
        <div className="not-prose space-y-4">
          {faqs.map((faq) => (
            <div key={faq.question} className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Closing CTA */}
        <div className="not-prose mt-12 rounded-3xl bg-gradient-navy p-8 text-center text-navy-foreground">
          <h2 className="text-2xl font-bold">Sell your scrap in HBR Layout today</h2>
          <p className="mx-auto mt-3 max-w-xl text-navy-foreground/75">
            Free doorstep pickup, certified weighing and instant payment — book your slot now.
          </p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild variant="hero" size="lg">
              <Link to="/pickup">
                Book a pickup <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="outlineLight" size="lg">
              <a href={businessContact.phoneHref}>
                <Phone className="size-4" /> Call {businessContact.phone}
              </a>
            </Button>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
            ← Back to all guides
          </Link>
        </div>
      </div>
    </article>
  );
}
