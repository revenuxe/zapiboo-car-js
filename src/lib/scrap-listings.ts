import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type ScrapListing = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  subcategory: string | null;
  condition: string;
  price: string | null;
  unit: string;
  quantity: string | null;
  location: string | null;
  images: string[];
  featured: boolean;
  active: boolean;
  sort_order: number;
  created_at: string;
};

const LISTING_COLUMNS =
  "id, title, slug, description, category_id, subcategory, condition, price, unit, quantity, location, images, featured, active, sort_order, created_at";

export const CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like new" },
  { value: "used", label: "Used" },
  { value: "refurbished", label: "Refurbished" },
  { value: "for-parts", label: "For parts / scrap" },
] as const;

export function conditionLabel(value: string) {
  return CONDITIONS.find((c) => c.value === value)?.label ?? value;
}

/** Render a stored price string. Numeric values get a ₹ prefix; words (e.g. "Quoted") pass through. */
export function formatListingPrice(price: string | null) {
  if (!price || !price.trim()) return "Price on request";
  const trimmed = price.trim();
  return /^\d/.test(trimmed) ? `₹${trimmed}` : trimmed;
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function fetchActiveListings(): Promise<ScrapListing[]> {
  const { data, error } = await supabase
    .from("scrap_listings")
    .select(LISTING_COLUMNS)
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as ScrapListing[];
}

export async function fetchListingBySlug(slug: string): Promise<ScrapListing | null> {
  const { data, error } = await supabase
    .from("scrap_listings")
    .select(LISTING_COLUMNS)
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();
  if (error) throw error;
  return (data as ScrapListing) ?? null;
}

export function useActiveListings() {
  return useQuery({
    queryKey: ["listings", "active"],
    queryFn: fetchActiveListings,
    staleTime: 30_000,
  });
}

export function useListing(slug: string) {
  return useQuery({
    queryKey: ["listings", "detail", slug],
    queryFn: () => fetchListingBySlug(slug),
    staleTime: 30_000,
  });
}

/**
 * Resize + compress an image file to a data URL so photos can be stored inline
 * without a storage bucket. Keeps the longest edge <= maxDim.
 *
 * Transparency is preserved: PNG / SVG / WebP / GIF sources are exported as PNG
 * (with their alpha channel intact) instead of JPEG. JPEG forces a black
 * background onto transparent pixels — that was the cause of logos/photos
 * rendering as solid black. SVGs without an intrinsic size are given a sensible
 * fallback so they don't collapse to a 0x0 (black) canvas.
 */
export function compressImage(file: File, maxDim = 1280, quality = 0.72): Promise<string> {
  const type = (file.type || "").toLowerCase();
  const name = (file.name || "").toLowerCase();
  const isSvg = type === "image/svg+xml" || name.endsWith(".svg");
  const isJpeg = type === "image/jpeg" || type === "image/jpg";
  // Anything that can carry transparency must stay PNG so it doesn't go black.
  const keepAlpha = !isJpeg;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.onload = () => {
      // SVGs are vector + tiny: store the raw data URL instead of rasterising
      // them onto a canvas, which renders them as a solid black box whenever
      // they lack intrinsic width/height.
      if (isSvg) {
        resolve(reader.result as string);
        return;
      }
      const img = new Image();
      img.onerror = () => reject(new Error("Could not load the image."));
      img.onload = () => {
        // SVGs (and some sources) can report 0 dimensions — fall back to maxDim.
        let iw = img.naturalWidth || img.width;
        let ih = img.naturalHeight || img.height;
        if (!iw || !ih) {
          iw = maxDim;
          ih = maxDim;
        }
        const scale = Math.min(1, maxDim / Math.max(iw, ih));
        const w = Math.max(1, Math.round(iw * scale));
        const h = Math.max(1, Math.round(ih * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas is not supported."));
          return;
        }
        ctx.clearRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(keepAlpha ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
