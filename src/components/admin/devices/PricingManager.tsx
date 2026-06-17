import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, SlidersHorizontal, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  KIND_OPTIONS,
  slugify,
  type ConditionGroup,
  type ConditionOption,
  type OptionKind,
} from "@/lib/device-buyback";

function kindBadge(kind: OptionKind, value: number) {
  if (kind === "bonus_fixed") return { text: `+₹${value}`, cls: "bg-primary/10 text-primary" };
  if (kind === "deduct_percent") return { text: `−${value}%`, cls: "bg-destructive/10 text-destructive" };
  return { text: `−₹${value}`, cls: "bg-destructive/10 text-destructive" };
}

export function PricingManager({ categoryId }: { categoryId: string }) {
  const qc = useQueryClient();
  const [groupOpen, setGroupOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ConditionGroup | null>(null);
  const [optionOpen, setOptionOpen] = useState(false);
  const [optionGroupId, setOptionGroupId] = useState("");
  const [editingOption, setEditingOption] = useState<ConditionOption | null>(null);

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["admin", "condition_groups", categoryId],
    enabled: !!categoryId,
    queryFn: async () => {
      const { data: g, error } = await supabase
        .from("condition_groups")
        .select("id, category_id, key, title, subtitle, selection, step_order, active")
        .eq("category_id", categoryId)
        .order("step_order");
      if (error) throw error;
      const ids = (g ?? []).map((x) => x.id);
      let opts: ConditionOption[] = [];
      if (ids.length) {
        const { data: o, error: oErr } = await supabase
          .from("condition_options")
          .select("id, group_id, label, description, kind, value, sort_order")
          .in("group_id", ids)
          .order("sort_order");
        if (oErr) throw oErr;
        opts = o as ConditionOption[];
      }
      return (g as ConditionGroup[]).map((grp) => ({
        ...grp,
        options: opts.filter((o) => o.group_id === grp.id),
      }));
    },
  });

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "condition_groups"] });
    qc.invalidateQueries({ queryKey: ["device", "conditions"] });
  };

  const delGroup = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("condition_groups").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Question removed.");
    },
    onError: () => toast.error("Couldn't delete the question."),
  });

  const delOption = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("condition_options").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Option removed.");
    },
    onError: () => toast.error("Couldn't delete the option."),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          Evaluation questions buyers answer — each option adjusts the quote.
        </p>
        <Button
          variant="hero"
          size="sm"
          onClick={() => {
            setEditingGroup(null);
            setGroupOpen(true);
          }}
        >
          <Plus className="size-4" /> Add question
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="size-6 animate-spin text-primary" />
        </div>
      ) : groups.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
          <SlidersHorizontal className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 font-semibold">No questions yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add condition questions like physical grade, issues and accessories.
          </p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-3">
          {groups.map((g) => (
            <AccordionItem
              key={g.id}
              value={g.id}
              className="overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="flex items-center gap-2 px-3">
                <AccordionTrigger className="flex-1 py-3 hover:no-underline">
                  <div className="flex items-center gap-2 text-left">
                    <span className="flex size-6 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                      {g.step_order}
                    </span>
                    <span className="font-bold">{g.title}</span>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {g.selection === "multi" ? "Multi-select" : "Single"}
                    </span>
                  </div>
                </AccordionTrigger>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8"
                  onClick={() => {
                    setEditingGroup(g);
                    setGroupOpen(true);
                  }}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="size-8 text-destructive"
                  onClick={() => delGroup.mutate(g.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <AccordionContent className="px-3 pb-3">
                <div className="space-y-2">
                  {(g.options ?? []).map((o) => {
                    const badge = kindBadge(o.kind, o.value);
                    return (
                      <div
                        key={o.id}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{o.label}</p>
                          {o.description && (
                            <p className="truncate text-xs text-muted-foreground">{o.description}</p>
                          )}
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${badge.cls}`}>
                          {badge.text}
                        </span>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7"
                          onClick={() => {
                            setOptionGroupId(g.id);
                            setEditingOption(o);
                            setOptionOpen(true);
                          }}
                        >
                          <Pencil className="size-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-7 text-destructive"
                          onClick={() => delOption.mutate(o.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setOptionGroupId(g.id);
                      setEditingOption(null);
                      setOptionOpen(true);
                    }}
                  >
                    <Plus className="size-4" /> Add option
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      <GroupDialog
        key={editingGroup?.id ?? "new-group"}
        open={groupOpen}
        onOpenChange={setGroupOpen}
        editing={editingGroup}
        categoryId={categoryId}
        nextOrder={groups.length + 1}
        onSaved={invalidate}
      />
      <OptionDialog
        key={editingOption?.id ?? `new-option-${optionGroupId}`}
        open={optionOpen}
        onOpenChange={setOptionOpen}
        editing={editingOption}
        groupId={optionGroupId}
        nextOrder={groups.find((g) => g.id === optionGroupId)?.options?.length ?? 0}
        onSaved={invalidate}
      />
    </div>
  );
}

function GroupDialog({
  open,
  onOpenChange,
  editing,
  categoryId,
  nextOrder,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: ConditionGroup | null;
  categoryId: string;
  nextOrder: number;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(editing?.title ?? "");
  const [subtitle, setSubtitle] = useState(editing?.subtitle ?? "");
  const [selection, setSelection] = useState<"single" | "multi">(editing?.selection ?? "single");
  const [step, setStep] = useState(String(editing?.step_order ?? nextOrder));

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        selection,
        step_order: Number(step) || nextOrder,
        key: editing?.key ?? (slugify(title) || "group"),
      };
      if (editing) {
        const { error } = await supabase.from("condition_groups").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("condition_groups")
          .insert({ ...payload, category_id: categoryId });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Question updated." : "Question added.");
      onSaved();
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save the question."),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit question" : "Add question"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Question</Label>
            <Input
              placeholder="e.g. Overall physical condition"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Helper text (optional)</Label>
            <Input
              placeholder="e.g. How does the body & screen look?"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Selection</Label>
              <Select value={selection} onValueChange={(v) => setSelection(v as "single" | "multi")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single choice</SelectItem>
                  <SelectItem value="multi">Multi-select</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Step order</Label>
              <Input type="number" value={step} onChange={(e) => setStep(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" disabled={!title.trim() || save.isPending} onClick={() => save.mutate()}>
            {save.isPending && <Loader2 className="size-4 animate-spin" />}
            {editing ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OptionDialog({
  open,
  onOpenChange,
  editing,
  groupId,
  nextOrder,
  onSaved,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editing: ConditionOption | null;
  groupId: string;
  nextOrder: number;
  onSaved: () => void;
}) {
  const [label, setLabel] = useState(editing?.label ?? "");
  const [description, setDescription] = useState(editing?.description ?? "");
  const [kind, setKind] = useState<OptionKind>(editing?.kind ?? "deduct_fixed");
  const [value, setValue] = useState(editing ? String(editing.value) : "");

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        label: label.trim(),
        description: description.trim() || null,
        kind,
        value: Number(value) || 0,
      };
      if (editing) {
        const { error } = await supabase.from("condition_options").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("condition_options")
          .insert({ ...payload, group_id: groupId, sort_order: nextOrder });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(editing ? "Option updated." : "Option added.");
      onSaved();
      onOpenChange(false);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save the option."),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? "Edit option" : "Add option"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Option label</Label>
            <Input
              placeholder="e.g. Weak / dead battery"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description (optional)</Label>
            <Input
              placeholder="e.g. Battery drains fast or not charging"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Effect</Label>
              <Select value={kind} onValueChange={(v) => setKind(v as OptionKind)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {KIND_OPTIONS.map((k) => (
                    <SelectItem key={k.value} value={k.value}>
                      {k.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">{kind === "deduct_percent" ? "Percent" : "Amount (₹)"}</Label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {KIND_OPTIONS.find((k) => k.value === kind)?.hint}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="hero" disabled={!label.trim() || save.isPending} onClick={() => save.mutate()}>
            {save.isPending && <Loader2 className="size-4 animate-spin" />}
            {editing ? "Save" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
