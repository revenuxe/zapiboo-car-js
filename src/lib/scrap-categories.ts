import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { fetchActiveCategories, type ScrapCategory } from "@/lib/scrap-rates";
import { householdTypes } from "@/lib/bangalore-data";

/** Static fallback so the booking flow never shows an empty list during SSR / first paint. */
const fallbackCategories = householdTypes
  .filter((t) => t.id !== "mixed")
  .map((t, i) => ({
    id: t.id,
    name: t.name,
    slug: t.id,
    icon: null,
    sort_order: i,
    active: true,
  })) as ScrapCategory[];

/** Live scrap categories for public pages (booking wizard), with a static fallback. */
export function useScrapCategories() {
  return useQuery({
    queryKey: ["scrap-categories", "active"],
    queryFn: fetchActiveCategories,
    placeholderData: fallbackCategories,
    staleTime: 60_000,
  });
}

export { supabase };
