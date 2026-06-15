import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Filter,
  MapPin,
  Package,
  Search,
  SlidersHorizontal,
  Star,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { useScrapCategories } from "@/lib/scrap-categories";
import {
  CONDITIONS,
  conditionLabel,
  formatListingPrice,
  useActiveListings,
} from "@/lib/scrap-listings";

export const Route = createFileRoute("/listings")({
  head: () => ({
    meta: [
      { title: "Scrap Listings in Bengaluru | HuluMart" },
      {
        name: "description",
        content:
          "Browse live scrap listings in Bengaluru — metal, e-waste, car scrap, appliances and more. Filter by category, condition and price, then book a doorstep pickup.",
      },
      { property: "og:title", content: "Scrap Listings in Bengaluru | HuluMart" },
      {
        property: "og:description",
        content: "Browse live scrap listings with photos, prices and doorstep pickup across Bengaluru.",
      },
    ],
    links: [{ rel: "canonical", href: "/listings" }],
  }),
  component: ListingsPage,
});

type SortKey = "newest" | "price-low" | "price-high";

const priceValue = (price: string | null) => {
  if (!price) return Number.POSITIVE_INFINITY;
  const n = parseFloat(price.replace(/[^\d.]/g, ""));
  return Number.isNaN(n) ? Number.POSITIVE_INFINITY : n;
};

function ListingsPage() {
  const { data: listings = [], isLoading } = useActiveListings();
  const { data: categories = [] } = useScrapCategories();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [condition, setCondition] = useState("all");
  const [sort, setSort] = useState<SortKey>("newest");
  const [showFilters, setShowFilters] = useState(false);

  const catName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "";

  const results = useMemo(() => {
    const q = search.trim().toLowerCase();
    let out = listings.filter((l) => {
      const matchesQuery =
        !q ||
        l.title.toLowerCase().includes(q) ||
        (l.subcategory ?? "").toLowerCase().includes(q) ||
        (l.description ?? "").toLowerCase().includes(q) ||
        catName(l.category_id).toLowerCase().includes(q);
      const matchesCat = category === "all" || l.category_id === category;
      const matchesCond = condition === "all" || l.condition === condition;
      return matchesQuery && matchesCat && matchesCond;
    });
    if (sort === "price-low") out = [...out].sort((a, b) => priceValue(a.price) - priceValue(b.price));
    if (sort === "price-high") out = [...out].sort((a, b) => priceValue(b.price) - priceValue(a.price));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listings, categories, search, category, condition, sort]);

  const activeFilters = (category !== "all" ? 1 : 0) + (condition !== "all" ? 1 : 0);

  return (
    <>
      <PageHeader
        eyebrow="Marketplace · Bengaluru"
        title={
          <>
            Browse <span className="text-gradient">scrap listings</span>
          </>
        }
        subtitle="Real scrap available right now across Bengaluru — metal, e-waste, vehicles, appliances and more. Filter, find, and book a free doorstep pickup."
      >
        <Button asChild variant="hero" size="lg">
          <Link to="/pickup">
            Book a free pickup
            <ArrowRight />
          </Link>
        </Button>
      </PageHeader>

      <section className="bg-background py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Search + controls */}
          <div className="sticky top-16 z-20 -mx-1 rounded-2xl border border-border bg-background/85 p-3 shadow-soft backdrop-blur-xl">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-11 pl-10"
                  placeholder="Search car scrap, copper, fridge…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="hidden items-center gap-2.5 lg:flex">
                <FilterControls
                  categories={categories}
                  category={category}
                  setCategory={setCategory}
                  condition={condition}
                  setCondition={setCondition}
                  sort={sort}
                  setSort={setSort}
                />
              </div>

              <Button
                variant="outline"
                className="h-11 lg:hidden"
                onClick={() => setShowFilters((s) => !s)}
              >
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFilters > 0 && (
                  <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {activeFilters}
                  </span>
                )}
              </Button>
            </div>

            {showFilters && (
              <div className="mt-3 grid gap-2.5 sm:grid-cols-3 lg:hidden">
                <FilterControls
                  categories={categories}
                  category={category}
                  setCategory={setCategory}
                  condition={condition}
                  setCondition={setCondition}
                  sort={sort}
                  setSort={setSort}
                />
              </div>
            )}
          </div>

          {/* Results meta */}
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading ? "Loading listings…" : `${results.length} listing${results.length === 1 ? "" : "s"}`}
            </p>
            {(category !== "all" || condition !== "all" || search) && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("all");
                  setCondition("all");
                }}
                className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                <Filter className="size-3.5" /> Clear filters
              </button>
            )}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="aspect-[4/3] animate-pulse bg-secondary" />
                  <div className="space-y-2 p-4">
                    <div className="h-4 w-3/4 animate-pulse rounded bg-secondary" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-secondary" />
                  </div>
                </div>
              ))}
            </div>
          ) : results.length === 0 ? (
            <div className="mt-10 rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <Package className="mx-auto size-10 text-muted-foreground" />
              <h2 className="mt-4 text-xl font-bold">No listings match your search</h2>
              <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                Try a different keyword or clear the filters. New scrap is added regularly.
              </p>
              <Button asChild variant="hero" className="mt-6">
                <Link to="/pickup">Book a pickup instead</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {results.map((listing, i) => (
                <Reveal key={listing.id} delay={(i % 4) * 0.04}>
                  <Link
                    to="/listings/$slug"
                    params={{ slug: listing.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                      {listing.images[0] ? (
                        <img
                          src={listing.images[0]}
                          alt={listing.title}
                          loading="lazy"
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex size-full items-center justify-center text-muted-foreground">
                          <Package className="size-10" />
                        </div>
                      )}
                      {listing.featured && (
                        <span className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[11px] font-bold text-primary-foreground shadow">
                          <Star className="size-3 fill-current" /> Featured
                        </span>
                      )}
                      <span className="absolute right-2.5 top-2.5 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-bold text-foreground shadow backdrop-blur">
                        {conditionLabel(listing.condition)}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
                        <Tag className="size-3" />
                        {catName(listing.category_id) || "Scrap"}
                        {listing.subcategory ? ` · ${listing.subcategory}` : ""}
                      </div>
                      <h3 className="mt-1.5 line-clamp-2 font-bold leading-snug group-hover:text-primary">
                        {listing.title}
                      </h3>
                      {listing.location && (
                        <p className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3.5" /> {listing.location}
                        </p>
                      )}

                      <div className="mt-auto flex items-end justify-between pt-4">
                        <div>
                          <span className="text-lg font-extrabold text-primary">
                            {formatListingPrice(listing.price)}
                          </span>
                          {listing.price && /^\d/.test(listing.price.trim()) && (
                            <span className="ml-1 text-xs text-muted-foreground">{listing.unit}</span>
                          )}
                        </div>
                        <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <ArrowRight className="size-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilterControls({
  categories,
  category,
  setCategory,
  condition,
  setCondition,
  sort,
  setSort,
}: {
  categories: { id: string; name: string }[];
  category: string;
  setCategory: (v: string) => void;
  condition: string;
  setCondition: (v: string) => void;
  sort: SortKey;
  setSort: (v: SortKey) => void;
}) {
  return (
    <>
      <Select value={category} onValueChange={setCategory}>
        <SelectTrigger className="h-11 lg:w-44">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All categories</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={condition} onValueChange={setCondition}>
        <SelectTrigger className="h-11 lg:w-40">
          <SelectValue placeholder="Condition" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Any condition</SelectItem>
          {CONDITIONS.map((c) => (
            <SelectItem key={c.value} value={c.value}>
              {c.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
        <SelectTrigger className="h-11 lg:w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest first</SelectItem>
          <SelectItem value="price-low">Price: low to high</SelectItem>
          <SelectItem value="price-high">Price: high to low</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
