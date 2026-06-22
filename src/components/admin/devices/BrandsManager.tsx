import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, Loader2, Pencil, Plus, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageField } from "@/components/admin/devices/ImageField";
import { slugify, type DeviceBrand } from "@/lib/device-buyback";

export function BrandsManager({ categoryId }: { categoryId: string }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DeviceBrand | null>(null);

  const { data: brands = [], isLoading } = useQuery({
    queryKey: ["admin", "device_brands", categoryId],
    enabled: !!categoryId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_brands")
        .select("id, category_id, name, slug, logo, active, sort_order")
        .eq("category_id", categoryId)
        .order("sort_order");
      if (error) throw error;
      return data as DeviceBrand[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "device_brands"] });
    qc.invalidateQueries({ queryKey: ["device", "brands"] });
  };

  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("device_brands").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: () => toast.error("Couldn't update the brand."),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("device_brands").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Brand removed.");
    },
    onError: () => toast.error("Couldn't delete the brand."),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {brands.length} brand{brands.length === 1 ? "" : "s"}
        </p>
        <Button
          variant="hero"
          size="sm"
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add brand
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : brands.length === 0 ? (
        <EmptyState onAdd={() => setOpen(true)} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((b) => (
            <div key={b.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft">
              <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl bg-secondary">
                {b.logo ? (
                  <img src={b.logo} alt={b.name} className="max-h-full max-w-full object-contain p-2" />
                ) : (
                  <Tag className="size-7 text-muted-foreground" />
                )}
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-1">
                <p className="min-w-0 flex-1 truncate font-bold">{b.name}</p>
                {!b.active && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    Hidden
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <Switch checked={b.active} onCheckedChange={(v) => toggle.mutate({ id: b.id, active: v })} />
                <div className="flex items-center gap-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => {
                      setEditing(b);
                      setOpen(true);
                    }}
                  >
                    <Pencil className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8 text-destructive"
                    disabled={del.isPending}
                    onClick={() => del.mutate(b.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BrandDialog
        key={editing?.id ?? "new"}
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        categoryId={categoryId}
        nextOrder={brands.length}
        onSaved={invalidate}
      />
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
      <Tag className="mx-auto size-8 text-muted-foreground" />
      <p className="mt-3 font-semibold">No brands yet</p>
      <p className="mt-1 text-sm text-muted-foreground">Add the brands customers can choose from.</p>
      <Button variant="hero" className="mt-5" onClick={onAdd}>
        <Plus className="size-4" /> Add brand
      </Button>
    </div>
  );
}

function BrandDialog({
  open,
  onOpenChange,
  editing,
  categoryId,
  nextOrder,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: DeviceBrand | null;
  categoryId: string;
  nextOrder: number;
  onSaved: () => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [logo, setLogo] = useState<string | null>(editing?.logo ?? null);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { name: name.trim(), logo, slug: slugify(name) || "brand" };
      if (editing) {
        const { error } = await supabase.from("device_brands").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("device_brands")
          .insert({ ...payload, category_id: categoryId, sort_order: nextOrder });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Brand updated." : "Brand added.");
      onSaved();
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save the brand."),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit brand" : "Add brand"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Brand name</Label>
            <Input placeholder="e.g. Apple" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <ImageField
            label="Logo"
            value={logo}
            onChange={setLogo}
            maxDim={512}
            folder="brands"
            hint="PNG, SVG or a hosted image link. Transparent logos stay transparent."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" disabled={!name.trim() || save.isPending} onClick={() => save.mutate()}>
            {save.isPending && <Loader2 className="size-4 animate-spin" />}
            {editing ? "Save" : "Add brand"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
