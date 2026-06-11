import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Trash2, Loader2, Save, ArrowUp, ArrowDown, Layers } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  sort_order: number;
  active: boolean;
};

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export function CategoriesPanel() {
  const qc = useQueryClient();
  const [newName, setNewName] = useState("");

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["admin", "categories", "full"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scrap_categories")
        .select("id, name, slug, icon, sort_order, active")
        .order("sort_order");
      if (error) throw error;
      return data as Category[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    qc.invalidateQueries({ queryKey: ["admin", "categories", "full"] });
  };

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("scrap_categories").insert({
        name: newName.trim(),
        slug: slugify(newName) || `cat-${Date.now()}`,
        sort_order: categories.length + 1,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setNewName("");
      toast.success("Category added.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't add category."),
  });

  const swap = useMutation({
    mutationFn: async ({ a, b }: { a: Category; b: Category }) => {
      const { error: e1 } = await supabase
        .from("scrap_categories")
        .update({ sort_order: b.sort_order })
        .eq("id", a.id);
      const { error: e2 } = await supabase
        .from("scrap_categories")
        .update({ sort_order: a.sort_order })
        .eq("id", b.id);
      if (e1 || e2) throw e1 || e2;
    },
    onSuccess: invalidate,
    onError: () => toast.error("Couldn't reorder."),
  });

  const move = (index: number, dir: -1 | 1) => {
    const a = categories[index];
    const b = categories[index + dir];
    if (a && b) swap.mutate({ a, b });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="flex items-center gap-2 text-sm font-bold">
          <Plus className="size-4 text-primary" /> Add a category
        </p>
        <div className="mt-3 flex gap-2">
          <Input
            placeholder="e.g. Furniture"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button variant="hero" disabled={!newName.trim() || add.isPending} onClick={() => add.mutate()}>
            {add.isPending ? <Loader2 className="size-4 animate-spin" /> : "Add"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-2.5">
          {categories.map((cat, i) => (
            <CategoryRow
              key={cat.id}
              cat={cat}
              first={i === 0}
              last={i === categories.length - 1}
              onMoveUp={() => move(i, -1)}
              onMoveDown={() => move(i, 1)}
              onChanged={invalidate}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CategoryRow({
  cat,
  first,
  last,
  onMoveUp,
  onMoveDown,
  onChanged,
}: {
  cat: Category;
  first: boolean;
  last: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onChanged: () => void;
}) {
  const [name, setName] = useState(cat.name);
  const [active, setActive] = useState(cat.active);
  const dirty = name !== cat.name || active !== cat.active;

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("scrap_categories")
        .update({ name: name.trim(), active })
        .eq("id", cat.id);
      if (error) throw error;
    },
    onSuccess: () => {
      onChanged();
      toast.success("Category updated.");
    },
    onError: () => toast.error("Couldn't save changes."),
  });

  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("scrap_categories").delete().eq("id", cat.id);
      if (error) throw error;
    },
    onSuccess: () => {
      onChanged();
      toast.success("Category removed.");
    },
    onError: () => toast.error("Couldn't delete the category."),
  });

  return (
    <div className="flex flex-wrap items-center gap-2.5 rounded-2xl border border-border bg-card p-3.5">
      <Layers className="size-4 shrink-0 text-primary" />
      <Input className="h-9 w-40 flex-1 min-w-32" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Switch checked={active} onCheckedChange={setActive} aria-label="Active" />
        Active
      </div>
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost" className="size-8" disabled={first} onClick={onMoveUp}>
          <ArrowUp className="size-4" />
        </Button>
        <Button size="icon" variant="ghost" className="size-8" disabled={last} onClick={onMoveDown}>
          <ArrowDown className="size-4" />
        </Button>
      </div>
      <Button size="sm" variant="hero" disabled={!dirty || save.isPending} onClick={() => save.mutate()}>
        {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4" /> Save</>}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="size-8 text-destructive"
        disabled={del.isPending}
        onClick={() => del.mutate()}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
