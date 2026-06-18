import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowRight, ChevronRight, Layers, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogShell } from "@/components/sell/CatalogShell";
import {
  useDeviceBrandBySlug,
  useDeviceCategory,
  useDeviceSeries,
} from "@/lib/device-buyback";

export const Route = createFileRoute("/sell/$category_/$brand")({
  head: ({ params }) => ({
    meta: [
      { title: `Sell ${cap(params.brand)} ${cap(params.category)} in Bangalore | HuluMart` },
      {
        name: "description",
        content: `Pick your ${cap(params.brand)} series and get an instant price for your ${params.category} in Bangalore with free doorstep pickup.`,
      },
    ],
  }),
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
      <div className="grid gap-3 sm:grid-cols-2">
        {filtered.map((s) => (
          <button
            key={s.id}
            onClick={() =>
              navigate({
                to: "/sell/$category/$brand/$series",
                params: { category, brand, series: s.slug },
              })
            }
            className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated"
          >
            <span className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
                <Layers className="size-5" />
              </span>
              <span className="font-semibold">{s.name}</span>
            </span>
            <ChevronRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
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
