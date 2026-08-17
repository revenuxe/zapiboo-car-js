import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, ChevronRight, MapPin, Recycle, Scale, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import heroImg from "@/assets/hero-scrap.webp";
import paperRaddiImg from "@/assets/scrap-cards/scrap-metal.webp";
import mixedScrapImg from "@/assets/scrap-cards/scrap-paper-raddi.webp";
import ewasteImg from "@/assets/scrap-cards/scrap-plastic.webp";
import metalImg from "@/assets/scrap-cards/scrap-mixed.webp";
import plasticImg from "@/assets/scrap-cards/scrap-ewaste.webp";
import householdImg from "@/assets/scrap-cards/scrap-household.webp";
import { absoluteUrl, breadcrumbSchema, faqSchema, localBusinessSchema, organizationSchema, scrapPickupServiceSchema, serviceAreas } from "@/lib/seo";

type ScrapPage = {
  name: string;
  title: string;
  description: string;
  intro: string;
  image: string;
  imageAlt: string;
  bookingSearch: { mode: "mixed" | "specific"; item?: string };
  accepted: string[];
  preparation: string[];
  benefits: Array<{ title: string; text: string }>;
  faqs: Array<{ question: string; answer: string }>;
};

const scrapPages: Record<string, ScrapPage> = {
  "mixed-scrap": {
    name: "Mixed scrap",
    title: "Sell Mixed Scrap in Bangalore | Doorstep Pickup",
    description: "Sell mixed household scrap in Bangalore with HuluMart. We collect raddi, paper, plastic, metal and bottles at your doorstep with transparent weighing and payment.",
    intro: "Clear out everyday recyclable material in one pickup. Mixed scrap is useful when paper, cardboard, plastic bottles and small metal items are stored together.",
    image: mixedScrapImg, imageAlt: "Mixed recyclable scrap including paper, plastic, bottles and metal",
    bookingSearch: { mode: "mixed" },
    accepted: ["Newspapers, books and raddi", "Cardboard cartons and clean packaging", "Plastic bottles and household containers", "Small iron, steel, aluminium and brass pieces"],
    preparation: ["Keep wet waste, food and hazardous items separate.", "Put loose paper and bottles in bags or boxes if possible.", "You can add a photo during booking when the mix is large or unusual."],
    benefits: [{ title: "One pickup for many materials", text: "No need to create separate requests for normal household recyclables." }, { title: "Transparent doorstep weighing", text: "Review the material and weight with the collection team before payment." }, { title: "A practical recycling route", text: "Sorting recyclable scrap keeps reusable material out of the general waste stream." }],
    faqs: [{ question: "What is mixed scrap?", answer: "Mixed scrap means common recyclable household materials such as raddi, cardboard, plastic bottles and small metal items collected together in one request." }, { question: "Can I book mixed scrap if I do not know the exact categories?", answer: "Yes. Choose mixed scrap and describe what you have. Adding a photo during booking can help the team understand the collection." }, { question: "Do I need to separate every item first?", answer: "Basic separation of wet waste and non-recyclable rubbish is helpful. You do not need to create a separate booking for each normal recyclable material." }],
  },
  "paper-raddi": {
    name: "Paper and raddi", title: "Sell Paper & Raddi in Bangalore | Doorstep Collection",
    description: "Sell old newspapers, books, cardboard and raddi in Bangalore. HuluMart offers convenient doorstep paper scrap pickup with clear weighing and payment.",
    intro: "Turn stacks of old newspapers, books, notebooks, cartons and clean cardboard into a simple doorstep collection. Paper and raddi pickup is ideal for homes, apartments, schools and small offices.",
    image: paperRaddiImg, imageAlt: "Old newspapers, cardboard boxes and books ready for raddi pickup",
    bookingSearch: { mode: "specific", item: "Newspaper / Raddi" },
    accepted: ["Newspapers, magazines and office paper", "Books, notebooks and exam papers", "Cardboard cartons and corrugated boxes", "Clean paper packaging and paperboard"],
    preparation: ["Keep paper dry; wet or food-soiled paper is difficult to recycle.", "Remove plastic wrappers or separate them for mixed scrap.", "Bundle newspapers or keep them in cartons for easier handling."],
    benefits: [{ title: "Convenient raddi collection", text: "Schedule a visit instead of carrying a heavy paper stack to a local buyer." }, { title: "Clear weight check", text: "Paper is weighed at pickup so you can review the collection before payment." }, { title: "Useful for regular clear-outs", text: "Book when a home, office, shop or society has accumulated paper scrap." }],
    faqs: [{ question: "Do you collect old books and notebooks?", answer: "Yes, old books, notebooks and regular paper are suitable for a paper and raddi pickup when they are reasonably dry and clean." }, { question: "Can cardboard boxes go with raddi?", answer: "Yes. Flattened clean cartons and cardboard boxes can be included in a paper and raddi collection." }, { question: "What paper should be kept out?", answer: "Keep wet, heavily food-soiled or mixed household waste out of the paper bundle. Put non-paper material into the appropriate category instead." }],
  },
  "metal-scrap": {
    name: "Metal scrap", title: "Sell Metal Scrap in Bangalore | Iron, Steel, Copper & Brass",
    description: "Sell metal scrap in Bangalore with doorstep pickup for iron, steel, aluminium, copper and brass. Book HuluMart for clear collection and transparent weighing.",
    intro: "Have unused metal from repairs, renovations, packaging or household clear-outs? Book a metal scrap pickup for common iron, steel, aluminium, copper and brass items.",
    image: metalImg, imageAlt: "Steel, iron, copper and brass metal scrap materials",
    bookingSearch: { mode: "specific", item: "Iron & Metal" },
    accepted: ["Iron and steel pieces", "Aluminium utensils and profiles", "Copper pipes, wire and fittings", "Brass components and non-hazardous metal fixtures"],
    preparation: ["Keep sharp pieces safely contained where possible.", "Separate metal from wood, plastic or glass when it can be done safely.", "For large or bulky material, add a photo during booking."],
    benefits: [{ title: "Pickup for common metals", text: "Use one request for household and small commercial metal scrap." }, { title: "Better visibility at collection", text: "The material is checked and weighed with you at the doorstep." }, { title: "Helpful for renovation clean-ups", text: "Clear pipes, fittings, frames and other unwanted metal after repair work." }],
    faqs: [{ question: "Which metal scrap can I sell?", answer: "Common iron, steel, aluminium, copper and brass items can be included. Use a photo in the booking flow if you are unsure about an item." }, { question: "Can metal be mixed with other scrap?", answer: "Yes, small mixed quantities can be booked as mixed scrap. Use the metal option when metal is the main material." }, { question: "Should I remove wires or plastic parts?", answer: "Separate materials if it is simple and safe to do so. Do not dismantle items that require tools or could cause injury." }],
  },
  "plastic-scrap": {
    name: "Plastic scrap", title: "Sell Plastic Scrap in Bangalore | Bottles & Containers Pickup",
    description: "Sell plastic bottles, containers and household plastic scrap in Bangalore with HuluMart doorstep pickup. Book a convenient collection for recyclable plastic.",
    intro: "Keep reusable plastic in circulation by booking collection for bottles, containers and clean household plastic. It is a convenient choice after moving, events or routine home clear-outs.",
    image: plasticImg, imageAlt: "Plastic bottles and reusable household containers for recycling",
    bookingSearch: { mode: "specific", item: "Plastic & Bottles" },
    accepted: ["PET water and soft-drink bottles", "Clean detergent and household containers", "Plastic tubs, caps and packaging", "Mixed clean household plastic"],
    preparation: ["Empty and rinse bottles or containers when possible.", "Keep food waste and wet garbage out of the plastic bag.", "Flatten large bottles or containers to save space."],
    benefits: [{ title: "Easy household clear-out", text: "Collect bottles and plastic containers without waiting for general waste disposal." }, { title: "Clear category selection", text: "Choose plastic when bottles and containers are the main material in your pickup." }, { title: "Simple doorstep scheduling", text: "Select your address and available time slot in the booking flow." }],
    faqs: [{ question: "Do you collect plastic bottles?", answer: "Yes. Clean PET bottles, household containers and other normal recyclable plastic can be requested under plastic scrap." }, { question: "Should bottles be washed?", answer: "A quick emptying or rinse is helpful because food residue and wet waste can contaminate recyclable plastic." }, { question: "Can I include plastic with paper and metal?", answer: "Yes. If you have several small categories together, choose mixed scrap for a single combined request." }],
  },
  "e-waste": {
    name: "E-waste", title: "E-Waste Pickup in Bangalore | Sell Old Electronics",
    description: "Book e-waste pickup in Bangalore for old electronics, chargers, cables, keyboards, phones and small devices. HuluMart makes responsible doorstep collection simple.",
    intro: "Old chargers, cables, keyboards, phones and small electronic accessories should not go into regular household waste. Use a dedicated e-waste pickup for unwanted electronics and related parts.",
    image: ewasteImg, imageAlt: "Old electronics, cables, phone and computer accessories for e-waste pickup",
    bookingSearch: { mode: "specific", item: "E-Waste" },
    accepted: ["Chargers, cables, adapters and wires", "Keyboards, mice and small computer accessories", "Old phones and small electronic devices", "Circuit boards and non-hazardous electronic parts"],
    preparation: ["Back up and remove personal data from devices before handing them over.", "Remove batteries when safe and practical; do not open damaged batteries.", "Add a photo for larger electronic items or mixed e-waste."],
    benefits: [{ title: "Keep electronics out of regular waste", text: "E-waste needs different handling from ordinary household rubbish." }, { title: "Useful for cables and accessories", text: "Book a collection when drawers and storage boxes fill up with old tech." }, { title: "Clear booking details", text: "Describe the devices and add a photo so the collection is easier to plan." }],
    faqs: [{ question: "What counts as e-waste?", answer: "Old electronic accessories and small devices such as cables, chargers, keyboards, mice, phones and circuit boards are common e-waste items." }, { question: "Should I erase my old phone or device first?", answer: "Yes. Back up your data and sign out or erase personal information before giving away any device that can store it." }, { question: "Can I add e-waste to a mixed scrap pickup?", answer: "For a few small items, you can describe them in a mixed request. Choose e-waste when electronics are the main collection." }],
  },
  "other-scrap": {
    name: "Other household scrap", title: "Other Scrap Pickup in Bangalore | Appliances & Household Items",
    description: "Book household scrap pickup in Bangalore for old appliances, glass, utensils and miscellaneous recyclable items. Tell HuluMart what you have and schedule doorstep collection.",
    intro: "For appliances, glass, utensils and miscellaneous household material that does not fit neatly into one category, start an other-scrap request and describe the items you want cleared.",
    image: householdImg, imageAlt: "Household items and small appliances ready for scrap collection",
    bookingSearch: { mode: "specific", item: "Old Appliances" },
    accepted: ["Small old appliances and household items", "Glass bottles and jars", "Utensils, fixtures and mixed reusable material", "Shop or home clear-out scrap"],
    preparation: ["Tell us what the item is and add a photo during booking.", "Empty appliances and remove personal belongings before collection.", "Keep broken glass carefully contained for safe handling."],
    benefits: [{ title: "A place for the unusual items", text: "Start here if the material is not clearly paper, plastic, metal or e-waste." }, { title: "Photo-assisted booking", text: "A picture and short description make it easier to assess miscellaneous scrap." }, { title: "Useful for household decluttering", text: "Clear unwanted items during moving, renovation or seasonal clean-ups." }],
    faqs: [{ question: "What should I choose for old household appliances?", answer: "Choose other household scrap and describe the appliance. Add a photo so the pickup can be assessed more accurately." }, { question: "Can I include glass bottles?", answer: "Yes, glass bottles and jars can be described in an other-scrap request. Pack broken glass safely." }, { question: "What if I am unsure about the material?", answer: "Choose other scrap or mixed scrap, write a short description and add a photo during booking." }],
  },
};

const fallback = scrapPages["mixed-scrap"];

export const Route = createFileRoute("/scrap/$category")({
  head: ({ params }) => {
    const page = scrapPages[params.category] ?? fallback;
    const path = `/scrap/${params.category}`;
    return { meta: [{ title: page.title }, { name: "description", content: page.description }, { property: "og:title", content: page.title }, { property: "og:description", content: page.description }, { property: "og:url", content: absoluteUrl(path) }, { property: "og:image", content: page.image }], links: [{ rel: "canonical", href: path }], scripts: [{ type: "application/ld+json", children: JSON.stringify([organizationSchema(path), localBusinessSchema(), scrapPickupServiceSchema(path), breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Scrap categories", path: "/categories" }, { name: page.name, path }]), faqSchema(page.faqs)]) }] };
  },
  component: ScrapCategoryPage,
});

function ScrapCategoryPage() {
  const { category } = Route.useParams();
  const page = scrapPages[category] ?? fallback;
  const otherPages = Object.entries(scrapPages).filter(([slug]) => slug !== category).slice(0, 5);
  const areas = serviceAreas.slice(0, 12);

  return <>
    <section className="relative overflow-hidden bg-gradient-navy text-navy-foreground">
      <div className="absolute inset-0"><img src={heroImg} alt="" width={1920} height={1080} className="h-full w-full object-cover opacity-25" /><div className="absolute inset-0 bg-navy/50" /></div>
      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-[1.25fr_.75fr] md:items-center md:py-24 lg:px-8">
        <div><p className="text-sm font-bold uppercase tracking-[0.16em] text-primary">Doorstep collection in Bangalore</p><h1 className="mt-4 text-4xl font-extrabold leading-[1.06] sm:text-5xl">Sell {page.name.toLowerCase()} <span className="text-gradient">in Bangalore</span></h1><p className="mt-5 max-w-2xl text-base leading-relaxed text-navy-foreground/80 sm:text-lg">{page.intro}</p><div className="mt-8 flex flex-col gap-3 sm:flex-row"><Button asChild variant="hero" size="xl"><Link to="/pickup" search={page.bookingSearch}>Book {page.name.toLowerCase()} pickup <ArrowRight /></Link></Button><Button asChild variant="outline" size="xl" className="border-white/25 bg-white/10 text-white hover:bg-white/20 hover:text-white"><Link to="/materials">View current scrap rates <ChevronRight /></Link></Button></div><p className="mt-5 flex items-center gap-2 text-sm text-navy-foreground/70"><MapPin className="size-4 text-primary" />Doorstep collection across major Bangalore service areas</p></div>
        <img src={page.image} alt={page.imageAlt} width={512} height={512} className="mx-auto w-full max-w-sm object-contain drop-shadow-2xl" />
      </div>
    </section>

    <section className="py-14 sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-sm font-bold uppercase tracking-wider text-primary">What we collect</p><h2 className="mt-3 text-3xl font-bold">{page.name} we can help you clear</h2><p className="mt-4 leading-relaxed text-muted-foreground">Book when these materials have built up at home, in an apartment, office or small shop. If your items are different, choose mixed scrap or add a photo in the booking flow.</p><Button asChild variant="outline" className="mt-6"><Link to="/pickup" search={page.bookingSearch}>Start pickup request <ArrowRight /></Link></Button></div><div className="grid gap-3 sm:grid-cols-2">{page.accepted.map((item) => <div key={item} className="flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-soft"><CheckCircle2 className="mt-0.5 size-5 shrink-0 text-primary" /><p className="font-medium leading-relaxed">{item}</p></div>)}</div></div></div></section>

    <section className="bg-secondary/45 py-14 sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-wider text-primary">Why book with HuluMart</p><h2 className="mt-3 text-3xl font-bold">A simple route from unwanted scrap to pickup</h2></div><div className="mt-9 grid gap-4 md:grid-cols-3">{page.benefits.map((benefit, index) => { const Icon = [Scale, ShieldCheck, Recycle][index]; return <div key={benefit.title} className="rounded-2xl border border-border bg-card p-6 shadow-soft"><Icon className="size-7 text-primary" /><h3 className="mt-5 text-xl font-bold">{benefit.title}</h3><p className="mt-3 leading-relaxed text-muted-foreground">{benefit.text}</p></div>; })}</div></div></section>

    <section className="py-14 sm:py-20"><div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8"><div><p className="text-sm font-bold uppercase tracking-wider text-primary">Before pickup</p><h2 className="mt-3 text-3xl font-bold">A few quick preparation tips</h2><div className="mt-7 space-y-4">{page.preparation.map((tip, index) => <div key={tip} className="flex gap-4"><span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{index + 1}</span><p className="pt-0.5 leading-relaxed text-muted-foreground">{tip}</p></div>)}</div></div><div className="rounded-3xl bg-navy p-7 text-navy-foreground sm:p-9"><Sparkles className="size-7 text-primary" /><h2 className="mt-5 text-2xl font-bold">Ready to clear it out?</h2><p className="mt-3 leading-relaxed text-navy-foreground/75">Choose a convenient pickup slot, confirm your address and share a photo if it helps explain the material. The booking flow keeps the request clear from the start.</p><Button asChild variant="hero" size="lg" className="mt-7"><Link to="/pickup" search={page.bookingSearch}>Book doorstep pickup <ArrowRight /></Link></Button></div></div></section>

    <section className="bg-secondary/45 py-14 sm:py-20"><div className="mx-auto max-w-4xl px-4 sm:px-6"><p className="text-center text-sm font-bold uppercase tracking-wider text-primary">Questions answered</p><h2 className="mt-3 text-center text-3xl font-bold">{page.name} pickup FAQs</h2><div className="mt-9 space-y-3">{page.faqs.map((faq) => <details key={faq.question} className="group rounded-2xl border border-border bg-card p-5 shadow-soft"><summary className="cursor-pointer list-none pr-8 font-bold marker:hidden">{faq.question}<span className="float-right text-primary group-open:rotate-90">+</span></summary><p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p></details>)}</div></div></section>

    <section className="py-14 sm:py-20"><div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-bold uppercase tracking-wider text-primary">Explore more</p><h2 className="mt-3 text-3xl font-bold">Other scrap collection options</h2></div><Link to="/categories" className="inline-flex items-center gap-2 font-bold text-primary">View all categories <ArrowRight className="size-4" /></Link></div><div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{otherPages.map(([slug, other]) => <Link key={slug} to="/scrap/$category" params={{ category: slug }} className="group rounded-2xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-1 hover:border-primary/45"><img src={other.image} alt="" width={160} height={120} loading="lazy" className="h-24 w-full object-contain" /><h3 className="mt-4 font-bold">{other.name}</h3><span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-primary">Learn more <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span></Link>)}</div><div className="mt-12 rounded-3xl border border-primary/20 bg-primary/5 p-6 sm:p-8"><h2 className="text-2xl font-bold">Scrap pickup across Bangalore</h2><p className="mt-3 max-w-3xl leading-relaxed text-muted-foreground">HuluMart serves major Bangalore neighbourhoods. Check your pincode in the booking flow to confirm availability for your address.</p><div className="mt-5 flex flex-wrap gap-2">{areas.map((area) => <Link key={area.slug} to="/areas/$area" params={{ area: area.slug }} className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary/50 hover:text-primary">{area.name}</Link>)}</div></div></div></section>
  </>;
}
