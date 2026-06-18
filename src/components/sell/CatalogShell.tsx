import { Link } from "@tanstack/react-router";
import { ChevronRight, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export type Crumb = {
  label: string;
  to?: string;
  params?: Record<string, string>;
};

export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
      {crumbs.map((c, i) => {
        const last = i === crumbs.length - 1;
        return (
          <span key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {c.to && !last ? (
              <Link
                to={c.to}
                params={c.params as never}
                className="font-medium transition-colors hover:text-primary"
              >
                {c.label}
              </Link>
            ) : (
              <span className={last ? "font-semibold text-foreground" : "font-medium"}>{c.label}</span>
            )}
            {!last && <ChevronRight className="size-3.5 opacity-60" />}
          </span>
        );
      })}
    </nav>
  );
}

export function CatalogShell({
  crumbs,
  logo,
  fallback,
  title,
  subtitle,
  search,
  onSearch,
  searchPlaceholder,
  loading,
  empty,
  emptyText,
  children,
}: {
  crumbs: Crumb[];
  logo?: string | null;
  fallback: React.ReactNode;
  title: string;
  subtitle?: string;
  search?: string;
  onSearch?: (v: string) => void;
  searchPlaceholder?: string;
  loading?: boolean;
  empty?: boolean;
  emptyText?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-secondary/30">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <Breadcrumbs crumbs={crumbs} />

        <div className="mt-6 flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card shadow-soft sm:size-20">
            {logo ? (
              <img src={logo} alt={title} className="max-h-full max-w-full object-contain p-2.5" />
            ) : (
              fallback
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">{title}</h1>
            {subtitle && <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p>}
          </div>
        </div>

        {onSearch && (
          <div className="relative mt-7">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-13 rounded-2xl border-border bg-card pl-12 text-base shadow-soft"
            />
          </div>
        )}

        <div className="mt-7">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="size-7 animate-spin text-primary" />
            </div>
          ) : empty ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-sm text-muted-foreground">
              {emptyText ?? "Nothing here yet."}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>
  );
}
