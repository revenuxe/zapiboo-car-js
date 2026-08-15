import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BatteryCharging,
  Building2,
  CheckCircle2,
  Cpu,
  Factory,
  Fan,
  Gavel,
  MonitorCog,
  Recycle,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Warehouse,
  Wrench,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { absoluteUrl, breadcrumbSchema, organizationSchema, serviceSchema } from "@/lib/seo";

const pageTitle = "Top Scrap Buyers in Bangalore | HuluMart Scrap Dealers";
const pageDescription =
  "HuluMart is a trusted scrap buyer and scrap dealer in Bangalore for office scrap, computer scrap, e-waste, AC scrap, DG sets, batteries, metal scrap and dismantling scrap.";

export const Route = createFileRoute("/top-scrap-buyers")({
  head: () => ({
    meta: [
      { title: pageTitle },
      { name: "description", content: pageDescription },
      { property: "og:title", content: pageTitle },
      { property: "og:description", content: pageDescription },
      { property: "og:url", content: absoluteUrl("/top-scrap-buyers") },
    ],
    links: [{ rel: "canonical", href: "/top-scrap-buyers" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          organizationSchema("/top-scrap-buyers"),
          serviceSchema("/top-scrap-buyers"),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Top Scrap Buyers", path: "/top-scrap-buyers" },
          ]),
        ]),
      },
    ],
  }),
  component: TopScrapBuyers,
});

const scrapServices = [
  {
    icon: Building2,
    title: "IT companies and software office scrap",
    text: "Workstations, pedestal boxes, chairs, tables, cubicles, aluminium partitions, wooden partitions, glass, false ceiling, electrical fittings, AC units, carpets, pantry furniture, display boards, doors, interiors, designer furniture, blinds, photo frames, conference tables and office clearance material.",
  },
  {
    icon: Cpu,
    title: "Computer scrap and e-waste",
    text: "Computers, servers, printers, cartridges, monitors, CPUs, chip boards, motherboards, RAM, display cards, keyboards, mouse units, networking cables, power cables, UPS units, batteries, mobiles, telephones, EPABX systems, PCB waste, electronic waste, wires and junction boxes.",
  },
  {
    icon: Warehouse,
    title: "Office and building dismantling scrap",
    text: "IT office dismantling, company demolishing, complex and apartment clearing, warehouse scrap, old building dismantling, renovation scrap, factory dismantling, interior dismantling, debris clearance and turnkey scrap removal projects.",
  },
  {
    icon: Factory,
    title: "DG set generator scrap",
    text: "Used and scrap diesel generators, petrol generators, motors, engines, alternators, AMF panels, control panels, power cables, aluminium and copper accessories, old generator parts, mini generators, tanks, batteries, engines and gearboxes.",
  },
  {
    icon: BatteryCharging,
    title: "UPS and battery scrap",
    text: "Used UPS systems, inverters, power backup equipment, batteries, cables, controllers, UPS DB units, electrical wiring, relay items, UPS accessories, racks, damaged UPS systems, lead scrap, battery recycling material and PCB waste.",
  },
  {
    icon: MonitorCog,
    title: "Electronic and electrical scrap",
    text: "Electrical light fittings, cables, wires, panels, switch boards, MCBs, circuit breakers, transformers, light ballasts, chokes, industrial electrical scrap, manufacturing scrap, electrical goods and mixed electronic scrap.",
  },
  {
    icon: Fan,
    title: "AC scrap buyers",
    text: "Old air conditioners, indoor and outdoor AC units, window AC, split AC, ductable AC, chiller plants, cooling towers, industrial AC plants, damaged chillers, blowers, motors, copper piping, compressors and AC unit scrap.",
  },
  {
    icon: ShoppingBag,
    title: "Shopping mall and retail scrap",
    text: "Used racks, display furniture, tables, chairs, counters, glass display units, display racking systems, electrical fittings, flooring, GI racks, MS racks, SS racks, carpets, safety equipment and showroom clearance material.",
  },
  {
    icon: Wrench,
    title: "Ferrous and non-ferrous metal scrap",
    text: "Copper scrap, brass scrap, iron scrap, steel scrap, aluminium scrap, MS scrap, GI pipes, angles, MS pipes, rusted metal, aluminium pipe, copper pipe, SS pipe, sheet metal, HMS scrap, cast iron and mixed metal scrap.",
  },
  {
    icon: Truck,
    title: "Old vehicle scrap",
    text: "Junk cars, buses, trucks, lorries, canters, cranes, autos, tempos, engines, gearboxes, body scrap, automobile scrap, two-wheeler scrap and end-of-life vehicle material handled with proper documentation where applicable.",
  },
];

const reasons = [
  {
    icon: Gavel,
    title: "Competitive pricing",
    text: "HuluMart offers fair market-linked prices for scrap materials so homes, offices, shops and businesses get strong value for reusable assets.",
  },
  {
    icon: Recycle,
    title: "Environmental responsibility",
    text: "Our scrap recycling approach focuses on reuse, recovery and responsible disposal to reduce landfill waste and support a cleaner Bangalore.",
  },
  {
    icon: Truck,
    title: "Efficient pickup and disposal",
    text: "We coordinate timely scrap pickup, sorting and movement so office clearances, bulk loads and household scrap are handled without hassle.",
  },
  {
    icon: ShieldCheck,
    title: "Local expertise",
    text: "With roots in the scrap market and an online platform built for 2025 onward, HuluMart understands scrap grades, buyer demand and Bangalore service areas.",
  },
];

const keywordHighlights = [
  "top scrap buyers in Bangalore",
  "scrap dealers in Bangalore",
  "scrap buyers near me",
  "office scrap buyers Bangalore",
  "computer scrap buyers",
  "e-waste scrap buyers",
  "AC scrap buyers",
  "metal scrap buyers",
  "old battery scrap buyers",
  "building dismantling scrap buyers",
];

function TopScrapBuyers() {
  return (
    <>
      <PageHeader
        eyebrow="Top scrap buyers"
        title={
          <>
            Your trusted scrap buyers and dealers in{" "}
            <span className="text-gradient">Bangalore</span>
          </>
        }
        subtitle="HuluMart is your one-stop solution for reliable scrap buying, bulk scrap pickup, office scrap disposal, e-waste handling and responsible recycling across Bangalore, Karnataka."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/pickup">
            Book scrap pickup
            <ArrowRight />
          </Link>
        </Button>
      </PageHeader>

      <section className="bg-background py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <Reveal>
            <div className="space-y-5">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Recycle className="size-7" />
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl">
                Experience and expertise in scrap recycling
              </h2>
              <p className="text-muted-foreground">
                Are you looking for reliable scrap buyers and dealers in Bangalore, Karnataka?
                HuluMart specializes in buying various types of scrap materials and providing
                professional service in and around Bangalore.
              </p>
              <p className="text-muted-foreground">
                With decades of market understanding behind us, we have built a service focused on
                trust, transparent coordination and responsible scrap management. Our journey is
                shaped by the belief that scrap has value when it is handled properly.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
              <h3 className="text-xl font-bold">High-demand scrap services in Bangalore</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {keywordHighlights.map((keyword) => (
                  <span
                    key={keyword}
                    className="rounded-full border border-primary/20 bg-accent px-3 py-1 text-sm font-medium text-primary"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="mt-6 text-muted-foreground">
                From IT companies and software offices to shopping malls, warehouses, apartments,
                factories and old buildings, HuluMart helps sellers clear scrap efficiently while
                keeping recycling and documentation in mind.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Scrap buying and selling in Bangalore
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              We buy a wide range of commercial, office and industrial scrap
            </h2>
            <p className="mt-4 text-muted-foreground">
              HuluMart works with homes, offices, scrap shops, corporates and bulk sellers for
              doorstep pickup, dismantling scrap, e-waste, metal scrap and recycling support.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {scrapServices.map((service, index) => (
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
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
          <Reveal>
            <div className="space-y-4">
              <p className="text-sm font-semibold uppercase tracking-wider text-primary">
                Why choose HuluMart?
              </p>
              <h2 className="text-3xl font-bold sm:text-4xl">
                A smarter, cleaner way to sell scrap
              </h2>
              <p className="text-muted-foreground">
                We go beyond buying and selling scrap. HuluMart is committed to practical service,
                better recycling flows and a smoother experience for anyone searching for scrap
                buyers in Bangalore.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2">
            {reasons.map((reason, index) => (
              <Reveal key={reason.title} delay={(index % 2) * 0.06}>
                <div className="h-full rounded-2xl border border-border bg-card p-6 shadow-soft">
                  <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-green">
                    <reason.icon className="size-5" />
                  </div>
                  <h3 className="mt-4 font-bold">{reason.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {reason.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gradient-navy py-16 text-navy-foreground md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-3xl font-bold sm:text-4xl">Need trusted scrap buyers near you?</h2>
            <p className="mx-auto mt-4 max-w-2xl text-navy-foreground/75">
              Book a HuluMart pickup for office scrap, computer scrap, AC scrap, battery scrap,
              metal scrap, old vehicle scrap and dismantling scrap across Bangalore.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button asChild variant="hero" size="lg">
                <Link to="/pickup">
                  Schedule pickup
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outlineLight" size="lg">
                <Link to="/contact">Talk to our team</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-navy-foreground/75">
              {["Competitive pricing", "Local Bangalore service", "Responsible recycling"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-brand-green" />
                    {item}
                  </span>
                ),
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
