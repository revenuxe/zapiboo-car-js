import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, LayoutDashboard, Smartphone, Inbox, ClipboardList } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { PageLoader } from "@/components/PageLoader";
import { OverviewPanel } from "@/components/admin/OverviewPanel";
import { DevicesPanel } from "@/components/admin/DevicesPanel";
import { LeadsPanel } from "@/components/admin/LeadsPanel";

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
          Manage laptop buyback bookings, device catalog and customer leads.
        </p>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4 gap-1 sm:w-auto sm:inline-grid">
            <TabsTrigger value="overview" className="gap-1.5">
              <LayoutDashboard className="size-4" /> <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="bookings" className="gap-1.5">
              <ClipboardList className="size-4" /> <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="leads" className="gap-1.5">
              <Inbox className="size-4" /> <span className="hidden sm:inline">Leads</span>
            </TabsTrigger>
            <TabsTrigger value="devices" className="gap-1.5">
              <Smartphone className="size-4" /> <span className="hidden sm:inline">Devices</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-5">
            <OverviewPanel />
          </TabsContent>
          <TabsContent value="bookings" className="mt-5">
            <DeviceOrdersManager />
          </TabsContent>
          <TabsContent value="leads" className="mt-5">
            <LeadsPanel />
          </TabsContent>
          <TabsContent value="devices" className="mt-5">
            <DevicesPanel />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
