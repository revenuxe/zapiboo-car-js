"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDataCache } from "@/hooks/use-data-cache";
import {
  LogOut,
  LayoutDashboard,
  Inbox,
  Users,
  CarFront,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Logo } from "@/components/Logo";
import { PageLoader } from "@/components/PageLoader";
import { LeadsPanel } from "@/components/admin/LeadsPanel";
import { UsersPanel } from "@/components/admin/UsersPanel";
import { VehiclesPanel } from "@/components/admin/VehiclesPanel";
import { CatalogueTaxonomyPanel } from "@/components/admin/CatalogueTaxonomyPanel";


export default function AdminDashboard() {
  const router = useRouter();
  const qc = useDataCache();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.replace("/admin/login");
        return;
      }
      const { data: role, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userData.user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (error || !role) {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }
      if (active) setChecking(false);
    })();
    return () => { active = false; };
  }, [router]);
  const signOut = async () => {
    await qc.clear();
    await supabase.auth.signOut();
    router.replace("/admin/login");
  };

  if (checking) {
    return <div className="flex min-h-screen items-center justify-center bg-background"><PageLoader label="Opening dashboard" /></div>;
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
          Manage vehicle bookings, catalogue cards and customer enquiries.
        </p>

        <Tabs defaultValue="bookings" className="mt-6">
          <TabsList className="flex w-full max-w-full flex-nowrap justify-start gap-1 overflow-x-auto p-1 sm:w-auto">
            <TabsTrigger value="bookings" className="gap-1.5">
              <LayoutDashboard className="size-4" /> <span className="hidden sm:inline">Bookings</span>
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="gap-1.5">
              <CarFront className="size-4" /> <span className="hidden sm:inline">Brands</span>
            </TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="types">Vehicle types</TabsTrigger>
            <TabsTrigger value="leads" className="gap-1.5">
              <Inbox className="size-4" /> <span className="hidden sm:inline">Leads</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-1.5">
              <Users className="size-4" /> <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="mt-5">
            <LeadsPanel scope="bookings" />
          </TabsContent>
          <TabsContent value="vehicles" className="mt-5"><VehiclesPanel /></TabsContent>
          <TabsContent value="categories" className="mt-5"><CatalogueTaxonomyPanel kind="categories" /></TabsContent>
          <TabsContent value="types" className="mt-5"><CatalogueTaxonomyPanel kind="subcategories" /></TabsContent>

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
