import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock3, Layers, Laptop, Loader2, Recycle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  laptopTotalOrders: number;
  laptopNewOrders: number;
  laptopPaidOrders: number;
  laptopActiveCategories: number;
  scrapTotalOrders: number;
  scrapNewOrders: number;
  scrapCompletedOrders: number;
  scrapActiveCategories: number;
};

export function OverviewPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async (): Promise<Stats> => {
      const [deviceOrdersRes, laptopCatsRes, scrapOrdersRes, scrapCatsRes] = await Promise.all([
        supabase.from("device_orders").select("status"),
        supabase.from("device_categories").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("leads").select("status, lead_type, scrap_mode"),
        supabase.from("scrap_categories").select("id", { count: "exact", head: true }).eq("active", true),
      ]);

      if (deviceOrdersRes.error) throw deviceOrdersRes.error;
      if (laptopCatsRes.error) throw laptopCatsRes.error;
      if (scrapOrdersRes.error) throw scrapOrdersRes.error;
      if (scrapCatsRes.error) throw scrapCatsRes.error;

      const laptopOrders = (deviceOrdersRes.data ?? []) as { status: string }[];
      const scrapOrders = (scrapOrdersRes.data ?? []) as { status: string; lead_type: string | null; scrap_mode: string | null }[];
      const scrapBookings = scrapOrders.filter((o) => !(o.lead_type === "query" || o.scrap_mode === "query"));

      return {
        laptopTotalOrders: laptopOrders.length,
        laptopNewOrders: laptopOrders.filter((o) => o.status === "new" || o.status === "contacted").length,
        laptopPaidOrders: laptopOrders.filter((o) => o.status === "paid").length,
        laptopActiveCategories: laptopCatsRes.count ?? 0,
        scrapTotalOrders: scrapBookings.length,
        scrapNewOrders: scrapBookings.filter((o) => o.status === "new" || o.status === "contacted").length,
        scrapCompletedOrders: scrapBookings.filter((o) => o.status === "done").length,
        scrapActiveCategories: scrapCatsRes.count ?? 0,
      };
    },
  });

  if (isLoading || !data) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const laptopCards = [
    { label: "Total laptop orders", value: data.laptopTotalOrders, icon: Laptop },
    { label: "New / contacted", value: data.laptopNewOrders, icon: Clock3 },
    { label: "Paid orders", value: data.laptopPaidOrders, icon: CheckCircle2 },
    { label: "Active device categories", value: data.laptopActiveCategories, icon: Layers },
  ];

  const scrapCards = [
    { label: "Total scrap orders", value: data.scrapTotalOrders, icon: Recycle },
    { label: "New / contacted", value: data.scrapNewOrders, icon: Clock3 },
    { label: "Completed orders", value: data.scrapCompletedOrders, icon: CheckCircle2 },
    { label: "Active scrap categories", value: data.scrapActiveCategories, icon: Layers },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {laptopCards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
              <c.icon className="size-5" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-gradient">{c.value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {scrapCards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
            <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
              <c.icon className="size-5" />
            </div>
            <div className="mt-3 text-2xl font-extrabold text-gradient">{c.value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{c.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
