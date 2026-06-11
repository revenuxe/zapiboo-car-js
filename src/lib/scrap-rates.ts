import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { householdRates } from "@/lib/bangalore-data";

export type ScrapCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  active: boolean;
};

export type ScrapRate = {
  id: string;
  category_id: string | null;
  name: string;
  price: string;
  unit: string;
  note: string | null;
  sort_order: number;
  active: boolean;
};

/** Render a stored price string. Numeric values get a ₹ prefix; words (e.g. "Quoted") pass through. */
export function formatPrice(price: string) {
  return /^\d/.test(price.trim()) ? `₹${price.trim()}` : price.trim();
}

export async function fetchActiveRates(): Promise<ScrapRate[]> {
  const { data, error } = await supabase
    .from("scrap_rates")
    .select("id, category_id, name, price, unit, note, sort_order, active")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as ScrapRate[];
}

export async function fetchActiveCategories(): Promise<ScrapCategory[]> {
  const { data, error } = await supabase
    .from("scrap_categories")
    .select("id, name, slug, icon, sort_order, active")
    .eq("active", true)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data as ScrapCategory[];
}

/** Fallback used for SSR / first paint so prices never appear empty. */
const fallbackRates = householdRates.map((r, i) => ({
  id: `fallback-${i}`,
  category_id: null,
  name: r.name,
  price: r.price.replace("₹", ""),
  unit: r.unit,
  note: r.note ?? null,
  sort_order: i,
  active: true,
})) as ScrapRate[];

/** Live scrap rates for public pages, with the static list as instant fallback. */
export function useScrapRates() {
  return useQuery({
    queryKey: ["scrap-rates", "active"],
    queryFn: fetchActiveRates,
    placeholderData: fallbackRates,
    staleTime: 60_000,
  });
}
