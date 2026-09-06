"use client";

import { GripVertical } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type OrderedItem = { id: string };

export function DraggableOrder<T extends OrderedItem>({ items, onReorder, renderItem, className, disabled = false }: { items: T[]; onReorder: (ids: string[]) => void; renderItem: (item: T, index: number) => ReactNode; className?: string; disabled?: boolean }) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);
  const drop = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    const next = [...items];
    const from = next.findIndex((item) => item.id === draggedId);
    const to = next.findIndex((item) => item.id === targetId);
    if (from < 0 || to < 0) return;
    next.splice(to, 0, next.splice(from, 1)[0]);
    onReorder(next.map((item) => item.id));
  };
  return <div className={className}>{items.map((item, index) => <div key={item.id} draggable={!disabled} onDragStart={() => !disabled && setDraggedId(item.id)} onDragOver={(event) => { if (!disabled) { event.preventDefault(); setOverId(item.id); } }} onDrop={() => drop(item.id)} onDragEnd={() => { setDraggedId(null); setOverId(null); }} className={cn("relative transition-opacity", draggedId === item.id && "opacity-40", overId === item.id && draggedId !== item.id && "ring-2 ring-primary ring-offset-2 rounded-3xl")}>{!disabled && <span title="Drag to reorder" className="absolute left-2 top-2 z-10 flex size-8 cursor-grab items-center justify-center rounded-lg bg-background/90 text-muted-foreground shadow-sm active:cursor-grabbing"><GripVertical className="size-4" /></span>}{renderItem(item, index)}</div>)}</div>;
}
