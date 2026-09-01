import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CatalogueRow = { id: string; name: string; active: boolean; sort_order: number };
const db = supabase as unknown as { from: (table: string) => any };
const makeSlug = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Admin: manage the brands shown inside each category → vehicle type. */
export function VehiclesPanel() {
  const qc = useQueryClient();
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [query, setQuery] = useState("");

  const { data: categories = [], isLoading } = useCatalogue("vehicle_categories");
  const { data: subcategories = [] } = useCatalogue("vehicle_subcategories", "category_id", categoryId);
  const { data: brands = [] } = useCatalogue("vehicle_brands", "subcategory_id", subcategoryId);
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "vehicle-catalogue"] });

  const add = useMutation({
    mutationFn: async (name: string) => {
      const highest = brands.reduce((max, item) => Math.max(max, item.sort_order), 0);
      const { error } = await db.from("vehicle_brands").insert({
        name: name.trim(),
        sort_order: highest + 1,
        slug: `${makeSlug(name)}-${subcategoryId.slice(0, 8)}`,
        category_id: categoryId,
        subcategory_id: subcategoryId,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setBrandName("");
      refresh();
      toast.success("Brand added.");
    },
    onError: (error: Error) => toast.error(error.message || "Couldn’t save this brand."),
  });

  const reorder = useMutation({
    mutationFn: async ({ index, direction }: { index: number; direction: -1 | 1 }) => {
      const target = brands[index + direction];
      const current = brands[index];
      if (!target || !current) return;
      const results = await Promise.all([
        db.from("vehicle_brands").update({ sort_order: target.sort_order }).eq("id", current.id),
        db.from("vehicle_brands").update({ sort_order: current.sort_order }).eq("id", target.id),
      ]);
      const failed = results.find((result: any) => result?.error);
      if (failed) throw failed.error;
    },
    onSuccess: refresh,
    onError: () => toast.error("Couldn’t reorder brands."),
  });

  const visible = brands.filter((brand) =>
    brand.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="font-bold">Vehicle brands</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a category and vehicle type, then add the brands customers can choose during booking.
          Use the arrows to control the order they appear in.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2">
            <Select
              value={categoryId}
              onValueChange={(id) => {
                setCategoryId(id);
                setSubcategoryId("");
              }}
            >
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Choose category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={subcategoryId} onValueChange={setSubcategoryId} disabled={!categoryId}>
              <SelectTrigger className="h-12 rounded-xl">
                <SelectValue placeholder="Choose vehicle type" />
              </SelectTrigger>
              <SelectContent>
                {subcategories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <section className="rounded-2xl border border-border bg-card p-4">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
              <h2 className="truncate font-bold">Brands</h2>
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                {brands.length} total
              </span>
            </div>

            <div className="mt-3 flex gap-2">
              <Input
                disabled={!subcategoryId}
                value={brandName}
                placeholder={subcategoryId ? "e.g. Maruti Suzuki" : "Choose a vehicle type first"}
                onChange={(event) => setBrandName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && brandName.trim()) add.mutate(brandName);
                }}
              />
              <Button
                size="icon"
                variant="hero"
                disabled={!subcategoryId || !brandName.trim() || add.isPending}
                onClick={() => add.mutate(brandName)}
              >
                {add.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
              </Button>
            </div>

            {brands.length > 6 && (
              <div className="relative mt-3">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search brands"
                  className="pl-9"
                />
              </div>
            )}

            <div className="mt-3 space-y-2">
              {visible.length ? (
                visible.map((brand) => {
                  const index = brands.findIndex((item) => item.id === brand.id);
                  return (
                    <BrandRow
                      key={brand.id}
                      brand={brand}
                      position={index + 1}
                      canMoveUp={index > 0}
                      canMoveDown={index < brands.length - 1}
                      onMove={(direction) => reorder.mutate({ index, direction })}
                      onChanged={refresh}
                    />
                  );
                })
              ) : (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  {subcategoryId ? "No brands yet — add the first one above." : "Choose a vehicle type first."}
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </div>
  );
}

function useCatalogue(table: string, foreignKey?: string, parentId?: string) {
  return useQuery({
    queryKey: ["admin", "vehicle-catalogue", table, parentId],
    queryFn: async () => {
      let query = db.from(table).select("id, name, active, sort_order").order("sort_order").order("name");
      if (foreignKey && parentId) query = query.eq(foreignKey, parentId);
      const { data, error } = await query;
      if (error) throw error;
      return data as CatalogueRow[];
    },
  });
}

function BrandRow({
  brand,
  position,
  canMoveUp,
  canMoveDown,
  onMove,
  onChanged,
}: {
  brand: CatalogueRow;
  position: number;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onMove: (direction: -1 | 1) => void;
  onChanged: () => void;
}) {
  const toggle = useMutation({
    mutationFn: async () => {
      const { error } = await db.from("vehicle_brands").update({ active: !brand.active }).eq("id", brand.id);
      if (error) throw error;
    },
    onSuccess: onChanged,
    onError: () => toast.error("Couldn’t update this brand."),
  });
  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await db.from("vehicle_brands").delete().eq("id", brand.id);
      if (error) throw error;
    },
    onSuccess: onChanged,
    onError: () => toast.error("Couldn’t delete this brand."),
  });

  return (
    <div className="flex items-center gap-2 rounded-xl border border-border p-2">
      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-bold">
        {position}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">{brand.name}</span>
      <div className="flex shrink-0 items-center">
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          disabled={!canMoveUp}
          aria-label={`Move ${brand.name} up`}
          onClick={() => onMove(-1)}
        >
          <ArrowUp className="size-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          className="size-8"
          disabled={!canMoveDown}
          aria-label={`Move ${brand.name} down`}
          onClick={() => onMove(1)}
        >
          <ArrowDown className="size-4" />
        </Button>
      </div>
      <Switch
        checked={brand.active}
        onCheckedChange={() => toggle.mutate()}
        aria-label={`Set ${brand.name} active`}
      />
      <Button
        size="icon"
        variant="ghost"
        className="size-8 shrink-0 text-destructive"
        aria-label={`Delete ${brand.name}`}
        onClick={() => remove.mutate()}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
