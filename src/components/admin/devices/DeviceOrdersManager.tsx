import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, Loader2, Phone, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  formatPrice,
  ORDER_STATUSES,
  statusLabel,
  type DeviceOrder,
} from "@/lib/device-buyback";

const statusStyles: Record<string, string> = {
  new: "bg-primary/10 text-primary",
  contacted: "bg-amber-500/15 text-amber-600",
  scheduled: "bg-blue-500/15 text-blue-600",
  paid: "bg-emerald-500/15 text-emerald-600",
  rejected: "bg-destructive/10 text-destructive",
};

export function DeviceOrdersManager() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [active, setActive] = useState<DeviceOrder | null>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["admin", "device_orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_orders")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as DeviceOrder[];
    },
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("device_orders").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "device_orders"] });
      toast.success("Status updated.");
    },
    onError: () => toast.error("Couldn't update status."),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("device_orders").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "device_orders"] });
      setActive(null);
      toast.success("Order deleted.");
    },
    onError: () => toast.error("Couldn't delete the order."),
  });



  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return orders.filter((o) => {
      const matchesStatus = filter === "all" || o.status === filter;
      const matchesQuery =
        !q ||
        o.name.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        (o.model_name ?? "").toLowerCase().includes(q) ||
        (o.brand_name ?? "").toLowerCase().includes(q);
      return matchesStatus && matchesQuery;
    });
  }, [orders, search, filter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search name, phone, model…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Inbox className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No buyback orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Quotes customers complete on the sell page will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((o) => (
            <button
              key={o.id}
              onClick={() => setActive(o)}
              className="flex w-full items-center gap-3 rounded-2xl border border-border bg-card p-3.5 text-left shadow-soft transition-colors hover:border-primary/40"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-bold">{o.model_name ?? "Device"}</p>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${statusStyles[o.status] ?? "bg-muted text-muted-foreground"}`}
                  >
                    {statusLabel(o.status)}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {o.brand_name}
                  {o.series_name ? ` · ${o.series_name}` : ""} · {o.name} · {o.phone}
                </p>
              </div>
              <span className="shrink-0 text-base font-extrabold text-primary">
                {formatPrice(o.final_price)}
              </span>
            </button>
          ))}
        </div>
      )}

      <Sheet open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.model_name ?? "Device"}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-5 text-sm">
                <div className="rounded-2xl bg-gradient-navy p-4 text-navy-foreground">
                  <p className="text-xs uppercase tracking-wide text-navy-foreground/70">Final quote</p>
                  <p className="text-3xl font-extrabold text-gradient">{formatPrice(active.final_price)}</p>
                  <p className="mt-1 text-xs text-navy-foreground/70">
                    Base {formatPrice(active.base_price)} ·{" "}
                    {active.brand_name}
                    {active.series_name ? ` · ${active.series_name}` : ""}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</p>
                  <Select value={active.status} onValueChange={(v) => { setStatus.mutate({ id: active.id, status: v }); setActive({ ...active, status: v }); }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ORDER_STATUSES.map((s) => (
                        <SelectItem key={s.value} value={s.value}>
                          {s.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Customer</p>
                  <p className="font-medium">{active.name}</p>
                  <a href={`tel:${active.phone}`} className="flex items-center gap-1.5 text-primary">
                    <Phone className="size-3.5" /> {active.phone}
                  </a>
                  {active.email && <p className="text-muted-foreground">{active.email}</p>}
                  {active.address && <p className="text-muted-foreground">{active.address}</p>}
                  {active.pincode && <p className="text-muted-foreground">PIN {active.pincode}</p>}
                  {(active.preferred_date || active.slot) && (
                    <p className="text-muted-foreground">
                      Pickup: {active.preferred_date ?? ""} {active.slot ?? ""}
                    </p>
                  )}
                  {active.notes && <p className="text-muted-foreground">Notes: {active.notes}</p>}
                </div>

                {active.selections?.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Condition answers
                    </p>
                    <div className="space-y-1.5">
                      {active.selections.map((s, i) => (
                        <div key={i} className="flex items-center justify-between gap-2 rounded-lg border border-border p-2">
                          <span className="min-w-0 flex-1 truncate">
                            <span className="text-muted-foreground">{s.group}: </span>
                            {s.option}
                          </span>
                          <span
                            className={`shrink-0 font-bold ${s.impact >= 0 ? "text-primary" : "text-destructive"}`}
                          >
                            {s.impact >= 0 ? "+" : "−"}
                            {formatPrice(Math.abs(s.impact)).replace("₹", "₹")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-border pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" className="w-full text-destructive" disabled={remove.isPending}>
                        <Trash2 className="size-4" /> Delete order
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this order?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes {active.name}'s {active.model_name ?? "device"} order
                          from the list. This can't be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => remove.mutate(active.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
