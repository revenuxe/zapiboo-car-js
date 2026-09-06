import { supabase } from "@/integrations/supabase/client";
import { optimizedImageUrl } from "@/lib/image-delivery";

export type CachedVehicleOption = {
  id: string;
  name: string;
  image_url?: string | null;
  category_id?: string | null;
};

type CatalogueCache = {
  savedAt: number;
  categories: CachedVehicleOption[];
  subcategories: CachedVehicleOption[];
  brands: CachedVehicleOption[];
};

const cacheKey = "zapiboo-vehicle-catalogue-v1";
const maxAge = 5 * 60 * 1000;
let memoryCache: CatalogueCache | null = null;
let warmup: Promise<CatalogueCache | null> | null = null;
const preloadedImages = new Set<string>();

function isFresh(cache: CatalogueCache | null): cache is CatalogueCache {
  return Boolean(cache && Date.now() - cache.savedAt < maxAge);
}

function readCache() {
  if (isFresh(memoryCache)) return memoryCache;
  if (typeof window === "undefined") return null;

  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(cacheKey) ?? "null") as CatalogueCache | null;
    memoryCache = isFresh(parsed) ? parsed : null;
  } catch {
    memoryCache = null;
  }
  return memoryCache;
}

function saveCache(cache: CatalogueCache) {
  memoryCache = cache;
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(cacheKey, JSON.stringify(cache));
  } catch {
    // Private browsing may reject session storage; the in-memory cache still works.
  }
}

function preloadCardImages(cache: CatalogueCache) {
  if (typeof window === "undefined") return;
  // These are small, card-sized Cloudinary derivatives. They are fetched in
  // the background so the vehicle-type screen can paint without image delay.
  window.setTimeout(() => {
    [...cache.categories, ...cache.subcategories].forEach((option) => {
      if (!option.image_url) return;
      const url = optimizedImageUrl(option.image_url, 480);
      if (!url || preloadedImages.has(url)) return;
      preloadedImages.add(url);
      const image = new Image();
      image.decoding = "async";
      image.src = url;
    });
  }, 0);
}

export function getCachedVehicleOptions(table: string, categoryId?: string) {
  const cache = readCache();
  if (!cache) return undefined;

  if (table === "vehicle_categories") return cache.categories;
  const options = table === "vehicle_subcategories" ? cache.subcategories : cache.brands;
  return categoryId ? options.filter((option) => option.category_id === categoryId) : options;
}

/** Starts once per browser session and makes the vehicle handoff instant after a homepage tap. */
export function warmVehicleCatalogue() {
  const cached = readCache();
  if (cached) {
    preloadCardImages(cached);
    return Promise.resolve(cached);
  }
  if (warmup) return warmup;

  warmup = Promise.all([
    supabase.from("vehicle_categories").select("id, name, image_url").eq("active", true).order("sort_order").order("name"),
    supabase.from("vehicle_subcategories").select("id, name, image_url, category_id").eq("active", true).order("sort_order").order("name"),
    supabase.from("vehicle_brands").select("id, name, category_id").eq("active", true).order("sort_order").order("name"),
  ])
    .then(([categories, subcategories, brands]) => {
      if (categories.error) throw categories.error;
      if (subcategories.error) throw subcategories.error;
      if (brands.error) throw brands.error;

      const cache: CatalogueCache = {
        savedAt: Date.now(),
        categories: categories.data as CachedVehicleOption[],
        subcategories: subcategories.data as CachedVehicleOption[],
        brands: brands.data as CachedVehicleOption[],
      };
      saveCache(cache);
      preloadCardImages(cache);
      return cache;
    })
    .catch(() => null)
    .finally(() => {
      warmup = null;
    });

  return warmup;
}
