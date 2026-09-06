"use client";

import { useState } from "react";
import useSWR from "swr";
import { useCommand } from "@/hooks/use-command";
import { useDataCache } from "@/hooks/use-data-cache";
import { Loader2, MapPin, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ServiceLocation = {
  id: string;
  location_type: "pincode" | "area";
  pincode: string | null;
  area: string | null;
  active: boolean;
  sort_order: number;
};

const cleanPincode = (value: string) => value.replace(/\D/g, "").slice(0, 6);

export function AvailabilityPanel() {
  const qc = useDataCache();
  const [newPincode, setNewPincode] = useState("");
  const [newPincodeArea, setNewPincodeArea] = useState("");
  const [newArea, setNewArea] = useState("");
  const [newAreaPincode, setNewAreaPincode] = useState("");

  const { data: locations = [], isLoading } = useSWR(["admin", "service-locations"], async () => {
      const { data, error } = await supabase
        .from("service_locations")
        .select("id, location_type, pincode, area, active, sort_order")
        .order("sort_order", { ascending: true })
        .order("pincode", { ascending: true });
      if (error) throw error;
      return data as ServiceLocation[];
    });

  const invalidate = () => {
    qc.refresh(["admin", "service-locations"]);
    qc.refresh(["service-availability", "active"]);
  };

  const addPincode = useCommand({
    execute: async () => {
      const { error } = await supabase.from("service_locations").insert({
        location_type: "pincode",
        pincode: cleanPincode(newPincode),
        area: newPincodeArea.trim() || null,
        sort_order: locations.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setNewPincode("");
      setNewPincodeArea("");
      toast.success("Pincode added.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't add pincode."),
  });

  const addArea = useCommand({
    execute: async () => {
      const { error } = await supabase.from("service_locations").insert({
        location_type: "area",
        area: newArea.trim(),
        pincode: newAreaPincode || null,
        sort_order: locations.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setNewArea("");
      setNewAreaPincode("");
      toast.success("Area added.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't add area."),
  });

  const pincodes = locations.filter((location) => location.location_type === "pincode");
  const areas = locations.filter((location) => location.location_type === "area");

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="flex items-center gap-2 text-sm font-bold">
          <MapPin className="size-4 text-primary" /> Pickup availability
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Active pincodes and areas here are treated as serviceable on the booking form.
        </p>
      </div>

      <Tabs defaultValue="pincodes">
        <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:inline-grid">
          <TabsTrigger value="pincodes">Pincodes</TabsTrigger>
          <TabsTrigger value="areas">Areas</TabsTrigger>
        </TabsList>

        <TabsContent value="pincodes" className="mt-5 space-y-5">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 text-sm font-bold">
              <Plus className="size-4 text-primary" /> Add pincode
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="560034"
                value={newPincode}
                onChange={(e) => setNewPincode(cleanPincode(e.target.value))}
              />
              <Input
                placeholder="Area label (optional)"
                value={newPincodeArea}
                onChange={(e) => setNewPincodeArea(e.target.value)}
              />
              <Button
                variant="hero"
                disabled={newPincode.length !== 6 || addPincode.isPending}
                onClick={() => addPincode.run()}
              >
                {addPincode.isPending ? <Loader2 className="size-4 animate-spin" /> : "Add"}
              </Button>
            </div>
          </div>

          <LocationList locations={pincodes} empty="No pincodes added yet." loading={isLoading} onChanged={invalidate} />
        </TabsContent>

        <TabsContent value="areas" className="mt-5 space-y-5">
          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="flex items-center gap-2 text-sm font-bold">
              <Plus className="size-4 text-primary" /> Add area
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
              <Input placeholder="Koramangala" value={newArea} onChange={(e) => setNewArea(e.target.value)} />
              <Input
                inputMode="numeric"
                maxLength={6}
                placeholder="Pincode (optional)"
                value={newAreaPincode}
                onChange={(e) => setNewAreaPincode(cleanPincode(e.target.value))}
              />
              <Button variant="hero" disabled={!newArea.trim() || addArea.isPending} onClick={() => addArea.run()}>
                {addArea.isPending ? <Loader2 className="size-4 animate-spin" /> : "Add"}
              </Button>
            </div>
          </div>

          <LocationList locations={areas} empty="No areas added yet." loading={isLoading} onChanged={invalidate} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LocationList({
  locations,
  empty,
  loading,
  onChanged,
}: {
  locations: ServiceLocation[];
  empty: string;
  loading: boolean;
  onChanged: () => void;
}) {
  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (locations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {empty}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {locations.map((location) => (
        <LocationRow key={location.id} location={location} onChanged={onChanged} />
      ))}
    </div>
  );
}

function LocationRow({ location, onChanged }: { location: ServiceLocation; onChanged: () => void }) {
  const [pincode, setPincode] = useState(location.pincode ?? "");
  const [area, setArea] = useState(location.area ?? "");
  const [active, setActive] = useState(location.active);
  const dirty = pincode !== (location.pincode ?? "") || area !== (location.area ?? "") || active !== location.active;

  const save = useCommand({
    execute: async () => {
      const cleaned = cleanPincode(pincode);
      const { error } = await supabase
        .from("service_locations")
        .update({
          pincode: cleaned || null,
          area: area.trim() || null,
          active,
        })
        .eq("id", location.id);
      if (error) throw error;
    },
    onSuccess: () => {
      onChanged();
      toast.success("Availability updated.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save changes."),
  });

  const del = useCommand({
    execute: async () => {
      const { error } = await supabase.from("service_locations").delete().eq("id", location.id);
      if (error) throw error;
    },
    onSuccess: () => {
      onChanged();
      toast.success("Location removed.");
    },
    onError: () => toast.error("Couldn't delete location."),
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-3.5">
      <div className="flex flex-wrap items-end gap-2.5">
        <div className="min-w-28 flex-1 space-y-1">
          <Label className="text-xs">Pincode</Label>
          <Input
            className="h-9"
            inputMode="numeric"
            maxLength={6}
            placeholder="Optional"
            value={pincode}
            onChange={(e) => setPincode(cleanPincode(e.target.value))}
          />
        </div>
        <div className="min-w-36 flex-[1.5] space-y-1">
          <Label className="text-xs">Area</Label>
          <Input className="h-9" placeholder="Optional" value={area} onChange={(e) => setArea(e.target.value)} />
        </div>
        <div className="flex items-center gap-1.5 pb-2 text-xs text-muted-foreground">
          <Switch checked={active} onCheckedChange={setActive} aria-label="Active" />
          Active
        </div>
        <Button size="sm" variant="hero" disabled={!dirty || save.isPending} onClick={() => save.run()}>
          {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4" /> Save</>}
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-9 text-destructive"
          disabled={del.isPending}
          onClick={() => del.run()}
        >
          <Trash2 className="size-4" />
        </Button>
      </div>
    </div>
  );
}
