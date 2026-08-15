import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, Save, Tag } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Category = { id: string; name: string };
type Rate = {
  id: string;
  category_id: string | null;
  name: string;
  price: string;
  unit: string;
  note: string | null;
  active: boolean;
  sort_order: number;
};

export function RatesPanel() {
  const qc = useQueryClient();

  const { data: categories = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scrap_categories")
        .select("id, name")
        .order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });

  const { data: rates = [], isLoading } = useQuery({
    queryKey: ["admin", "rates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scrap_rates")
        .select("id, category_id, name, price, unit, note, active, sort_order")
        .order("sort_order");
      if (error) throw error;
      return data as Rate[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "rates"] });
    qc.invalidateQueries({ queryKey: ["scrap-rates", "active"] });
  };

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newUnit, setNewUnit] = useState("/ kg");
  const [newCat, setNewCat] = useState("");

  const addMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("scrap_rates").insert({
        name: newName.trim(),
        price: newPrice.trim(),
        unit: newUnit.trim() || "/ kg",
        category_id: newCat || null,
        sort_order: rates.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Rate added.");
      setNewName("");
      setNewPrice("");
      setNewUnit("/ kg");
      setNewCat("");
    },
    onError: () => toast.error("Couldn't add the rate."),
  });

  return (
    <div className="space-y-6">
      {/* add new */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Plus className="size-4 text-primary" /> Add a scrap rate
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input placeholder="Item name" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Input placeholder="Price (e.g. 15 or Quoted)" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} />
          <Input placeholder="Unit (/ kg)" value={newUnit} onChange={(e) => setNewUnit(e.target.value)} />
          <Select value={newCat} onValueChange={setNewCat}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="hero"
          className="mt-3"
          disabled={!newName.trim() || !newPrice.trim() || addMutation.isPending}
          onClick={() => addMutation.mutate()}
        >
          {addMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Add rate"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-2.5">
          {rates.map((rate) => (
            <RateRow key={rate.id} rate={rate} categories={categories} onChanged={invalidate} />
          ))}
        </div>
      )}
    </div>
  );
}

function RateRow({
  rate,
  categories,
  onChanged,
}: {
  rate: Rate;
  categories: Category[];
  onChanged: () => void;
}) {
  const [price, setPrice] = useState(rate.price);
  const [unit, setUnit] = useState(rate.unit);
  const [active, setActive] = useState(rate.active);
  const [catId, setCatId] = useState(rate.category_id ?? "");

  const dirty =
    price !== rate.price ||
    unit !== rate.unit ||
    active !== rate.active ||
    (catId || null) !== rate.category_id;

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("scrap_rates")
        .update({ price: price.trim(), unit: unit.trim(), active, category_id: catId || null })
        .eq("id", rate.id);
      if (error) throw error;
    },
    onSuccess: () => {
      onChanged();
      toast.success(`${rate.name} updated.`);
    },
    onError: () => toast.error("Couldn't save changes."),
  });

  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("scrap_rates").delete().eq("id", rate.id);
      if (error) throw error;
    },
    onSuccess: () => {
      onChanged();
      toast.success("Rate removed.");
    },
    onError: () => toast.error("Couldn't delete the rate."),
  });

  return (
    <div className="rounded-2xl border border-border bg-card p-3.5">
      <div className="flex items-center gap-2">
        <Tag className="size-4 shrink-0 text-primary" />
        <p className="flex-1 font-semibold">{rate.name}</p>
        <Switch checked={active} onCheckedChange={setActive} aria-label="Active" />
      </div>
      <div className="mt-3 grid items-end gap-2.5 sm:grid-cols-3">
        <div className="space-y-1">
          <Label className="text-xs">Price</Label>
          <Input className="h-9" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Unit</Label>
          <Input className="h-9" value={unit} onChange={(e) => setUnit(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label className="text-xs">Category</Label>
          <Select value={catId} onValueChange={setCatId}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="None" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          variant="hero"
          disabled={!dirty || save.isPending}
          onClick={() => save.mutate()}
        >
          {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4" /> Save</>}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="text-destructive"
          disabled={del.isPending}
          onClick={() => del.mutate()}
        >
          <Trash2 className="size-4" /> Delete
        </Button>
      </div>
    </div>
  );
}
