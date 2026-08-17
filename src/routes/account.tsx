import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays, Clock, Loader2, LogOut, MapPin, Pencil, Trash2, Truck, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { displayName } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageLoader } from "@/components/PageLoader";

export const Route = createFileRoute("/account")({
  ssr: false,
  head: () => ({ meta: [{ title: "My account | HuluMart" }, { name: "robots", content: "noindex, nofollow" }] }),
  component: AccountPage,
});

type Profile = { full_name: string; whatsapp: string; address: string; pincode: string };

function AccountPage() {
  const navigate = useNavigate(); const qc = useQueryClient();
  const [user, setUser] = useState<User | null>(null); const [checking, setChecking] = useState(true);
  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (!data.user) return navigate({ to: "/auth" }); setUser(data.user); setChecking(false); }); }, [navigate]);
  const signOut = async () => { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); navigate({ to: "/", replace: true }); };
  if (checking || !user) return <PageLoader label="Loading your account" />;
  return <div className="bg-secondary/30"><div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft"><div className="flex items-center gap-4"><div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green"><UserIcon className="size-7" /></div><div><h1 className="text-xl font-bold">{displayName(user)}</h1><p className="text-sm text-muted-foreground">{user.email}</p></div></div><Button variant="outline" size="sm" onClick={signOut}><LogOut className="size-4" /> Sign out</Button></div>
    <ProfileDetails user={user} /><ScrapPickups userId={user.id} />
  </div></div>;
}

function ProfileDetails({ user }: { user: User }) {
  const qc = useQueryClient(); const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Profile>({ full_name: displayName(user), whatsapp: "", address: "", pincode: "" });
  const { data: profile, isLoading } = useQuery({ queryKey: ["my-profile", user.id], queryFn: async () => { const { data, error } = await supabase.from("user_profiles").select("full_name, whatsapp, address, pincode").eq("user_id", user.id).maybeSingle(); if (error) throw error; return data; } });
  useEffect(() => { if (profile) setForm({ full_name: profile.full_name ?? displayName(user), whatsapp: profile.whatsapp ?? "", address: profile.address ?? "", pincode: profile.pincode ?? "" }); }, [profile, user]);
  const save = useMutation({ mutationFn: async () => { if (form.full_name.trim().length < 2) throw new Error("Enter your name."); if (form.address && form.address.trim().length < 10) throw new Error("Add a complete pickup address."); const { error } = await supabase.from("user_profiles").upsert({ user_id: user.id, full_name: form.full_name.trim(), whatsapp: form.whatsapp.trim() || null, address: form.address.trim() || null, pincode: form.pincode.trim() || null }, { onConflict: "user_id" }); if (error) throw error; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-profile", user.id] }); setEditing(false); toast.success("Profile saved."); }, onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save profile.") });
  const update = (key: keyof Profile, value: string) => setForm((p) => ({ ...p, [key]: value }));
  return <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold">My profile</h2><p className="mt-1 text-sm text-muted-foreground">Keep your address current for faster scrap pickups.</p></div><Button variant="outline" size="sm" onClick={() => setEditing(!editing)}><Pencil className="size-4" /> {editing ? "Close" : "Edit"}</Button></div>
    {isLoading ? <Loader2 className="mx-auto my-8 size-5 animate-spin text-primary" /> : editing ? <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Name" value={form.full_name} onChange={(v) => update("full_name", v)} /><Field label="WhatsApp number" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} /><div className="space-y-2 sm:col-span-2"><Label>Pickup address</Label><Textarea rows={3} placeholder="Flat / house number, street and landmark" value={form.address} onChange={(e) => update("address", e.target.value)} /></div><Field label="Pincode" value={form.pincode} onChange={(v) => update("pincode", v.replace(/\D/g, ""))} /><div className="flex items-end"><Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending && <Loader2 className="size-4 animate-spin" />} Save profile</Button></div></div> : <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><Detail label="Name" value={profile?.full_name || displayName(user)} /><Detail label="WhatsApp" value={profile?.whatsapp || "Not added"} /><div className="sm:col-span-2"><Detail label="Pickup address" value={[profile?.address, profile?.pincode].filter(Boolean).join(", ") || "Not added"} /></div></div>}
  </section>;
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <div className="space-y-2"><Label>{label}</Label><Input value={value} onChange={(e) => onChange(e.target.value)} /></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>; }

function ScrapPickups({ userId }: { userId: string }) {
  const qc = useQueryClient();
  const { data: pickups = [], isLoading } = useQuery({ queryKey: ["my-scrap-pickups", userId], queryFn: async () => { const { data, error } = await supabase.from("leads").select("id, scrap_mode, items, status, address, pincode, preferred_date, slot").eq("user_id", userId).order("created_at", { ascending: false }); if (error) throw error; return data; } });
  const cancel = useMutation({ mutationFn: async (id: string) => { const { error } = await supabase.from("leads").delete().eq("id", id); if (error) throw error; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-scrap-pickups", userId] }); toast.success("Pickup request cancelled."); }, onError: () => toast.error("Couldn't cancel this pickup.") });
  return <section className="mt-8"><div className="flex items-center justify-between gap-4"><div><h2 className="text-lg font-bold">My scrap pickups</h2><p className="mt-1 text-sm text-muted-foreground">Your doorstep scrap collection requests.</p></div><Button asChild variant="hero" size="sm"><Link to="/pickup"><Truck className="size-4" /> Book pickup</Link></Button></div>
    {isLoading ? <div className="flex justify-center py-12"><Loader2 className="size-6 animate-spin text-primary" /></div> : pickups.length === 0 ? <div className="mt-5 rounded-3xl border border-dashed border-border bg-card p-10 text-center"><Truck className="mx-auto size-9 text-muted-foreground" /><p className="mt-3 font-semibold">No scrap pickups yet</p><p className="mt-1 text-sm text-muted-foreground">Book a free doorstep collection and track it here.</p><Button asChild variant="hero" className="mt-5"><Link to="/pickup">Book a pickup</Link></Button></div> : <div className="mt-5 space-y-3">{pickups.map((p) => <div key={p.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft"><div className="flex items-start justify-between gap-3"><div><p className="font-semibold">{p.scrap_mode === "mixed" ? "Mixed scrap pickup" : p.items?.join(", ") || "Scrap pickup"}</p><p className="mt-1 text-sm text-muted-foreground">{p.status === "new" ? "Request received" : p.status}</p></div><span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-bold capitalize text-primary">{p.status}</span></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted-foreground">{p.preferred_date && <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5 text-primary" /> {p.preferred_date}</span>}{p.slot && <span className="flex items-center gap-1.5"><Clock className="size-3.5 text-primary" /> {p.slot}</span>}{(p.address || p.pincode) && <span className="flex items-center gap-1.5"><MapPin className="size-3.5 text-primary" /> {[p.address, p.pincode].filter(Boolean).join(", ")}</span>}</div>{p.status === "new" && <div className="mt-3 flex justify-end border-t border-border pt-3"><Button variant="outline" size="sm" className="text-destructive" onClick={() => { if (window.confirm("Cancel this pickup request?")) cancel.mutate(p.id); }}><Trash2 className="size-4" /> Cancel pickup</Button></div>}</div>)}</div>}
  </section>;
}
