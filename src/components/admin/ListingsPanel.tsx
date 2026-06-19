import { useMemo, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ImagePlus,
  Loader2,
  Package,
  Pencil,
  Plus,
  Save,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONDITIONS,
  conditionLabel,
  formatListingPrice,
  slugify,
  type ScrapListing,
} from "@/lib/scrap-listings";
import { uploadImageToS3 } from "@/lib/s3-upload";

type Category = { id: string; name: string };

type FormState = {
  title: string;
  category_id: string;
  subcategory: string;
  condition: string;
  price: string;
  unit: string;
  quantity: string;
  location: string;
  description: string;
  images: string[];
  featured: boolean;
  active: boolean;
};

const emptyForm: FormState = {
  title: "",
  category_id: "",
  subcategory: "",
  condition: "used",
  price: "",
  unit: "/ kg",
  quantity: "",
  location: "Bengaluru",
  description: "",
  images: [],
  featured: false,
  active: true,
};

const MAX_IMAGES = 6;

export function ListingsPanel() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<ScrapListing | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

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

  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["admin", "listings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scrap_listings")
        .select(
          "id, title, slug, description, category_id, subcategory, condition, price, unit, quantity, location, images, featured, active, sort_order, created_at",
        )
        .order("featured", { ascending: false })
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ScrapListing[];
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "listings"] });
    qc.invalidateQueries({ queryKey: ["listings"] });
  };

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("scrap_listings").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Listing removed.");
    },
    onError: () => toast.error("Couldn't delete the listing."),
  });

  const toggle = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: "active" | "featured"; value: boolean }) => {
      const patch = field === "active" ? { active: value } : { featured: value };
      const { error } = await supabase.from("scrap_listings").update(patch).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: () => toast.error("Couldn't update the listing."),
  });

  const categoryName = (id: string | null) => categories.find((c) => c.id === id)?.name ?? "Uncategorised";

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return listings;
    return listings.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        (l.subcategory ?? "").toLowerCase().includes(q) ||
        categoryName(l.category_id).toLowerCase().includes(q),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, listings, categories]);

  const openNew = () => {
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (listing: ScrapListing) => {
    setEditing(listing);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <ListingForm
        categories={categories}
        editing={editing}
        onClose={() => setShowForm(false)}
        onSaved={() => {
          invalidate();
          setShowForm(false);
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search listings…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="hero" onClick={openNew}>
          <Plus className="size-4" /> New listing
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <Package className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No listings yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first scrap listing so customers can browse it.
          </p>
          <Button variant="hero" className="mt-5" onClick={openNew}>
            <Plus className="size-4" /> Create a listing
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((listing) => (
            <div
              key={listing.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-soft"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
                {listing.images[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center text-muted-foreground">
                    <Package className="size-9" />
                  </div>
                )}
                <div className="absolute left-2 top-2 flex gap-1.5">
                  {listing.featured && (
                    <span className="flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-primary-foreground">
                      <Star className="size-3 fill-current" /> Featured
                    </span>
                  )}
                  {!listing.active && (
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      Hidden
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3.5">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="min-w-0 flex-1 truncate font-bold">{listing.title}</h3>
                  <span className="shrink-0 text-sm font-extrabold text-primary">
                    {formatListingPrice(listing.price)}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {categoryName(listing.category_id)}
                  {listing.subcategory ? ` · ${listing.subcategory}` : ""} · {conditionLabel(listing.condition)}
                </p>

                <div className="mt-3 flex items-center gap-3 border-t border-border pt-3 text-xs">
                  <label className="flex items-center gap-1.5 text-muted-foreground">
                    <Switch
                      checked={listing.active}
                      onCheckedChange={(v) => toggle.mutate({ id: listing.id, field: "active", value: v })}
                    />
                    Active
                  </label>
                  <label className="flex items-center gap-1.5 text-muted-foreground">
                    <Switch
                      checked={listing.featured}
                      onCheckedChange={(v) => toggle.mutate({ id: listing.id, field: "featured", value: v })}
                    />
                    Featured
                  </label>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => openEdit(listing)}>
                    <Pencil className="size-4" /> Edit
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-9 text-destructive"
                    disabled={del.isPending}
                    onClick={() => del.mutate(listing.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ListingForm({
  categories,
  editing,
  onClose,
  onSaved,
}: {
  categories: Category[];
  editing: ScrapListing | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState<FormState>(
    editing
      ? {
          title: editing.title,
          category_id: editing.category_id ?? "",
          subcategory: editing.subcategory ?? "",
          condition: editing.condition,
          price: editing.price ?? "",
          unit: editing.unit,
          quantity: editing.quantity ?? "",
          location: editing.location ?? "",
          description: editing.description ?? "",
          images: editing.images ?? [],
          featured: editing.featured,
          active: editing.active,
        }
      : emptyForm,
  );
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = MAX_IMAGES - form.images.length;
    if (room <= 0) {
      toast.error(`You can add up to ${MAX_IMAGES} images.`);
      return;
    }
    setUploading(true);
    try {
      const picked = Array.from(files).slice(0, room);
      const uploaded = await Promise.all(picked.map((f) => uploadImageToS3(f, "listings")));
      set("images", [...form.images, ...uploaded]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't upload one of the images.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (index: number) =>
    set("images", form.images.filter((_, i) => i !== index));

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        subcategory: form.subcategory.trim() || null,
        category_id: form.category_id || null,
        condition: form.condition,
        price: form.price.trim() || null,
        unit: form.unit.trim() || "/ kg",
        quantity: form.quantity.trim() || null,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        images: form.images,
        featured: form.featured,
        active: form.active,
      };
      if (editing) {
        const { error } = await supabase.from("scrap_listings").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const slug = `${slugify(form.title) || "listing"}-${Math.random().toString(36).slice(2, 6)}`;
        const { error } = await supabase.from("scrap_listings").insert({ ...payload, slug });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Listing updated." : "Listing published.");
      onSaved();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save the listing."),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">{editing ? "Edit listing" : "New listing"}</h2>
          <p className="text-sm text-muted-foreground">Fill in the details customers will see.</p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="size-5" />
        </Button>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Photos ({form.images.length}/{MAX_IMAGES})
        </Label>
        <div className="mt-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {form.images.map((src, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
              <img src={src} alt={`Photo ${i + 1}`} className="size-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute right-1 top-1 flex size-6 items-center justify-center rounded-full bg-background/90 text-destructive shadow"
                aria-label="Remove image"
              >
                <Trash2 className="size-3.5" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">
                  Cover
                </span>
              )}
            </div>
          ))}
          {form.images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="flex aspect-square flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
            >
              {uploading ? <Loader2 className="size-5 animate-spin" /> : <ImagePlus className="size-5" />}
              <span className="text-[10px] font-medium">Add</span>
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Title</Label>
            <Input
              placeholder="e.g. Old car body scrap (Maruti 800)"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Category</Label>
            <Select value={form.category_id} onValueChange={(v) => set("category_id", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
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

          <div className="space-y-1.5">
            <Label className="text-xs">Subcategory</Label>
            <Input
              placeholder="e.g. Car scrap, Copper wire"
              value={form.subcategory}
              onChange={(e) => set("subcategory", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Condition</Label>
            <Select value={form.condition} onValueChange={(v) => set("condition", v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CONDITIONS.map((c) => (
                  <SelectItem key={c.value} value={c.value}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Quantity (optional)</Label>
            <Input
              placeholder="e.g. 200 kg available"
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Price</Label>
            <Input
              placeholder="e.g. 30 or Quoted"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Unit</Label>
            <Input placeholder="/ kg" value={form.unit} onChange={(e) => set("unit", e.target.value)} />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Location</Label>
            <Input
              placeholder="e.g. Koramangala, Bengaluru"
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-xs">Description</Label>
            <Textarea
              rows={4}
              placeholder="Describe the scrap — material, size, condition notes, anything buyers should know."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-border pt-4">
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={form.active} onCheckedChange={(v) => set("active", v)} /> Active (visible)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={form.featured} onCheckedChange={(v) => set("featured", v)} /> Featured
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="hero"
          disabled={!form.title.trim() || save.isPending || uploading}
          onClick={() => save.mutate()}
        >
          {save.isPending ? <Loader2 className="size-4 animate-spin" /> : <><Save className="size-4" /> {editing ? "Save changes" : "Publish listing"}</>}
        </Button>
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
