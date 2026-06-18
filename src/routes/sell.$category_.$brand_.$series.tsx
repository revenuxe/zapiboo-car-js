import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowRight, Laptop, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogShell } from "@/components/sell/CatalogShell";
import {
  formatPrice,
  useDeviceBrandBySlug,
  useDeviceCategory,
  useDeviceModels,
  useDeviceSeriesBySlug,
} from "@/lib/device-buyback";

export const Route = createFileRoute("/sell/$category_/$brand_/$series")({
  head: ({ params }) => ({
    meta: [
      { title: `Sell ${cap(params.brand)} ${cap(params.series)} in Bangalore | HuluMart` },
      {
        name: "description",
        content: `Select your ${cap(params.brand)} ${cap(params.series)} model and get an instant buyback price with free doorstep pickup in Bangalore.`,
      },
    ],
  }),
  component: ModelsPage,
});

function cap(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function ModelsPage() {
  const { category, brand, series } = useParams({ from: "/sell/$category_/$brand_/$series" });
  const navigate = useNavigate();
  const { data: cat, isLoading: catLoading } = useDeviceCategory(category);
  const { data: brandRow, isLoading: brandLoading } = useDeviceBrandBySlug(cat?.id, brand);
  const { data: seriesRow, isLoading: seriesLoading } = useDeviceSeriesBySlug(brandRow?.id, series);
  const { data: models = [], isLoading: modelsLoading } = useDeviceModels(seriesRow?.id);
  const [query, setQuery] = useState("");

  const loading = catLoading || brandLoading || seriesLoading || modelsLoading;
  const brandName = brandRow?.name ?? cap(brand);
  const seriesName = seriesRow?.name ?? cap(series);

  const filtered = useMemo(
    () => models.filter((m) => m.name.toLowerCase().includes(query.trim().toLowerCase())),
    [models, query],
  );

  if (!seriesLoading && brandRow && !seriesRow) {
    return (
      <div className="mx-auto max-w-md px-4 py-24 text-center">
        <Loader2 className="mx-auto size-8 animate-spin text-primary" />
        <h1 className="mt-4 text-xl font-bold">Series not found</h1>
        <Button asChild variant="hero" className="mt-6">
          <Link to="/sell/$category/$brand" params={{ category, brand }}>
            Back to series <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <CatalogShell
      crumbs={[
        { label: "Home", to: "/" },
        { label: "Sell", to: "/sell/$category", params: { category } },
        { label: brandName, to: "/sell/$category/$brand", params: { category, brand } },
        { label: seriesName },
      ]}
      logo={brandRow?.logo}
      fallback={<Tag className="size-8 text-primary" />}
      title={`${brandName} ${seriesName} Models`}
      subtitle={`Select your model to get an instant ${(cat?.name ?? "device").toLowerCase()} buyback price`}
      search={query}
      onSearch={setQuery}
      searchPlaceholder={`Search ${brandName} ${seriesName} models…`}
      loading={loading}
      empty={!loading && filtered.length === 0}
      emptyText="No models available for this series yet."
    >
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
        {filtered.map((m) => (
          <button
            key={m.id}
            onClick={() =>
              navigate({
                to: "/sell/$category/$brand/$series/$model",
                params: { category, brand, series, model: m.slug },
              })
            }
            className="group flex flex-col items-center rounded-2xl border border-border bg-card p-4 text-center shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-elevated"
          >
            <div className="flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl bg-secondary/60">
              {m.image ? (
                <img src={m.image} alt={m.name} className="max-h-full max-w-full object-contain p-2" />
              ) : (
                <Laptop className="size-10 text-muted-foreground" />
              )}
            </div>
            <p className="mt-3 text-sm font-semibold leading-snug">{m.name}</p>
          </button>
        ))}
      </div>
    </CatalogShell>
  );
}
