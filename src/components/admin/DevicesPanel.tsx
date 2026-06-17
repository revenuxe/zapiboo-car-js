import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Inbox, Laptop, Layers, Loader2, SlidersHorizontal, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BrandsManager } from "@/components/admin/devices/BrandsManager";
import { SeriesManager } from "@/components/admin/devices/SeriesManager";
import { ModelsManager } from "@/components/admin/devices/ModelsManager";
import { PricingManager } from "@/components/admin/devices/PricingManager";
import { DeviceOrdersManager } from "@/components/admin/devices/DeviceOrdersManager";
import type { DeviceCategory } from "@/lib/device-buyback";

const SUBTABS = [
  { value: "orders", label: "Orders", icon: Inbox },
  { value: "brands", label: "Brands", icon: Tag },
  { value: "series", label: "Series", icon: Layers },
  { value: "models", label: "Models", icon: Laptop },
  { value: "pricing", label: "Buying price", icon: SlidersHorizontal },
] as const;

export function DevicesPanel() {
  const [categoryId, setCategoryId] = useState("");
  const [tab, setTab] = useState<(typeof SUBTABS)[number]["value"]>("orders");

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin", "device_categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_categories")
        .select("id, name, slug, icon, active, sort_order")
        .order("sort_order");
      if (error) throw error;
      return data as DeviceCategory[];
    },
  });

  useEffect(() => {
    if (!categoryId && categories.length) setCategoryId(categories[0].id);
  }, [categories, categoryId]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-bold">Device buyback</h2>
          <p className="text-xs text-muted-foreground">
            Manage the sell-your-device catalog, pricing and orders.
          </p>
        </div>
        <Select value={categoryId} onValueChange={setCategoryId}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-1.5 overflow-x-auto rounded-xl bg-secondary p-1">
        {SUBTABS.map((t) => {
          const Icon = t.icon;
          const activeTab = tab === t.value;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab
                  ? "bg-background text-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="size-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {!categoryId ? (
        <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          No device categories found.
        </p>
      ) : (
        <div>
          {tab === "orders" && <DeviceOrdersManager />}
          {tab === "brands" && <BrandsManager categoryId={categoryId} />}
          {tab === "series" && <SeriesManager categoryId={categoryId} />}
          {tab === "models" && <ModelsManager categoryId={categoryId} />}
          {tab === "pricing" && <PricingManager categoryId={categoryId} />}
        </div>
      )}
    </div>
  );
}
