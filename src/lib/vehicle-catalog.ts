import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type VehicleBrand = {
  id: string;
  slug: string;
  name: string;
  vehicle_type: string;
  logo_url: string | null;
  sort_order: number;
  active: boolean;
};

export type VehicleModel = {
  id: string;
  brand_id: string;
  slug: string;
  name: string;
  body_type: string | null;
  sort_order: number;
  active: boolean;
};

export type VehicleVariant = {
  id: string;
  model_id: string;
  name: string;
  fuel_type: string | null;
  transmission: string | null;
  sort_order: number;
  active: boolean;
};

const BRAND_COLS = "id, slug, name, vehicle_type, logo_url, sort_order, active";
const MODEL_COLS = "id, brand_id, slug, name, body_type, sort_order, active";
const VARIANT_COLS = "id, model_id, name, fuel_type, transmission, sort_order, active";

/** Brands for a vehicle category (car / bike / scooter / commercial). */
export function useVehicleBrands(vehicleType?: string, options?: { includeInactive?: boolean }) {
  const includeInactive = options?.includeInactive ?? false;
  return useQuery({
    queryKey: ["vehicle-brands", vehicleType ?? "all", includeInactive],
    queryFn: async () => {
      let q = supabase.from("vehicle_brands").select(BRAND_COLS);
      if (vehicleType) q = q.eq("vehicle_type", vehicleType);
      if (!includeInactive) q = q.eq("active", true);
      const { data, error } = await q
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as VehicleBrand[];
    },
    staleTime: 5 * 60_000,
  });
}

/** Models of one brand. */
export function useVehicleModels(brandId?: string | null, options?: { includeInactive?: boolean }) {
  const includeInactive = options?.includeInactive ?? false;
  return useQuery({
    queryKey: ["vehicle-models", brandId ?? "none", includeInactive],
    enabled: !!brandId,
    queryFn: async () => {
      let q = supabase.from("vehicle_models").select(MODEL_COLS).eq("brand_id", brandId as string);
      if (!includeInactive) q = q.eq("active", true);
      const { data, error } = await q
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as VehicleModel[];
    },
    staleTime: 5 * 60_000,
  });
}

/** Variants of one model (optional level). */
export function useVehicleVariants(modelId?: string | null, options?: { includeInactive?: boolean }) {
  const includeInactive = options?.includeInactive ?? false;
  return useQuery({
    queryKey: ["vehicle-variants", modelId ?? "none", includeInactive],
    enabled: !!modelId,
    queryFn: async () => {
      let q = supabase
        .from("vehicle_variants")
        .select(VARIANT_COLS)
        .eq("model_id", modelId as string);
      if (!includeInactive) q = q.eq("active", true);
      const { data, error } = await q
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return (data ?? []) as VehicleVariant[];
    },
    staleTime: 5 * 60_000,
  });
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const vehicleTypeOptions = [
  { value: "car", label: "Car" },
  { value: "bike", label: "Bike" },
  { value: "scooter", label: "Scooter" },
  { value: "commercial", label: "Commercial vehicle" },
] as const;
