import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Boxes, Package, Recycle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { activeScrapCategoriesQuery, useScrapCategories } from "@/lib/scrap-categories";
import {
  absoluteUrl,
  breadcrumbSchema,
  localBusinessSchema,
  organizationSchema,
  scrapPickupServiceSchema,
} from "@/lib/seo";

const title = "Scrap Categories We Buy in Bangalore | HuluMart";
const description =
  "Explore the scrap categories HuluMart collects in Bangalore. Book doorstep pickup for paper, metal, plastic, e-waste, appliances and more.";

export const Route = createFileRoute("/categories")({
  loader: ({ context }) => context.queryClient.ensureQueryData(activeScrapCategoriesQuery()),
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: absoluteUrl("/categories") },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify([
          organizationSchema("/categories"),
          localBusinessSchema(),
          scrapPickupServiceSchema("/categories"),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Scrap Categories", path: "/categories" },
          ]),
        ]),
      },
    ],
  }),
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories = [], isLoading } = useScrapCategories();

  return (
    <>
      <PageHeader
        eyebrow="What we collect"
        title={<>Explore all <span className="text-gradient">scrap categories</span></>}
        subtitle="Browse the live categories managed by HuluMart. Choose a category, then book a convenient doorstep scrap pickup in Bangalore."
      >
        <Button asChild variant="hero" size="lg"><Link to="/pickup">Book scrap pickup <ArrowRight /></Link></Button>
      </PageHeader>

      <section className="bg-background py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div><p className="text-sm font-semibold uppercase tracking-wider text-primary">Live categories</p><h2 className="mt-2 text-3xl font-bold">Choose what you want to sell</h2></div>
            <p className="text-sm text-muted-foreground">{categories.length} active categories</p>
          </div>

          {isLoading ? (
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="h-44 animate-pulse rounded-2xl bg-secondary" />)}</div>
          ) : categories.length ? (
            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category, index) => (
                <Reveal key={category.id} delay={(index % 4) * 0.05}>
                  <Link to="/pickup" className="group flex h-full min-h-44 flex-col rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-1 hover:border-primary/45 hover:shadow-elevated">
                    <div className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {category.icon?.startsWith("http") ? <img src={category.icon} alt="" className="size-7 object-contain" /> : <Recycle className="size-5" />}
                    </div>
                    <h3 className="mt-5 text-lg font-bold leading-tight">{category.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Book doorstep pickup for {category.name.toLowerCase()} in Bangalore.</p>
                    <span className="mt-auto pt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary">Book pickup <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" /></span>
                  </Link>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-10 text-center"><Package className="mx-auto size-10 text-primary" /><h2 className="mt-4 text-xl font-bold">Categories are being updated</h2><p className="mt-2 text-muted-foreground">You can still book a mixed scrap pickup and tell us what you have.</p><Button asChild variant="hero" className="mt-6"><Link to="/pickup">Book mixed scrap pickup <ArrowRight /></Link></Button></div>
          )}
        </div>
      </section>

      <section className="bg-secondary/40 py-14 sm:py-16"><div className="mx-auto max-w-4xl px-4 text-center sm:px-6"><Boxes className="mx-auto size-7 text-primary" /><h2 className="mt-4 text-2xl font-bold">Not sure which category fits?</h2><p className="mt-3 text-muted-foreground">Choose mixed scrap, describe the items and add a photo during booking. The team can help confirm the right collection option.</p><Button asChild variant="outline" className="mt-6"><Link to="/pickup">Start a pickup request <ArrowRight /></Link></Button></div></section>
    </>
  );
}
