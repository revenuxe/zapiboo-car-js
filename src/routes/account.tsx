import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  LogOut,
  MapPin,
  Clock,
  CalendarDays,
  User as UserIcon,
  Laptop,
  Ban,
  CheckCircle2,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { displayName } from "@/hooks/use-auth";
import { statusLabel, type DeviceOrder } from "@/lib/device-buyback";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/PageLoader";
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
      { title: "My account | ZAPIBOO" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AccountPage,
});

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


  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  if (checking) {
    return <PageLoader label="Loading your account" />;
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

      </div>
    </div>
  );
}

const orderStatusStyles: Record<string, string> = {
  new: "bg-secondary text-foreground",
  contacted: "bg-amber-500/15 text-amber-600",
  scheduled: "bg-accent text-primary",
  paid: "bg-gradient-brand text-primary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
  rejected: "bg-destructive/10 text-destructive",
};

function LaptopOrders({ userId }: { userId: string }) {
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-device-orders", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_orders")
        .select(
          "id, category_name, brand_name, series_name, model_name, base_price, final_price, status, pincode, preferred_date, slot, created_at",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as unknown as DeviceOrder[];
    },
  });

  const cancel = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("device_orders")
        .update({ status: "cancelled" })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-device-orders", userId] });
      toast.success("Order cancelled.");
    },
    onError: () => toast.error("Couldn't cancel the order."),
  });

  return (
    <>
      <div className="mt-8 flex items-center justify-between">
        <h2 className="text-lg font-bold">My laptop orders</h2>
        <Button asChild variant="hero" size="sm">
          <Link to="/sell/$category" params={{ category: "laptops" }}>
            <Laptop className="size-4" /> Sell a device
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-5 rounded-3xl border border-dashed border-border bg-card p-10 text-center">
          <Laptop className="mx-auto size-9 text-muted-foreground" />
          <p className="mt-3 font-semibold">No device orders yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Get an instant quote for your laptop and it'll appear here.
          </p>
          <Button asChild variant="hero" className="mt-5">
            <Link to="/sell/$category" params={{ category: "laptops" }}>
              Sell a device
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {orders.map((o) => {
            const cancelled = o.status === "cancelled" || o.status === "rejected";
            const canCancel = o.status === "new" || o.status === "contacted" || o.status === "scheduled";
            return (
              <div key={o.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{o.model_name ?? "Device"}</p>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">
                      {[o.brand_name, o.series_name].filter(Boolean).join(" Â· ")}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold capitalize ${
                      orderStatusStyles[o.status] ?? "bg-secondary text-foreground"
                    }`}
                  >
                    {statusLabel(o.status)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm text-muted-foreground">
                  {o.preferred_date && (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5 text-primary" /> {o.preferred_date}
                    </span>
                  )}
                  {o.slot && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-primary" /> {o.slot}
                    </span>
                  )}
                  {o.pincode && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5 text-primary" /> {o.pincode}
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-end border-t border-border pt-3">
                  {canCancel ? (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-destructive">
                          <Ban className="size-4" /> Cancel order
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Your {o.model_name ?? "device"} pickup request will be cancelled. You can
                            always get a fresh quote later.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep order</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => cancel.mutate(o.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Cancel order
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {cancelled ? (
                        <>
                          <Ban className="size-3.5" /> {statusLabel(o.status)}
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-3.5 text-primary" /> {statusLabel(o.status)}
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
