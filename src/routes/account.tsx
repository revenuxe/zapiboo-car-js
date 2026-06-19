import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  LogOut,
  Package,
  MapPin,
  Clock,
  CalendarDays,
  PlusCircle,
  User as UserIcon,
  Laptop,
  Ban,
  CheckCircle2,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { displayName } from "@/hooks/use-auth";
import { formatPrice, statusLabel, type DeviceOrder } from "@/lib/device-buyback";
import { Button } from "@/components/ui/button";
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

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My account | HuluMart" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountPage,
});

type Lead = {
  id: string;
  scrap_mode: string;
  items: string[];
  size_tier: string | null;
  locality: string | null;
  pincode: string | null;
  preferred_date: string | null;
  slot: string | null;
  status: string;
  created_at: string;
};

const statusStyles: Record<string, string> = {
  new: "bg-secondary text-foreground",
  scheduled: "bg-accent text-primary",
  completed: "bg-gradient-brand text-primary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

function AccountPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        navigate({ to: "/auth" });
        return;
      }
      setUser(data.user);
      setChecking(false);
    });
  }, [navigate]);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, scrap_mode, items, size_tier, locality, pincode, preferred_date, slot, status, created_at")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  if (checking) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-7 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-secondary/30">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        {/* profile card */}
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green">
              <UserIcon className="size-7" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{displayName(user)}</h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>

        {/* laptop / device buyback orders */}
        <LaptopOrders userId={user!.id} />

        {/* bookings */}
        <div className="mt-8 flex items-center justify-between">
          <h2 className="text-lg font-bold">My pickups</h2>
          <Button asChild variant="hero" size="sm">
            <Link to="/pickup">
              <PlusCircle className="size-4" /> Book a pickup
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="mt-5 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
            <Package className="mx-auto size-9 text-muted-foreground" />
            <p className="mt-3 font-semibold">No pickups yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Book your first doorstep pickup and it'll show up here.
            </p>
            <Button asChild variant="hero" className="mt-5">
              <Link to="/pickup">Book a pickup</Link>
            </Button>
          </div>
        ) : (
          <div className="mt-5 space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold capitalize">
                      {b.scrap_mode === "mixed" ? "Mixed scrap" : b.items.join(", ") || "Scrap pickup"}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <MapPin className="size-3.5 text-primary" />
                      {b.locality || "—"}{b.pincode ? `, ${b.pincode}` : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                      statusStyles[b.status] ?? "bg-secondary text-foreground"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                  {b.preferred_date && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-primary" /> {b.preferred_date}
                    </span>
                  )}
                  {b.slot && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-primary" /> {b.slot}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
