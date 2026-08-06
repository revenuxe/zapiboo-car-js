import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock3, Layers, Laptop, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  totalOrders: number;
  newOrders: number;
  paidOrders: number;
  activeCategories: number;
};

export function OverviewPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "device-overview"],
    queryFn: async (): Promise<Stats> => {
      const [ordersRes, catsRes] = await Promise.all([
        supabase.from("device_orders").select("status"),
        supabase.from("device_categories").select("id", { count: "exact", head: true }).eq("active", true),
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (catsRes.error) throw catsRes.error;

      const orders = (ordersRes.data ?? []) as { status: string }[];
      return {
        totalOrders: orders.length,
        newOrders: orders.filter((o) => o.status === "new" || o.status === "contacted").length,
        paidOrders: orders.filter((o) => o.status === "paid").length,
        activeCategories: catsRes.count ?? 0,
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

  const cards = [
    { label: "Total laptop orders", value: data.totalOrders, icon: Laptop },
    { label: "New / contacted", value: data.newOrders, icon: Clock3 },
    { label: "Paid orders", value: data.paidOrders, icon: CheckCircle2 },
    { label: "Active device categories", value: data.activeCategories, icon: Layers },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map((c) => (
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
