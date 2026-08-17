import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowRight, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogShell } from "@/components/sell/CatalogShell";
import { absoluteUrl } from "@/lib/seo";
import { getLaptopBrandBySlug } from "@/lib/laptop-brands";
import {
  useDeviceBrandBySlug,
  useDeviceCategory,
  useDeviceSeries,
  deviceBrandBySlugQuery,
  deviceCategoryQuery,
  deviceSeriesQuery,
} from "@/lib/device-buyback";

export const Route = createFileRoute("/sell/$category_/$brand")({
  head: ({ params }) => {
    const path = `/sell/${params.category}/${params.brand}`;
    const title = `Sell ${cap(params.brand)} ${cap(params.category)} in Bangalore | HuluMart`;
    const description = `Pick your ${cap(params.brand)} series and get an instant price for your ${params.category} in Bangalore with free doorstep pickup.`;
    // The static /sell-old-laptop/{brand} content page covers the same brand
    // keyword with deeper content — canonicalize to it there to avoid
    // cannibalizing our own rankings instead of competing against them.
    const staticBrand = params.category === "laptops" ? getLaptopBrandBySlug(params.brand) : null;
    const canonicalPath = staticBrand ? `/sell-old-laptop/${staticBrand.slug}` : path;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: absoluteUrl(path) },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
      ],
      links: [{ rel: "canonical", href: canonicalPath }],
    };
  },
  loader: async ({ context, params }) => {
    const category = await context.queryClient.ensureQueryData(deviceCategoryQuery(params.category));
    if (!category) return null;
    const brand = await context.queryClient.ensureQueryData(
      deviceBrandBySlugQuery(category.id, params.brand),
    );
    if (brand) await context.queryClient.ensureQueryData(deviceSeriesQuery(brand.id));
    return null;
  },
  component: SeriesPage,
});

function cap(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function SeriesPage() {
  const { category, brand } = useParams({ from: "/sell/$category_/$brand" });
  const navigate = useNavigate();
  const { data: cat, isLoading: catLoading } = useDeviceCategory(category);
  const { data: brandRow, isLoading: brandLoading } = useDeviceBrandBySlug(cat?.id, brand);
  const { data: seriesList = [], isLoading: seriesLoading } = useDeviceSeries(brandRow?.id);
  const [query, setQuery] = useState("");

  const lower = (cat?.name ?? "device").toLowerCase();
  const loading = catLoading || brandLoading || seriesLoading;

  const filtered = useMemo(
    () => seriesList.filter((s) => s.name.toLowerCase().includes(query.trim().toLowerCase())),
    [seriesList, query],
  );

  if (!catLoading && !cat) return <NotFound category={category} />;
  if (!brandLoading && cat && !brandRow) return <NotFound category={category} />;

  return (
    <CatalogShell
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Sell", to: "/sell/$category", params: { category } },
        { label: brandRow?.name ?? cap(brand) },
      ]}
      logo={brandRow?.logo}
      fallback={<Tag className="size-8 text-primary" />}
      title={`${brandRow?.name ?? cap(brand)} ${lower} series`}
      subtitle="Select your series to find your exact model"
      search={query}
      onSearch={setQuery}
      searchPlaceholder={`Search ${brandRow?.name ?? cap(brand)} series…`}
      loading={loading}
      empty={!loading && filtered.length === 0}
      emptyText="No series available for this brand yet."
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {filtered.map((s, i) => (
          <button
            key={s.id}
            onClick={() =>
              navigate({
                to: "/sell/$category/$brand/$series",
                params: { category, brand, series: s.slug },
              })
            }
            className="group relative flex flex-col items-start gap-3 overflow-hidden rounded-2xl border border-border bg-card p-4 text-left shadow-soft transition-all hover:-translate-y-1 hover:border-primary hover:shadow-elevated sm:p-5"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100"
            />
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Tag className="size-5" />
            </span>
            <span className="min-h-[2.5rem] text-sm font-semibold leading-snug sm:text-base">
              {s.name}
            </span>
            <span className="mt-auto flex w-full items-center justify-between text-xs font-medium text-muted-foreground">
              <span>{i + 1} of {filtered.length}</span>
              <span className="inline-flex items-center gap-1 text-primary transition-transform group-hover:translate-x-0.5">
                View <ArrowRight className="size-3.5" />
              </span>
            </span>
          </button>
        ))}
      </div>
    </CatalogShell>
  );
}

function NotFound({ category }: { category: string }) {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <Loader2 className="mx-auto size-8 animate-spin text-primary" />
      <h1 className="mt-4 text-xl font-bold">Brand not found</h1>
      <Button asChild variant="hero" className="mt-6">
        <Link to="/sell/$category" params={{ category }}>
          Back to brands <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
