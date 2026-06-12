import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { serviceLocalities } from "@/lib/bangalore-data";

export type ServiceLocation = {
  id: string;
  location_type: "pincode" | "area";
  pincode: string | null;
  area: string | null;
  active: boolean;
  sort_order: number;
};

export type PublicAvailability = {
  locations: ServiceLocation[];
  pincodes: Set<string>;
};

const fallbackLocations: ServiceLocation[] = serviceLocalities.map((locality, index) => ({
  id: `${locality.pincode}-${locality.name}`,
  location_type: "area",
  pincode: locality.pincode,
  area: locality.name,
  active: true,
  sort_order: index + 1,
}));

function toAvailability(locations: ServiceLocation[]): PublicAvailability {
  return {
    locations,
    pincodes: new Set(
      locations
        .filter((location) => location.active && location.pincode)
        .map((location) => location.pincode as string),
    ),
  };
}

export const fallbackAvailability = toAvailability(fallbackLocations);

export function isPincodeAvailable(pincode: string, availability = fallbackAvailability) {
  return availability.pincodes.has(pincode.trim());
}

export function useServiceAvailability() {
  return useQuery({
    queryKey: ["service-availability", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("service_locations")
        .select("id, location_type, pincode, area, active, sort_order")
        .eq("active", true)
        .order("sort_order", { ascending: true })
        .order("pincode", { ascending: true });
      if (error) throw error;
      return toAvailability(data as ServiceLocation[]);
    },
    placeholderData: fallbackAvailability,
    staleTime: 60_000,
  });
}
