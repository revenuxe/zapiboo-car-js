import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  LogOut,
  LayoutDashboard,
  Smartphone,
  Inbox,
  ClipboardList,
  Users,
  IndianRupee,
  Boxes,
  Store,
  CalendarClock,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { PageLoader } from "@/components/PageLoader";
import { OverviewPanel } from "@/components/admin/OverviewPanel";
import { DevicesPanel } from "@/components/admin/DevicesPanel";
import { LeadsPanel } from "@/components/admin/LeadsPanel";
import { UsersPanel } from "@/components/admin/UsersPanel";
import { DeviceOrdersManager } from "@/components/admin/devices/DeviceOrdersManager";
import { RatesPanel } from "@/components/admin/RatesPanel";
import { CategoriesPanel } from "@/components/admin/CategoriesPanel";
import { ListingsPanel } from "@/components/admin/ListingsPanel";
import { AvailabilityPanel } from "@/components/admin/AvailabilityPanel";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | HuluMart" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        navigate({ to: "/admin/login" });
        return;
      }
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) {
        await supabase.auth.signOut();
        navigate({ to: "/admin/login" });
        return;
      }
      if (active) setChecking(false);
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <PageLoader label="Checking admin access" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="hidden rounded-full bg-secondary px-2.5 py-0.5 text-xs font-bold text-muted-foreground sm:inline">
              Admin
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={signOut}>
            <LogOut className="size-4" /> Sign out
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage scrap pickups, rates and listings alongside laptop buyback bookings.
        </p>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-5 gap-1 sm:w-auto sm:inline-grid">
            <TabsTrigger value="overview" className="gap-1.5">
              <LayoutDashboard className="size-4" /> <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="scrap" className="gap-1.5">
              <Recycle className="size-4" /> <span className="hidden sm:inline">Scrap</span>
            </TabsTrigger>
            <TabsTrigger value="laptop" className="gap-1.5">
              <Laptop className="size-4" /> <span className="hidden sm:inline">Laptop</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-1.5">
              <Inbox className="size-4" /> <span className="hidden sm:inline">Leads</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="size-4" /> <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-5">
            <OverviewPanel />
          </TabsContent>

          <TabsContent value="scrap" className="mt-5">
            <Tabs defaultValue="scrap-bookings">
              <TabsList className="flex w-full flex-wrap gap-1 sm:w-auto sm:inline-flex">
                <TabsTrigger value="scrap-bookings" className="gap-1.5">
                  <ClipboardList className="size-4" /> Bookings
                </TabsTrigger>
                <TabsTrigger value="rates" className="gap-1.5">
                  <IndianRupee className="size-4" /> Rates
                </TabsTrigger>
                <TabsTrigger value="categories" className="gap-1.5">
                  <Boxes className="size-4" /> Categories
                </TabsTrigger>
                <TabsTrigger value="listings" className="gap-1.5">
                  <Store className="size-4" /> Listings
                </TabsTrigger>
                <TabsTrigger value="availability" className="gap-1.5">
                  <CalendarClock className="size-4" /> Availability
                </TabsTrigger>
              </TabsList>
              <TabsContent value="scrap-bookings" className="mt-5">
                <LeadsPanel scope="bookings" />
              </TabsContent>
              <TabsContent value="rates" className="mt-5">
                <RatesPanel />
              </TabsContent>
              <TabsContent value="categories" className="mt-5">
                <CategoriesPanel />
              </TabsContent>
              <TabsContent value="listings" className="mt-5">
                <ListingsPanel />
              </TabsContent>
              <TabsContent value="availability" className="mt-5">
                <AvailabilityPanel />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="laptop" className="mt-5">
            <Tabs defaultValue="laptop-bookings">
              <TabsList className="flex w-full flex-wrap gap-1 sm:w-auto sm:inline-flex">
                <TabsTrigger value="laptop-bookings" className="gap-1.5">
                  <ClipboardList className="size-4" /> Bookings
                </TabsTrigger>
                <TabsTrigger value="devices" className="gap-1.5">
                  <Smartphone className="size-4" /> Devices
                </TabsTrigger>
              </TabsList>
              <TabsContent value="laptop-bookings" className="mt-5">
                <DeviceOrdersManager />
              </TabsContent>
              <TabsContent value="devices" className="mt-5">
                <DevicesPanel />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="leads" className="mt-5">
            <LeadsPanel scope="queries" />
          </TabsContent>
          <TabsContent value="users" className="mt-5">
            <UsersPanel />
          </TabsContent>
        </Tabs>

      </main>
    </div>
  );
}
