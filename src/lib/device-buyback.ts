import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
export { compressImage, slugify } from "@/lib/scrap-listings";

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
  active: boolean;
  sort_order: number;
};

export type DeviceSeries = {
  id: string;
  brand_id: string;
  name: string;
  slug: string;
  active: boolean;
  sort_order: number;
};

export type DeviceModel = {
  id: string;
  series_id: string;
  name: string;
  slug: string;
  base_price: number;
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
  { value: "rejected", label: "Rejected" },
] as const;

export function statusLabel(value: string) {
  return ORDER_STATUSES.find((s) => s.value === value)?.label ?? value;
}

export function formatPrice(n: number) {
  return `₹${Math.round(n).toLocaleString("en-IN")}`;
}

// ---------------- Quote engine ----------------
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

export function calculateQuote(
  base: number,
  selected: { kind: OptionKind; value: number; label: string; group: string }[],
) {
  let total = base;
  const breakdown: OrderSelection[] = [];
  for (const s of selected) {
    const impact = optionImpact(base, s.kind, s.value);
    total += impact;
    breakdown.push({ group: s.group, option: s.label, kind: s.kind, value: s.value, impact });
  }
  // Floor so a quote never goes absurdly low; round to nearest 50.
  const floor = Math.max(0, Math.round(base * 0.05));
  const final = Math.max(floor, Math.round(total / 50) * 50);
  return { final, breakdown };
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
    staleTime: 60_000,
  });
}

export function useDeviceBrands(categoryId?: string) {
  return useQuery({
    queryKey: ["device", "brands", categoryId],
    enabled: !!categoryId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_brands")
        .select("id, category_id, name, slug, logo, active, sort_order")
        .eq("category_id", categoryId!)
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as DeviceBrand[];
    },
    staleTime: 60_000,
  });
}

export function useDeviceSeries(brandId?: string) {
  return useQuery({
    queryKey: ["device", "series", brandId],
    enabled: !!brandId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_series")
        .select("id, brand_id, name, slug, active, sort_order")
        .eq("brand_id", brandId!)
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as DeviceSeries[];
    },
    staleTime: 60_000,
  });
}

export function useDeviceModels(seriesId?: string) {
  return useQuery({
    queryKey: ["device", "models", seriesId],
    enabled: !!seriesId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_models")
        .select("id, series_id, name, slug, base_price, image, active, sort_order")
        .eq("series_id", seriesId!)
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as DeviceModel[];
    },
    staleTime: 60_000,
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
        .select("id, category_id, name, slug, logo, active, sort_order")
        .eq("category_id", categoryId!)
        .eq("slug", slug!)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      return (data as DeviceBrand) ?? null;
    },
    staleTime: 60_000,
  });
}

export function useDeviceSeriesBySlug(brandId?: string, slug?: string) {
  return useQuery({
    queryKey: ["device", "series-by-slug", brandId, slug],
    enabled: !!brandId && !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_series")
        .select("id, brand_id, name, slug, active, sort_order")
        .eq("brand_id", brandId!)
        .eq("slug", slug!)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      return (data as DeviceSeries) ?? null;
    },
    staleTime: 60_000,
  });
}

export function useDeviceModelBySlug(seriesId?: string, slug?: string) {
  return useQuery({
    queryKey: ["device", "model-by-slug", seriesId, slug],
    enabled: !!seriesId && !!slug,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_models")
        .select("id, series_id, name, slug, base_price, image, active, sort_order")
        .eq("series_id", seriesId!)
        .eq("slug", slug!)
        .eq("active", true)
        .maybeSingle();
      if (error) throw error;
      return (data as DeviceModel) ?? null;
    },
    staleTime: 60_000,
  });
}
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
    staleTime: 60_000,
  });
}
