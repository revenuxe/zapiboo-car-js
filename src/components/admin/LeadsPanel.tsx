import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye,
  Search,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Boxes,
  Loader2,
  Inbox,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type Lead = {
  id: string;
  scrap_mode: string;
  items: string[];
  size_tier: string | null;
  has_photo: boolean;
  photo_url: string | null;
  locality: string | null;
  pincode: string | null;
  address: string | null;
  name: string;
  phone: string;
  preferred_date: string | null;
  slot: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
  notes: string | null;
  created_at: string;
};

const STATUSES = ["new", "contacted", "scheduled", "done", "cancelled"] as const;

const statusStyle: Record<string, string> = {
  new: "bg-primary/15 text-primary",
  contacted: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  scheduled: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  done: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  cancelled: "bg-destructive/15 text-destructive",
};

function StatusChip({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide",
        statusStyle[status] ?? "bg-secondary text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

export function LeadsPanel() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [draftStatus, setDraftStatus] = useState("new");
  const [draftNotes, setDraftNotes] = useState("");

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["admin", "leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Lead[];
    },
  });

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filter !== "all" && l.status !== filter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.phone.includes(q) ||
        (l.locality ?? "").toLowerCase().includes(q) ||
        (l.pincode ?? "").includes(q)
      );
    });
  }, [leads, query, filter]);

  const openLead = (lead: Lead) => {
    setSelected(lead);
    setDraftStatus(lead.status);
    setDraftNotes(lead.notes ?? "");
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!selected) return;
      const { error } = await supabase
        .from("leads")
        .update({ status: draftStatus, notes: draftNotes })
        .eq("id", selected.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "leads"] });
      toast.success("Lead updated.");
      setSelected(null);
    },
    onError: () => toast.error("Couldn't update the lead."),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "leads"] });
      toast.success("Lead deleted.");
      setSelected(null);
    },
    onError: () => toast.error("Couldn't delete the lead."),
  });

  return (
    <div>
      {/* controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, phone, area…"
            className="h-11 pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="h-11 sm:w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s} className="capitalize">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* list */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
          <Inbox className="size-8 text-muted-foreground" />
          <p className="mt-3 text-sm text-muted-foreground">No leads yet.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-2.5">
          {filtered.map((lead) => (
            <motion.div
              key={lead.id}
              layout
              className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3.5"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-foreground">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate font-semibold">{lead.name}</p>
                  <StatusChip status={lead.status} />
                </div>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {lead.phone} · {lead.locality ?? "—"} · {lead.preferred_date ?? "no date"}
                </p>
              </div>
              <Button
                size="icon"
                variant="secondary"
                className="size-9 shrink-0 rounded-full"
                onClick={() => openLead(lead)}
                aria-label={`View ${lead.name}'s booking`}
              >
                <Eye className="size-4" />
              </Button>
            </motion.div>
          ))}
        </div>
      )}

      {/* compact lead modal */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-3xl p-0">
          <AnimatePresence>
            {selected && (
              <div>
                <DialogHeader className="bg-gradient-brand px-5 pb-5 pt-6 text-primary-foreground">
                  <DialogTitle className="text-lg">{selected.name}</DialogTitle>
                  <p className="text-sm text-primary-foreground/80">{selected.phone}</p>
                </DialogHeader>

                <div className="space-y-4 px-5 py-5">
                  <div className="grid gap-2.5 text-sm">
                    <Row icon={Boxes} label={
                      selected.scrap_mode === "specific" && selected.items.length
                        ? selected.items.join(", ")
                        : "Mixed scrap"
                    } sub={selected.size_tier ?? undefined} />
                    <Row icon={MapPin} label={`${selected.locality ?? "—"} ${selected.pincode ?? ""}`} sub={selected.address ?? undefined} />
                    <Row icon={Calendar} label={`${selected.preferred_date ?? "No date"}`} sub={selected.slot ?? undefined} />
                    <Row icon={Phone} label={selected.phone} />
                    {selected.photo_url && (
                      <div className="space-y-2">
                        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                          <Camera className="size-4 text-primary" /> Uploaded photo
                        </p>
                        <a href={selected.photo_url} target="_blank" rel="noreferrer" className="block">
                          <img
                            src={selected.photo_url}
                            alt="Uploaded scrap"
                            className="max-h-64 w-full rounded-xl border border-border object-cover"
                          />
                        </a>
                      </div>
                    )}
                    {selected.lat != null && selected.lng != null && (
                      <a
                        href={`https://www.google.com/maps?q=${selected.lat},${selected.lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        <ExternalLink className="size-4" /> Open pinned location
                      </a>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label>Status</Label>
                    <Select value={draftStatus} onValueChange={setDraftStatus}>
                      <SelectTrigger className="h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map((s) => (
                          <SelectItem key={s} value={s} className="capitalize">
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Notes</Label>
                    <Textarea
                      rows={3}
                      placeholder="Internal notes about this pickup…"
                      value={draftNotes}
                      onChange={(e) => setDraftNotes(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="hero"
                      className="flex-1"
                      onClick={() => saveMutation.mutate()}
                      disabled={saveMutation.isPending}
                    >
                      {saveMutation.isPending ? <Loader2 className="size-4 animate-spin" /> : "Save changes"}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="icon" className="size-10 shrink-0 text-destructive">
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-3xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this lead?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This permanently removes {selected.name}'s booking. This can't be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteMutation.mutate(selected.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({
  icon: Icon,
  label,
  sub,
}: {
  icon: typeof MapPin;
  label: string;
  sub?: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="font-medium text-foreground">{label}</p>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </div>
    </div>
  );
}
