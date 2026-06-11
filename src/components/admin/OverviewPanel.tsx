import { useQuery } from "@tanstack/react-query";
import {
  ClipboardList,
  Clock3,
  CheckCircle2,
  IndianRupee,
  Layers,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stats = {
  totalLeads: number;
  newLeads: number;
  completedLeads: number;
  activeRates: number;
  activeCategories: number;
  recent: { id: string; name: string; locality: string | null; status: string; created_at: string }[];
};

const statusStyles: Record<string, string> = {
  new: "bg-secondary text-foreground",
  scheduled: "bg-accent text-primary",
  completed: "bg-gradient-brand text-primary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export function OverviewPanel() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: async (): Promise<Stats> => {
      const [leadsRes, ratesRes, catsRes, recentRes] = await Promise.all([
        supabase.from("leads").select("status"),
        supabase.from("scrap_rates").select("id", { count: "exact", head: true }).eq("active", true),
        supabase.from("scrap_categories").select("id", { count: "exact", head: true }).eq("active", true),
        supabase
          .from("leads")
          .select("id, name, locality, status, created_at")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);
      if (leadsRes.error) throw leadsRes.error;
      const leads = (leadsRes.data ?? []) as { status: string }[];
      return {
        totalLeads: leads.length,
        newLeads: leads.filter((l) => l.status === "new").length,
        completedLeads: leads.filter((l) => l.status === "completed").length,
        activeRates: ratesRes.count ?? 0,
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
    { label: "Total bookings", value: data.totalLeads, icon: ClipboardList },
    { label: "New / pending", value: data.newLeads, icon: Clock3 },
    { label: "Completed", value: data.completedLeads, icon: CheckCircle2 },
    { label: "Active rates", value: data.activeRates, icon: IndianRupee },
    { label: "Active categories", value: data.activeCategories, icon: Layers },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
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
          <TrendingUp className="size-4 text-primary" /> Latest bookings
        </p>
        {data.recent.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No bookings yet.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {data.recent.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-3.5 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{r.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {r.locality || "—"} · {new Date(r.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                    statusStyles[r.status] ?? "bg-secondary text-foreground"
                  }`}
                >
                  {r.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
