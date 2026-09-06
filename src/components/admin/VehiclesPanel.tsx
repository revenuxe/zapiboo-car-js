"use client";

import { useState } from "react";
import useSWR from "swr";
import { ArrowDown, ArrowUp, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useCommand } from "@/hooks/use-command";
import { useDataCache } from "@/hooks/use-data-cache";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Row = { id: string; name: string; active: boolean; sort_order: number };
const db = supabase as unknown as { from: (table: string) => any };
const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** Keeps the catalogue intentionally small: each top-level vehicle card owns its brands. */
export function VehiclesPanel() {
  const cache = useDataCache();
  const [categoryId, setCategoryId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [query, setQuery] = useState("");
  const { data: categories = [], isLoading } = useCatalogue("vehicle_categories");
  const { data: brands = [] } = useCatalogue("vehicle_brands", categoryId);
  const refresh = () => cache.refresh(["admin", "vehicle-catalogue"]);
  const selectedCategory = categories.find(category => category.id === categoryId);

  const add = useCommand({
    execute: async (name: string) => {
      const { error } = await db.from("vehicle_brands").insert({ name: name.trim(), slug: `${slugify(name)}-${categoryId.slice(0, 8)}`, category_id: categoryId, subcategory_id: null, sort_order: Math.max(0, ...brands.map(brand => brand.sort_order)) + 1 });
      if (error) throw error;
    },
    onSuccess: () => { setBrandName(""); refresh(); toast.success("Brand added."); },
    onError: (error: Error) => toast.error(error.message || "Could not save this brand."),
  });
  const reorder = useCommand({
    execute: async ({ index, direction }: { index: number; direction: -1 | 1 }) => { const current = brands[index]; const target = brands[index + direction]; if (!current || !target) return; const results = await Promise.all([db.from("vehicle_brands").update({ sort_order: target.sort_order }).eq("id", current.id), db.from("vehicle_brands").update({ sort_order: current.sort_order }).eq("id", target.id)]); const failed = results.find((result: { error?: Error }) => result.error); if (failed?.error) throw failed.error; },
    onSuccess: refresh,
    onError: () => toast.error("Could not reorder brands."),
  });
  const visible = brands.filter(brand => brand.name.toLowerCase().includes(query.trim().toLowerCase()));

  return <div className="space-y-5"><section className="rounded-2xl border border-border bg-card p-4"><h2 className="font-bold">Vehicle brands</h2><p className="mt-1 text-sm text-muted-foreground">Choose a vehicle card, then manage the brands customers can search in the pickup flow. Models and variants are collected directly from the customer, so they are not managed here.</p></section>{isLoading ? <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div> : <><section className="rounded-2xl border border-border bg-card p-4"><Select value={categoryId} onValueChange={id => { setCategoryId(id); setQuery(""); }}><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Choose vehicle category" /></SelectTrigger><SelectContent>{categories.map(category => <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>)}</SelectContent></Select></section><section className="rounded-2xl border border-border bg-card p-4"><div className="flex items-center justify-between gap-3"><h2 className="font-bold">{selectedCategory ? `${selectedCategory.name} brands` : "Brands"}</h2>{categoryId && <span className="text-xs font-semibold text-muted-foreground">{brands.length} total</span>}</div><div className="mt-4 flex gap-2"><Input disabled={!categoryId} value={brandName} placeholder={categoryId ? "e.g. Maruti Suzuki" : "Choose a vehicle category first"} onChange={event => setBrandName(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && brandName.trim()) add.run(brandName); }} /><Button size="icon" variant="hero" disabled={!categoryId || !brandName.trim() || add.isPending} onClick={() => add.run(brandName)}>{add.isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}</Button></div>{brands.length > 6 && <div className="relative mt-3"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search brands" className="pl-9" /></div>}<div className="mt-3 space-y-2">{visible.length ? visible.map(brand => { const index = brands.findIndex(item => item.id === brand.id); return <BrandRow key={brand.id} brand={brand} position={index + 1} canMoveUp={index > 0} canMoveDown={index < brands.length - 1} onMove={direction => reorder.run({ index, direction })} onChanged={refresh} />; }) : <p className="py-6 text-center text-sm text-muted-foreground">{categoryId ? "No brands yet — add the first one above." : "Choose a vehicle category first."}</p>}</div></section></>}</div>;
}

function useCatalogue(table: string, categoryId?: string) { return useSWR(["admin", "vehicle-catalogue", table, categoryId], async () => { let query = db.from(table).select("id, name, active, sort_order").order("sort_order").order("name"); if (categoryId) query = query.eq("category_id", categoryId); const { data, error } = await query; if (error) throw error; return data as Row[]; }); }

function BrandRow({ brand, position, canMoveUp, canMoveDown, onMove, onChanged }: { brand: Row; position: number; canMoveUp: boolean; canMoveDown: boolean; onMove: (direction: -1 | 1) => void; onChanged: () => void }) { const toggle = useCommand({ execute: async () => { const { error } = await db.from("vehicle_brands").update({ active: !brand.active }).eq("id", brand.id); if (error) throw error; }, onSuccess: onChanged, onError: () => toast.error("Could not update this brand.") }); const remove = useCommand({ execute: async () => { const { error } = await db.from("vehicle_brands").delete().eq("id", brand.id); if (error) throw error; }, onSuccess: onChanged, onError: () => toast.error("Could not delete this brand.") }); return <div className="flex items-center gap-2 rounded-xl border border-border p-2"><span className="grid size-7 shrink-0 place-items-center rounded-lg bg-secondary text-xs font-bold">{position}</span><span className="min-w-0 flex-1 truncate text-sm font-semibold">{brand.name}</span><div className="flex shrink-0 items-center"><Button size="icon" variant="ghost" className="size-8" disabled={!canMoveUp} aria-label={`Move ${brand.name} up`} onClick={() => onMove(-1)}><ArrowUp className="size-4" /></Button><Button size="icon" variant="ghost" className="size-8" disabled={!canMoveDown} aria-label={`Move ${brand.name} down`} onClick={() => onMove(1)}><ArrowDown className="size-4" /></Button></div><Switch checked={brand.active} onCheckedChange={() => toggle.run()} aria-label={`Set ${brand.name} active`} /><Button size="icon" variant="ghost" className="size-8 shrink-0 text-destructive" aria-label={`Delete ${brand.name}`} onClick={() => remove.run()}><Trash2 className="size-4" /></Button></div>; }
