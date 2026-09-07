import Link from "next/link";
import { ArrowUpRight, Bike, Car, ChevronRight } from "lucide-react";
import { modelPath, sellingModels, type ModelCategory } from "@/lib/selling-models";

const groups: { category: ModelCategory; title: string; guide: string }[] = [
  { category: "car", title: "Cars & SUVs", guide: "/sell-used-car-bangalore" },
  { category: "bike", title: "Bikes", guide: "/sell-used-bike-bangalore" },
  { category: "scooter", title: "Scooters", guide: "/sell-used-scooter-bangalore" },
];

export function SellByModel() {
  return (
    <section
      aria-labelledby="sell-by-model-title"
      className="border-t border-border bg-background px-4 py-12 sm:px-6 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              Find your vehicle
            </p>
            <h2
              id="sell-by-model-title"
              className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Sell by model
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Explore selling advice for your model, prepare for an inspection and take the next
              step in Bangalore.
            </p>
          </div>
          <Link
            href="/pickup"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary"
          >
            Can't find your model?
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <nav aria-label="Sell by model" className="grid gap-5 lg:grid-cols-[1.4fr_1fr_1fr]">
          {groups.map(({ category, title, guide }) => {
            const Icon = category === "car" ? Car : Bike;
            return (
              <div
                key={category}
                className="rounded-2xl border border-border bg-secondary/25 p-5 sm:p-6"
              >
                <div className="mb-5 flex items-center gap-3">
                  <span className="rounded-xl bg-primary/10 p-2.5 text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <h3 className="text-lg font-bold">{title}</h3>
                </div>
                <ul className={`grid gap-x-5 ${category === "car" ? "sm:grid-cols-2" : ""}`}>
                  {sellingModels
                    .filter((model) => model.category === category)
                    .map((model) => (
                      <li key={model.slug}>
                        <Link
                          href={modelPath(model)}
                          prefetch={false}
                          className="flex min-h-12 items-center justify-between gap-2 border-t border-border py-3 text-sm font-medium transition-colors hover:text-primary"
                        >
                          {model.shortName}
                          <ChevronRight
                            aria-hidden="true"
                            className="size-4 shrink-0 text-muted-foreground"
                          />
                        </Link>
                      </li>
                    ))}
                </ul>
                <Link
                  href={guide}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-primary"
                >
                  {category === "car" ? "Car" : category === "bike" ? "Bike" : "Scooter"} selling
                  guide
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
