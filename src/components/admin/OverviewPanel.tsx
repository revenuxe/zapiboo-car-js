import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Clock3, Layers, Laptop, Loader2, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { statusLabel } from "@/lib/device-buyback";

const statusStyles: Record<string, string> = {
  new: "bg-secondary text-foreground",
  contacted: "bg-amber-500/15 text-amber-600",
  scheduled: "bg-accent text-primary",
  paid: "bg-gradient-brand text-primary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
  rejected: "bg-destructive/10 text-destructive",
};

type Stats = {
  totalOrders: number;
  newOrders: number;
  paidOrders: number;
  activeCategories: number;
  recent: {
    id: string;
    name: string | null;
    model_name: string | null;
    status: string;
    created_at: string;
  }[];
};

export function OverviewPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "device-overview"],
    queryFn: async (): Promise<Stats> => {
      const [ordersRes, catsRes, recentRes] = await Promise.all([
        supabase.from("device_orders").select("status"),
        supabase.from("device_categories").select("id", { count: "exact", head: true }).eq("active", true),
        supabase
          .from("device_orders")
          .select("id, name, model_name, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      if (ordersRes.error) throw ordersRes.error;
      if (catsRes.error) throw catsRes.error;
      if (recentRes.error) throw recentRes.error;

      const orders = (ordersRes.data ?? []) as { status: string }[];
      return {
        totalOrders: orders.length,
        newOrders: orders.filter((o) => o.status === "new" || o.status === "contacted").length,
        paidOrders: orders.filter((o) => o.status === "paid").length,
        activeCategories: catsRes.count ?? 0,
        recent: (recentRes.data ?? []) as Stats["recent"],
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

      <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
        <p className="flex items-center gap-2 text-sm font-bold">
          <TrendingUp className="size-4 text-primary" /> Latest laptop orders
        </p>
        {data.recent.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No laptop orders yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {data.recent.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{r.name ?? "Customer"}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.model_name ?? "Laptop"} · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                    statusStyles[r.status] ?? "bg-secondary text-foreground"
                  }`}
                >
                  {statusLabel(r.status)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
