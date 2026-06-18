import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Layers, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ImageField } from "@/components/admin/devices/ImageField";
import { slugify, type DeviceBrand, type DeviceSeries } from "@/lib/device-buyback";

export function SeriesManager({ categoryId }: { categoryId: string }) {
  const qc = useQueryClient();
  const [brandId, setBrandId] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DeviceSeries | null>(null);

  const { data: brands = [] } = useQuery({
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

  useEffect(() => {
    if (!brandId && brands.length) setBrandId(brands[0].id);
  }, [brands, brandId]);

  const { data: series = [], isLoading } = useQuery({
    queryKey: ["admin", "device_series", brandId],
    enabled: !!brandId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_series")
        .select("id, brand_id, name, slug, image, active, sort_order")
        .eq("brand_id", brandId)
        .order("sort_order");
      if (error) throw error;
      return data as DeviceSeries[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "device_series"] });
    qc.invalidateQueries({ queryKey: ["device", "series"] });
  };

  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("device_series").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: () => toast.error("Couldn't update the series."),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("device_series").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Series removed.");
    },
    onError: () => toast.error("Couldn't delete the series."),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Label className="shrink-0 text-xs text-muted-foreground">Brand</Label>
          <Select value={brandId} onValueChange={setBrandId}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Select brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="hero"
          size="sm"
          disabled={!brandId}
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add series
        </Button>
      </div>

      {!brandId ? (
        <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Add a brand first, then create its series.
        </p>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : series.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Layers className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No series yet</p>
          <p className="mt-1 text-sm text-muted-foreground">e.g. MacBook Air, ThinkPad, XPS.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {series.map((s) => (
            <div key={s.id} className="rounded-2xl border border-border bg-card p-3 shadow-soft">
              <div className="flex aspect-[3/2] items-center justify-center overflow-hidden rounded-xl bg-secondary">
                {s.image ? (
                  <img src={s.image} alt={s.name} className="max-h-full max-w-full object-contain p-2" />
                ) : (
                  <Layers className="size-7 text-muted-foreground" />
                )}
              </div>
              <div className="mt-2.5 flex items-center justify-between gap-1">
                <p className="min-w-0 flex-1 truncate font-bold">{s.name}</p>
                {!s.active && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                    Hidden
                  </span>
                )}
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
                <Switch checked={s.active} onCheckedChange={(v) => toggle.mutate({ id: s.id, active: v })} />
                <div className="flex items-center gap-0.5">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => {
                      setEditing(s);
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
                    onClick={() => del.mutate(s.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <SeriesDialog
        key={editing?.id ?? "new"}
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        brandId={brandId}
        nextOrder={series.length}
        onSaved={invalidate}
      />
    </div>
  );
}

function SeriesDialog({
  open,
  onOpenChange,
  editing,
  brandId,
  nextOrder,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: DeviceSeries | null;
  brandId: string;
  nextOrder: number;
  onSaved: () => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [image, setImage] = useState<string | null>(editing?.image ?? null);

  const save = useMutation({
    mutationFn: async () => {
      const payload = { name: name.trim(), slug: slugify(name) || "series", image };
      if (editing) {
        const { error } = await supabase.from("device_series").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("device_series")
          .insert({ ...payload, brand_id: brandId, sort_order: nextOrder });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Series updated." : "Series added.");
      onSaved();
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save the series."),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit series" : "Add series"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Series name</Label>
            <Input placeholder="e.g. MacBook Air" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <ImageField
            label="Image (optional)"
            value={image}
            onChange={setImage}
            maxDim={700}
            hint="Upload a photo or paste an image link (PNG, SVG, JPG)."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" disabled={!name.trim() || save.isPending} onClick={() => save.mutate()}>
            {save.isPending && <Loader2 className="size-4 animate-spin" />}
            {editing ? "Save" : "Add series"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
