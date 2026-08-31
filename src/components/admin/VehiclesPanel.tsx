import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronRight, Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type CatalogueRow = { id: string; name: string; active: boolean; sort_order: number; brand_id?: string; model_id?: string };
const db = supabase as unknown as { from: (table: string) => any };
const makeSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export function VehiclesPanel() {
  const qc = useQueryClient();
  const [brandId, setBrandId] = useState("");
  const [modelId, setModelId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");
  const [brandName, setBrandName] = useState("");
  const [modelName, setModelName] = useState("");
  const [variantName, setVariantName] = useState("");
  const { data: categories = [], isLoading } = useCatalogue("vehicle_categories");
  const { data: subcategories = [] } = useCatalogue("vehicle_subcategories", "category_id", categoryId);
  const { data: brands = [] } = useCatalogue("vehicle_brands", "subcategory_id", subcategoryId);
  const { data: models = [] } = useCatalogue("vehicle_models", "brand_id", brandId);
  const { data: variants = [] } = useCatalogue("vehicle_variants", "model_id", modelId);
  const refresh = () => qc.invalidateQueries({ queryKey: ["admin", "vehicle-catalogue"] });

  const add = useMutation({
    mutationFn: async ({ table, name, parent }: { table: string; name: string; parent?: Record<string, string> }) => {
      const { data: latest, error: latestError } = await db
        .from(table)
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (latestError) throw latestError;
      const { error } = await db.from(table).insert({
        name: name.trim(),
        sort_order: (latest?.sort_order ?? 0) + 1,
        ...(table === "vehicle_brands" ? { slug: `${makeSlug(name)}-${parent?.subcategory_id?.slice(0, 8) ?? "catalogue"}` } : {}),
        ...parent,
      });
      if (error) throw error;
    },
    onSuccess: (_, values) => { refresh(); if (values.table === "vehicle_brands") setBrandName(""); if (values.table === "vehicle_models") setModelName(""); if (values.table === "vehicle_variants") setVariantName(""); toast.success("Saved."); },
    onError: (error: Error) => toast.error(error.message || "Couldn’t save this item."),
  });

  const chooseCategory = (id: string) => { setCategoryId(id); setSubcategoryId(""); setBrandId(""); setModelId(""); };
  const chooseSubcategory = (id: string) => { setSubcategoryId(id); setBrandId(""); setModelId(""); };
  const chooseBrand = (id: string) => { setBrandId(id); setModelId(""); };
  return <div className="space-y-5">
    <div className="rounded-2xl border border-border bg-card p-4"><p className="font-bold">Vehicle catalogue</p><p className="mt-1 text-sm text-muted-foreground">Build the customer journey from category to exact variant. Inactive entries stay hidden from booking.</p></div>
    {isLoading ? <div className="flex justify-center py-16"><Loader2 className="size-6 animate-spin text-primary" /></div> : <><div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-2"><Select value={categoryId} onValueChange={chooseCategory}><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Choose category" /></SelectTrigger><SelectContent>{categories.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select><Select value={subcategoryId} onValueChange={chooseSubcategory} disabled={!categoryId}><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Choose vehicle type" /></SelectTrigger><SelectContent>{subcategories.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent></Select></div><div className="grid gap-4 lg:grid-cols-3">
      <CatalogueColumn table="vehicle_brands" title="Brands" items={brands} selectedId={brandId} onSelect={chooseBrand} disabled={!subcategoryId} empty="Choose a vehicle type first." placeholder="e.g. Maruti Suzuki" value={brandName} onValueChange={setBrandName} onAdd={() => add.mutate({ table: "vehicle_brands", name: brandName, parent: { category_id: categoryId, subcategory_id: subcategoryId } })} pending={add.isPending} onChanged={refresh} />
      <CatalogueColumn table="vehicle_models" title="Models" items={models} selectedId={modelId} onSelect={setModelId} disabled={!brandId} empty="Choose a brand first." placeholder="e.g. Swift" value={modelName} onValueChange={setModelName} onAdd={() => add.mutate({ table: "vehicle_models", name: modelName, parent: { brand_id: brandId } })} pending={add.isPending} onChanged={refresh} />
      <CatalogueColumn table="vehicle_variants" title="Variants" items={variants} disabled={!modelId} empty="Choose a model first." placeholder="e.g. VXi" value={variantName} onValueChange={setVariantName} onAdd={() => add.mutate({ table: "vehicle_variants", name: variantName, parent: { model_id: modelId } })} pending={add.isPending} onChanged={refresh} />
    </div></>}
  </div>;
}

function useCatalogue(table: string, foreignKey?: string, parentId?: string) {
  return useQuery({ queryKey: ["admin", "vehicle-catalogue", table, parentId], queryFn: async () => { let query = db.from(table).select("id, name, active, sort_order").order("sort_order").order("name"); if (foreignKey && parentId) query = query.eq(foreignKey, parentId); const { data, error } = await query; if (error) throw error; return data as CatalogueRow[]; } });
}

function CatalogueColumn({ table, title, items, selectedId, onSelect, disabled, empty, placeholder, value, onValueChange, onAdd, pending, onChanged }: { table: string; title: string; items: CatalogueRow[]; selectedId?: string; onSelect?: (id: string) => void; disabled?: boolean; empty?: string; placeholder: string; value: string; onValueChange: (value: string) => void; onAdd: () => void; pending: boolean; onChanged: () => void }) {
  return <section className="rounded-2xl border border-border bg-card p-3.5"><h2 className="font-bold">{title}</h2><div className="mt-3 flex gap-2"><Input disabled={disabled} value={value} placeholder={placeholder} onChange={(e) => onValueChange(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && value.trim()) onAdd(); }} /><Button size="icon" variant="hero" disabled={disabled || !value.trim() || pending} onClick={onAdd}>{pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}</Button></div><div className="mt-3 space-y-2">{items.length ? items.map((item) => <CatalogueItem key={item.id} table={table} item={item} selected={selectedId === item.id} onSelect={onSelect} onChanged={onChanged} />) : <p className="py-5 text-center text-sm text-muted-foreground">{empty ?? "No entries yet."}</p>}</div></section>;
}

function CatalogueItem({ table, item, selected, onSelect, onChanged }: { table: string; item: CatalogueRow; selected: boolean; onSelect?: (id: string) => void; onChanged: () => void }) {
  const toggle = useMutation({ mutationFn: async () => { const { error } = await db.from(table).update({ active: !item.active }).eq("id", item.id); if (error) throw error; }, onSuccess: onChanged, onError: () => toast.error("Couldn’t update this item.") });
  const remove = useMutation({ mutationFn: async () => { const { error } = await db.from(table).delete().eq("id", item.id); if (error) throw error; }, onSuccess: onChanged, onError: () => toast.error("Couldn’t delete this item.") });
  return <div className={`flex items-center gap-2 rounded-xl border p-2 ${selected ? "border-primary bg-primary/5" : "border-border"}`}><button type="button" className="flex min-w-0 flex-1 items-center gap-2 text-left text-sm font-medium" onClick={() => onSelect?.(item.id)}><span className="truncate">{item.name}</span>{selected ? <Check className="ml-auto size-4 text-primary" /> : onSelect ? <ChevronRight className="ml-auto size-4 text-muted-foreground" /> : null}</button><Switch checked={item.active} onCheckedChange={() => toggle.mutate()} aria-label={`Set ${item.name} active`} /><Button size="icon" variant="ghost" className="size-8 text-destructive" onClick={() => remove.mutate()}><Trash2 className="size-4" /></Button></div>;
}
