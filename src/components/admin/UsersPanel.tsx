import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Mail, MapPin, Phone, Search, User2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";

type Customer = {
  userId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  bookings: number;
  pickups: number;
  lastActivity: string | null;
};

export function UsersPanel() {
  const [q, setQ] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: async (): Promise<Customer[]> => {
      const [profilesRes, ordersRes, leadsRes] = await Promise.all([
        supabase
          .from("user_profiles")
          .select("user_id, full_name, whatsapp, address, pincode, created_at"),
        supabase
          .from("device_orders")
          .select("user_id, name, phone, email, address, pincode, created_at")
          .not("user_id", "is", null)
          .order("created_at", { ascending: false }),
        supabase
          .from("leads")
          .select("user_id, name, phone, email, address, pincode, created_at")
          .not("user_id", "is", null)
          .order("created_at", { ascending: false }),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (ordersRes.error) throw ordersRes.error;
      if (leadsRes.error) throw leadsRes.error;

      const map = new Map<string, Customer>();
      const ensure = (id: string) => {
        let c = map.get(id);
        if (!c) {
          c = {
            userId: id,
            name: "",
            phone: "",
            email: "",
            address: "",
            pincode: "",
            bookings: 0,
            pickups: 0,
            lastActivity: null,
          };
          map.set(id, c);
        }
        return c;
      };
      const touch = (c: Customer, at: string | null) => {
        if (at && (!c.lastActivity || at > c.lastActivity)) c.lastActivity = at;
      };

      for (const p of profilesRes.data ?? []) {
        const c = ensure(p.user_id);
        c.name ||= p.full_name ?? "";
        c.phone ||= p.whatsapp ?? "";
        c.address ||= p.address ?? "";
        c.pincode ||= p.pincode ?? "";
        touch(c, p.created_at);
      }
      for (const o of ordersRes.data ?? []) {
        const c = ensure(o.user_id as string);
        c.name ||= o.name ?? "";
        c.phone ||= o.phone ?? "";
        c.email ||= o.email ?? "";
        c.address ||= o.address ?? "";
        c.pincode ||= o.pincode ?? "";
        c.bookings += 1;
        touch(c, o.created_at);
      }
      for (const l of leadsRes.data ?? []) {
        const c = ensure(l.user_id as string);
        c.name ||= l.name ?? "";
        c.phone ||= l.phone ?? "";
        c.email ||= l.email ?? "";
        c.address ||= l.address ?? "";
        c.pincode ||= l.pincode ?? "";
        c.pickups += 1;
        touch(c, l.created_at);
      }

      return [...map.values()].sort((a, b) =>
        (b.lastActivity ?? "").localeCompare(a.lastActivity ?? ""),
      );
    },
  });

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return data ?? [];
    return (data ?? []).filter((c) =>
      [c.name, c.phone, c.email, c.pincode, c.address].join(" ").toLowerCase().includes(term),
    );
  }, [data, q]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Customers" value={data?.length ?? 0} />
        <Stat label="With bookings" value={(data ?? []).filter((c) => c.bookings > 0).length} />
        <Stat label="With pickups" value={(data ?? []).filter((c) => c.pickups > 0).length} />
      </div>

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, phone, email or pincode"
          className="pl-9"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
          No customers found.
        </p>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((c) => (
            <div key={c.userId} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
                    <User2 className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{c.name || "Customer"}</p>
                    <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      {c.phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="size-3" /> {c.phone}
                        </p>
                      )}
                      {c.email && (
                        <p className="flex items-center gap-1.5 truncate">
                          <Mail className="size-3" /> {c.email}
                        </p>
                      )}
                      {(c.address || c.pincode) && (
                        <p className="flex items-start gap-1.5">
                          <MapPin className="mt-0.5 size-3 shrink-0" />
                          <span className="line-clamp-2">
                            {[c.address, c.pincode].filter(Boolean).join(" · ")}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="flex gap-1.5">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">
                      {c.bookings} bookings
                    </span>
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-bold">
                      {c.pickups} pickups
                    </span>
                  </div>
                  {c.lastActivity && (
                    <p className="mt-1.5 text-[11px] text-muted-foreground">
                      Last active {new Date(c.lastActivity).toLocaleDateString("en-GB")}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
      <div className="text-2xl font-extrabold text-gradient">{value}</div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}
