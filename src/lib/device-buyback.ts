import { queryOptions, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export { compressImage, slugify } from "@/lib/scrap-listings";

// Combined category + brands lookup by slug — one round trip, cacheable, used
// by loaders to warm the cache before the homepage / funnel render.
export function categoryWithBrandsQuery(slug: string) {
  return queryOptions({
    queryKey: ["device", "categoryWithBrands", slug],
    queryFn: async () => {
      const { data: cat, error: catErr } = await supabase
        .from("device_categories")
        .select("id, name, slug, icon, active, sort_order")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();
      if (catErr) throw catErr;
      if (!cat) return { category: null as DeviceCategory | null, brands: [] as DeviceBrand[] };
      const { data: brands, error: bErr } = await supabase
        .from("device_brands")
        .select("id, category_id, name, slug, logo, platform, active, sort_order")
        .eq("category_id", cat.id)
        .eq("active", true)
        .order("sort_order");
      if (bErr) throw bErr;
      return { category: cat as DeviceCategory, brands: (brands ?? []) as DeviceBrand[] };
    },
    staleTime: 5 * 60_000,
    gcTime: 30 * 60_000,
  });
}

export function useCategoryWithBrands(slug: string) {
  return useQuery(categoryWithBrandsQuery(slug));
}

// ---------------- Types ----------------
export type DeviceCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  active: boolean;
  sort_order: number;
};

export type DeviceBrand = {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  logo: string | null;
  platform: string;
  active: boolean;
  sort_order: number;
};

export type DeviceSeries = {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  image: string | null;
  active: boolean;
  sort_order: number;
};

export type DeviceModel = {
  id: string;
  series_id: string;
  name: string;
  slug: string;
  base_price: number;
  year: number | null;
  image: string | null;
  active: boolean;
  sort_order: number;
};

export type OptionKind = "deduct_fixed" | "deduct_percent" | "bonus_fixed";

export type ConditionOption = {
  id: string;
  group_id: string;
  label: string;
  description: string | null;
  kind: OptionKind;
  value: number;
  sort_order: number;
};

export type ConditionGroup = {
  id: string;
  category_id: string;
  key: string;
  title: string;
  subtitle: string | null;
  selection: "single" | "multi";
  step_order: number;
  active: boolean;
  options?: ConditionOption[];
};

// Configuration specs (processor / RAM / storage / GPU).
export type SpecOption = ConditionOption & {
  // Processor family (used to branch the next question, e.g. Intel vs AMD generation).
  family?: string | null;
};

export type SpecGroup = {
  id: string;
  category_id: string;
  platform: string | null; // null = all platforms, else 'apple' | 'windows'
  key: string;
  title: string;
  subtitle: string | null;
  selection: "single" | "multi";
  step_order: number;
  active: boolean;
  // If set, group only shows when a spec option with matching family is selected
  // (e.g. Intel-generation group depends on family = 'intel').
  depends_family?: string | null;
  options?: SpecOption[];
};

export type DeviceOrder = {
  id: string;
  category_id: string | null;
  model_id: string | null;
  category_name: string | null;
  brand_name: string | null;
  series_name: string | null;
  model_name: string | null;
  base_price: number;
  final_price: number;
  selections: OrderSelection[];
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  pincode: string | null;
  preferred_date: string | null;
  slot: string | null;
  notes: string | null;
  status: string;
  user_id: string | null;
  created_at: string;
};

export type OrderSelection = {
  group: string;
  option: string;
  kind: OptionKind;
  value: number;
  impact: number; // signed rupee impact on the quote
};

export const KIND_OPTIONS: { value: OptionKind; label: string; hint: string }[] = [
  { value: "deduct_fixed", label: "Deduct ₹ (fixed)", hint: "Subtracts a flat amount" },
  { value: "deduct_percent", label: "Deduct % of base", hint: "Subtracts a % of base price" },
  { value: "bonus_fixed", label: "Add ₹ (bonus)", hint: "Adds a flat amount" },
];

export const ORDER_STATUSES = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "scheduled", label: "Scheduled" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
  { value: "rejected", label: "Rejected" },
] as const;

export function statusLabel(value: string) {
  return ORDER_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export function formatPrice(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

// ---------------- Quote engine (Cashify-style) ----------------
export function optionImpact(base: number, kind: OptionKind, value: number): number {
  switch (kind) {
    case "deduct_fixed":
      return -value;
    case "deduct_percent":
      return -(base * value) / 100;
    case "bonus_fixed":
      return value;
    default:
      return 0;
  }
}

export type SelectedOption = { kind: OptionKind; value: number; label: string; group: string };

// Age-based depreciation table (fraction of the config value removed).
export function ageDepreciation(year?: number | null): { years: number; rate: number } {
  if (!year) return { years: 0, rate: 0 };
  const age = new Date().getFullYear() - year;
  if (age <= 0) return { years: 0, rate: 0 };
  if (age === 1) return { years: 1, rate: 0.08 };
  if (age === 2) return { years: 2, rate: 0.15 };
  if (age === 3) return { years: 3, rate: 0.25 };
  if (age === 4) return { years: 4, rate: 0.32 };
  return { years: age, rate: 0.38 };
}

export type QuoteInput = {
  base: number;
  year?: number | null;
  specs?: SelectedOption[]; // configuration impacts (processor / ram / storage / gpu)
  conditions?: SelectedOption[]; // physical / functional condition impacts
};

export type QuoteResult = { final: number; base: number; breakdown: OrderSelection[] };

// Pipeline: base + Σ spec impacts → apply age depreciation → − Σ condition impacts → floor & round.
export function calculateQuote(input: QuoteInput | number, legacy?: SelectedOption[]): QuoteResult {
  // Back-compat: calculateQuote(base, selectedOptions)
  const norm: QuoteInput =
    typeof input === "number" ? { base: input, conditions: legacy ?? [] } : input;

  const base = norm.base;
  const specs = norm.specs ?? [];
  const conditions = norm.conditions ?? [];
  const breakdown: OrderSelection[] = [];
  let total = base;

  // 1) Configuration deltas (relative to base/reference config)
  for (const s of specs) {
    const impact = optionImpact(base, s.kind, s.value);
    total += impact;
    breakdown.push({ group: s.group, option: s.label, kind: s.kind, value: s.value, impact });
  }

  // 2) Age depreciation on the configured value
  const { years, rate } = ageDepreciation(norm.year);
  if (rate > 0) {
    const ageImpact = -Math.round(total * rate);
    total += ageImpact;
    breakdown.push({
      group: "Age",
      option: `${years}+ year${years > 1 ? "s" : ""} old`,
      kind: "deduct_percent",
      value: Math.round(rate * 100),
      impact: ageImpact,
    });
  }

  // 3) Condition & accessory adjustments
  for (const c of conditions) {
    const impact = optionImpact(base, c.kind, c.value);
    total += impact;
    breakdown.push({ group: c.group, option: c.label, kind: c.kind, value: c.value, impact });
  }

  // Floor so a quote never goes absurdly low; round to nearest ₹100.
  const floor = Math.max(0, Math.round(base * 0.05));
  const final = Math.max(floor, Math.round(total / 100) * 100);
  return { final, base, breakdown };
}

// ---------------- Public read hooks ----------------
export function useDeviceCategory(slug: string) {
  return useQuery({
    queryKey: ["device", "category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_categories")
        .select("id, name, slug, icon, active, sort_order")
        .eq("slug", slug)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      return (data as DeviceCategory) ?? null;
    },
    staleTime: 5 * 60_000,
  });
}

export function useDeviceBrands(categoryId?: string) {
  return useQuery({
    queryKey: ["device", "brands", categoryId],
    enabled: !!categoryId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_brands")
        .select("id, category_id, name, slug, logo, platform, active, sort_order")
        .eq("category_id", categoryId!)
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as DeviceBrand[];
    },
    staleTime: 5 * 60_000,
  });
}

export function useDeviceSeries(brandId?: string) {
  return useQuery({
    queryKey: ["device", "series", brandId],
    enabled: !!brandId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_series")
        .select("id, brand_id, name, slug, image, active, sort_order")
        .eq("brand_id", brandId!)
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as DeviceSeries[];
    },
    staleTime: 5 * 60_000,
  });
}

export function useDeviceModels(seriesId?: string) {
  return useQuery({
    queryKey: ["device", "models", seriesId],
    enabled: !!seriesId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_models")
        .select("id, series_id, name, slug, base_price, year, image, active, sort_order")
        .eq("series_id", seriesId!)
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as DeviceModel[];
    },
    staleTime: 5 * 60_000,
  });
}

export type BrandWithSeries = DeviceBrand & { series: DeviceSeries[] };

// Brands + their series in one query — powers the SEO "sell by brand" section.
export function useCategoryCatalog(categoryId?: string) {
  return useQuery({
    queryKey: ["device", "catalog", categoryId],
    enabled: !!categoryId,
    queryFn: async () => {
      const { data: brands, error: bErr } = await supabase
        .from("device_brands")
        .select("id, category_id, name, slug, logo, platform, active, sort_order")
        .eq("category_id", categoryId!)
        .eq("active", true)
        .order("sort_order");
      if (bErr) throw bErr;
      const brandIds = (brands ?? []).map((b) => b.id);
      let series: DeviceSeries[] = [];
      if (brandIds.length) {
        const { data: s, error: sErr } = await supabase
          .from("device_series")
          .select("id, brand_id, name, slug, image, active, sort_order")
          .in("brand_id", brandIds)
          .eq("active", true)
          .order("sort_order");
        if (sErr) throw sErr;
        series = s as DeviceSeries[];
      }
      return (brands as DeviceBrand[]).map((b) => ({
        ...b,
        series: series.filter((s) => s.brand_id === b.id),
      })) as BrandWithSeries[];
    },
    staleTime: 5 * 60_000,
  });
}

// ---------------- Slug lookups (for multi-page funnel) ----------------
export function useDeviceBrandBySlug(categoryId?: string, slug?: string) {
  return useQuery({
    queryKey: ["device", "brand-by-slug", categoryId, slug],
    enabled: !!categoryId && !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_brands")
        .select("id, category_id, name, slug, logo, platform, active, sort_order")
        .eq("category_id", categoryId!)
        .eq("slug", slug!)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      return (data as DeviceBrand) ?? null;
    },
    staleTime: 5 * 60_000,
  });
}

export function useDeviceSeriesBySlug(brandId?: string, slug?: string) {
  return useQuery({
    queryKey: ["device", "series-by-slug", brandId, slug],
    enabled: !!brandId && !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_series")
        .select("id, brand_id, name, slug, image, active, sort_order")
        .eq("brand_id", brandId!)
        .eq("slug", slug!)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      return (data as DeviceSeries) ?? null;
    },
    staleTime: 5 * 60_000,
  });
}

export function useDeviceModelBySlug(seriesId?: string, slug?: string) {
  return useQuery({
    queryKey: ["device", "model-by-slug", seriesId, slug],
    enabled: !!seriesId && !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_models")
        .select("id, series_id, name, slug, base_price, year, image, active, sort_order")
        .eq("series_id", seriesId!)
        .eq("slug", slug!)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      return (data as DeviceModel) ?? null;
    },
    staleTime: 5 * 60_000,
  });
}

export function useConditionGroups(categoryId?: string) {
  return useQuery({
    queryKey: ["device", "conditions", categoryId],
    enabled: !!categoryId,
    queryFn: async () => {
      const { data: groups, error } = await supabase
        .from("condition_groups")
        .select("id, category_id, key, title, subtitle, selection, step_order, active")
        .eq("category_id", categoryId!)
        .eq("active", true)
        .order("step_order");
      if (error) throw error;
      const ids = (groups ?? []).map((g) => g.id);
      let options: ConditionOption[] = [];
      if (ids.length) {
        const { data: opts, error: optErr } = await supabase
          .from("condition_options")
          .select("id, group_id, label, description, kind, value, sort_order")
          .in("group_id", ids)
          .order("sort_order");
        if (optErr) throw optErr;
        options = opts as ConditionOption[];
      }
      return (groups as ConditionGroup[]).map((g) => ({
        ...g,
        options: options.filter((o) => o.group_id === g.id),
      }));
    },
    staleTime: 5 * 60_000,
  });
}

// Spec (configuration) groups for a category, filtered to the brand's platform.
// platform IS NULL groups apply to every platform.
export function useSpecGroups(categoryId?: string, platform?: string | null) {
  return useQuery({
    queryKey: ["device", "specs", categoryId, platform ?? "all"],
    enabled: !!categoryId,
    queryFn: async () => {
      let q = supabase
        .from("spec_groups")
        .select("id, category_id, platform, key, title, subtitle, selection, step_order, active, depends_family")
        .eq("category_id", categoryId!)
        .eq("active", true);
      if (platform) {
        q = q.or(`platform.is.null,platform.eq.${platform}`);
      } else {
        q = q.is("platform", null);
      }
      const { data: groups, error } = await q.order("step_order");
      if (error) throw error;
      const ids = (groups ?? []).map((g) => g.id);
      let options: SpecOption[] = [];
      if (ids.length) {
        const { data: opts, error: optErr } = await supabase
          .from("spec_options")
          .select("id, group_id, label, description, kind, value, sort_order, family")
          .in("group_id", ids)
          .order("sort_order");
        if (optErr) throw optErr;
        options = opts as SpecOption[];
      }
      return (groups as SpecGroup[]).map((g) => ({
        ...g,
        options: options.filter((o) => o.group_id === g.id),
      }));
    },
    staleTime: 5 * 60_000,
  });
}

// ---------------- Combined single-round-trip resolver ----------------
// Server RPC returns category + brand + series + model + spec_groups + condition_groups
// in ONE request. Replaces a 4-level slug waterfall (category → brand → series → model)
// + 2 dependent queries (specs + conditions) with a single fast call.
export type DevicePath = {
  category: DeviceCategory | null;
  brand: DeviceBrand | null;
  series: DeviceSeries | null;
  model: DeviceModel | null;
  specGroups: SpecGroup[];
  conditionGroups: ConditionGroup[];
};

export function useDevicePath(category?: string, brand?: string, series?: string, model?: string) {
  return useQuery({
    queryKey: ["device", "path", category, brand, series, model],
    enabled: !!category && !!brand && !!series && !!model,
    staleTime: 5 * 60_000,
    queryFn: async (): Promise<DevicePath> => {
      // RPC not yet in generated types; cast payload once here.
      const { data, error } = await (supabase.rpc as unknown as (
        fn: string,
        args: Record<string, unknown>,
      ) => Promise<{ data: unknown; error: unknown }>)("resolve_device_path", {
        _category: category,
        _brand: brand,
        _series: series,
        _model: model,
      });
      if (error) throw error as Error;
      const r = (data ?? {}) as {
        category?: DeviceCategory;
        brand?: DeviceBrand;
        series?: DeviceSeries;
        model?: DeviceModel;
        spec_groups?: SpecGroup[];
        condition_groups?: ConditionGroup[];
      };
      return {
        category: r.category ?? null,
        brand: r.brand ?? null,
        series: r.series ?? null,
        model: r.model ?? null,
        specGroups: r.spec_groups ?? [],
        conditionGroups: r.condition_groups ?? [],
      };
    },
  });
}

// Compute which spec groups the user should see, given their current selections.
// A group with `depends_family` (e.g. Intel-generation) shows only when the user
// has selected a spec option carrying that family (e.g. Intel processor).
export function filterVisibleSpecGroups(
  groups: SpecGroup[],
  selections: Record<string, string[]>,
): SpecGroup[] {
  const activeFamilies = new Set<string>();
  for (const g of groups) {
    for (const optId of selections[g.id] ?? []) {
      const opt = g.options?.find((o) => o.id === optId);
      if (opt?.family) activeFamilies.add(opt.family);
    }
  }
  return groups.filter((g) => !g.depends_family || activeFamilies.has(g.depends_family));
}
