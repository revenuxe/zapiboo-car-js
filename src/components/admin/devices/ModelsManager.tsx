import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Laptop, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
import {
  formatPrice,
  slugify,
  type DeviceBrand,
  type DeviceModel,
  type DeviceSeries,
} from "@/lib/device-buyback";

export function ModelsManager({ categoryId }: { categoryId: string }) {
  const qc = useQueryClient();
  const [brandId, setBrandId] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<DeviceModel | null>(null);

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

  const { data: series = [] } = useQuery({
    queryKey: ["admin", "device_series", brandId],
    enabled: !!brandId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_series")
        .select("id, brand_id, name, slug, active, sort_order")
        .eq("brand_id", brandId)
        .order("sort_order");
      if (error) throw error;
      return data as DeviceSeries[];
    },
  });

  useEffect(() => {
    setSeriesId(series.length ? series[0].id : "");
  }, [series]);

  const { data: models = [], isLoading } = useQuery({
    queryKey: ["admin", "device_models", seriesId],
    enabled: !!seriesId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("device_models")
        .select("id, series_id, name, slug, base_price, image, active, sort_order")
        .eq("series_id", seriesId)
        .order("sort_order");
      if (error) throw error;
      return data as DeviceModel[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "device_models"] });
    qc.invalidateQueries({ queryKey: ["device", "models"] });
  };

  const toggle = useMutation({
    mutationFn: async ({ id, active }: { id: string; active: boolean }) => {
      const { error } = await supabase.from("device_models").update({ active }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: () => toast.error("Couldn't update the model."),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("device_models").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Model removed.");
    },
    onError: () => toast.error("Couldn't delete the model."),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={brandId} onValueChange={setBrandId}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              {brands.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={seriesId} onValueChange={setSeriesId} disabled={!series.length}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Series" />
            </SelectTrigger>
            <SelectContent>
              {series.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="hero"
          size="sm"
          disabled={!seriesId}
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
        >
          <Plus className="size-4" /> Add model
        </Button>
      </div>

      {!seriesId ? (
        <p className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Pick a brand and series to manage its models.
        </p>
      ) : isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : models.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Laptop className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No models yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Add models with their best-case buying price.</p>
        </div>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {models.map((m) => (
            <div key={m.id} className="flex items-center gap-3 p-3">
              <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                {m.image ? (
                  <img src={m.image} alt={m.name} className="size-full object-cover" />
                ) : (
                  <Laptop className="size-5 text-muted-foreground" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{m.name}</p>
                <p className="text-sm font-bold text-primary">{formatPrice(m.base_price)}</p>
              </div>
              {!m.active && (
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  Hidden
                </span>
              )}
              <Switch checked={m.active} onCheckedChange={(v) => toggle.mutate({ id: m.id, active: v })} />
              <Button
                size="icon"
                variant="ghost"
                className="size-8"
                onClick={() => {
                  setEditing(m);
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
                onClick={() => del.mutate(m.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <ModelDialog
        key={editing?.id ?? "new"}
        open={open}
        onOpenChange={setOpen}
        editing={editing}
        seriesId={seriesId}
        nextOrder={models.length}
        onSaved={invalidate}
      />
    </div>
  );
}

function ModelDialog({
  open,
  onOpenChange,
  editing,
  seriesId,
  nextOrder,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: DeviceModel | null;
  seriesId: string;
  nextOrder: number;
  onSaved: () => void;
}) {
  const [name, setName] = useState(editing?.name ?? "");
  const [price, setPrice] = useState(editing ? String(editing.base_price) : "");
  const [image, setImage] = useState<string | null>(editing?.image ?? null);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        name: name.trim(),
        slug: slugify(name) || "model",
        base_price: Number(price) || 0,
        image,
      };
      if (editing) {
        const { error } = await supabase.from("device_models").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("device_models")
          .insert({ ...payload, series_id: seriesId, sort_order: nextOrder });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Model updated." : "Model added.");
      onSaved();
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save the model."),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit model" : "Add model"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Model name</Label>
            <Input
              placeholder="e.g. MacBook Air M2 (2022)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Base buying price (₹)</Label>
            <Input
              type="number"
              inputMode="numeric"
              placeholder="e.g. 58000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground">
              The best-case quote for a flawless unit. Conditions deduct from this.
            </p>
          </div>
          <ImageField
            label="Image (optional)"
            value={image}
            onChange={setImage}
            shape="contain"
            maxDim={800}
            folder="models"
            hint="Upload a photo or paste a product image link (PNG, SVG, JPG)."
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" disabled={!name.trim() || save.isPending} onClick={() => save.mutate()}>
            {save.isPending && <Loader2 className="size-4 animate-spin" />}
            {editing ? "Save" : "Add model"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
