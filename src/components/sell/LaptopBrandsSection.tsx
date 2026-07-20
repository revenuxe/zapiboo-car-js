import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/sell/BrandLogo";
import { useCategoryWithBrands } from "@/lib/device-buyback";
import { laptopBrands as staticBrands } from "@/lib/laptop-brands";

const STATIC_SLUGS = new Set(staticBrands.map((b) => b.slug));

export function LaptopBrandsSection({
  heading = "Choose your laptop brand",
  subtitle = "Instant price for every major brand — free doorstep pickup across Bangalore.",
}: {
  heading?: string;
  subtitle?: string;
}) {
  const { data } = useCategoryWithBrands("laptops");
  const brands = data?.brands ?? [];

  // Prefer DB brands; fall back to static list if data hasn't hydrated.
  const items =
    brands.length > 0
      ? brands.map((b) => ({ slug: b.slug, name: b.name, logo: b.logo }))
      : staticBrands.map((b) => ({ slug: b.slug, name: b.name, logo: null as string | null }));

  return (
    <section className="bg-background py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Sell by brand
            </p>
            <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">{heading}</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <Link
            to="/sell/$category"
            params={{ category: "laptops" }}
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View all brands <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.slice(0, 10).map((b, i) => {
            const hasSeo = STATIC_SLUGS.has(b.slug);
            const card = (
              <div className="group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated">
                <BrandLogo
                  src={b.logo}
                  name={b.name}
                  eager={i < 5}
                  highPriority={i < 3}
                />
                <span className="text-sm font-semibold">{b.name}</span>
              </div>
            );
            return hasSeo ? (
              <Link
                key={b.slug}
                to="/sell-old-laptop/$brand"
                params={{ brand: b.slug }}
                className="block"
              >
                {card}
              </Link>
            ) : (
              <Link
                key={b.slug}
                to="/sell/$category/$brand"
                params={{ category: "laptops", brand: b.slug }}
                className="block"
              >
                {card}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
