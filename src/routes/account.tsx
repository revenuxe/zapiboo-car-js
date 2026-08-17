import { useEffect, useState } from "react";
import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Pencil, User as UserIcon } from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { displayName } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PageLoader } from "@/components/PageLoader";

export const Route = createFileRoute("/account")({ ssr: false, head: () => ({ meta: [{ title: "My account | HuluMart" }, { name: "robots", content: "noindex, nofollow" }] }), component: AccountPage });
type Profile = { full_name: string; whatsapp: string; address: string; pincode: string };

function AccountPage() {
  const navigate = useNavigate(); const qc = useQueryClient(); const [user, setUser] = useState<User | null>(null); const [checking, setChecking] = useState(true); const [editing, setEditing] = useState(false);
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  useEffect(() => { supabase.auth.getUser().then(({ data }) => { if (!data.user) return navigate({ to: "/auth" }); setUser(data.user); setChecking(false); }); }, [navigate]);
  const { data: profile, isLoading } = useQuery({ queryKey: ["my-profile", user?.id], enabled: !!user, queryFn: async () => { const { data, error } = await supabase.from("user_profiles").select("full_name, whatsapp, address, pincode").eq("user_id", user!.id).maybeSingle(); if (error) throw error; return data; } });
  const [form, setForm] = useState<Profile>({ full_name: "", whatsapp: "", address: "", pincode: "" });
  useEffect(() => { if (user) setForm({ full_name: profile?.full_name ?? displayName(user), whatsapp: profile?.whatsapp ?? "", address: profile?.address ?? "", pincode: profile?.pincode ?? "" }); }, [profile, user]);
  const save = useMutation({ mutationFn: async () => { if (!user) return; if (form.full_name.trim().length < 2) throw new Error("Enter your name."); if (form.address && form.address.trim().length < 10) throw new Error("Add a complete pickup address."); const { error } = await supabase.from("user_profiles").upsert({ user_id: user.id, full_name: form.full_name.trim(), whatsapp: form.whatsapp.trim() || null, address: form.address.trim() || null, pincode: form.pincode.trim() || null }, { onConflict: "user_id" }); if (error) throw error; }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["my-profile", user?.id] }); setEditing(false); toast.success("Profile saved."); }, onError: (e) => toast.error(e instanceof Error ? e.message : "Couldn't save profile.") });
  const signOut = async () => { await qc.cancelQueries(); qc.clear(); await supabase.auth.signOut(); navigate({ to: "/", replace: true }); };
  const update = (key: keyof Profile, value: string) => setForm((p) => ({ ...p, [key]: value }));
  if (pathname !== "/account") return <Outlet />;
  if (checking || !user) return <PageLoader label="Loading your account" />;
  return <div className="bg-secondary/30"><div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14"><div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-soft"><div className="flex items-center gap-4"><div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green"><UserIcon className="size-7" /></div><div><h1 className="text-xl font-bold">{displayName(user)}</h1><p className="text-sm text-muted-foreground">{user.email}</p></div></div><Button variant="outline" size="sm" onClick={signOut}><LogOut className="size-4" /> Sign out</Button></div><section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-soft"><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold">My profile</h2><p className="mt-1 text-sm text-muted-foreground">Your saved details for laptop quotes and scrap pickups.</p></div><Button variant="outline" size="sm" onClick={() => setEditing(!editing)}><Pencil className="size-4" /> {editing ? "Close" : "Edit"}</Button></div>{isLoading ? <Loader2 className="mx-auto my-8 size-5 animate-spin text-primary" /> : editing ? <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Name" value={form.full_name} onChange={(v) => update("full_name", v)} /><Field label="WhatsApp number" value={form.whatsapp} onChange={(v) => update("whatsapp", v)} /><div className="space-y-2 sm:col-span-2"><Label>Pickup address</Label><Textarea rows={3} value={form.address} placeholder="Flat / house number, street and landmark" onChange={(e) => update("address", e.target.value)} /></div><Field label="Pincode" value={form.pincode} onChange={(v) => update("pincode", v.replace(/\D/g, ""))} /><div className="flex items-end"><Button onClick={() => save.mutate()} disabled={save.isPending}>{save.isPending && <Loader2 className="size-4 animate-spin" />} Save profile</Button></div></div> : <div className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><Detail label="Name" value={profile?.full_name || displayName(user)} /><Detail label="WhatsApp" value={profile?.whatsapp || "Not added"} /><div className="sm:col-span-2"><Detail label="Pickup address" value={[profile?.address, profile?.pincode].filter(Boolean).join(", ") || "Not added"} /></div></div>}</section></div></div>;
}
function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) { return <div className="space-y-2"><Label>{label}</Label><Input value={value} onChange={(e) => onChange(e.target.value)} /></div>; }
function Detail({ label, value }: { label: string; value: string }) { return <div><p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p><p className="mt-1 font-medium">{value}</p></div>; }
