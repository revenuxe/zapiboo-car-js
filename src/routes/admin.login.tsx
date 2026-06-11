import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { motion } from "motion/react";
import { Loader2, Lock, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { getAdminExists, createFirstAdmin } from "@/lib/admin-setup.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login | HuluMart" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

async function isCurrentUserAdmin() {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return false;
  const { data: roles } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .eq("role", "admin")
    .maybeSingle();
  return !!roles;
}

function AdminLogin() {
  const navigate = useNavigate();
  const checkAdminExists = useServerFn(getAdminExists);
  const setupAdmin = useServerFn(createFirstAdmin);

  const [mode, setMode] = useState<"loading" | "signin" | "setup">("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      // Already signed in as admin? Skip straight to the dashboard.
      if (await isCurrentUserAdmin()) {
        navigate({ to: "/admin/dashboard" });
        return;
      }
      try {
        const { exists } = await checkAdminExists();
        if (active) setMode(exists ? "signin" : "setup");
      } catch {
        if (active) setMode("signin");
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return toast.error("Enter your email and password.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    if (error) {
      setBusy(false);
      return toast.error("Invalid email or password.");
    }
    const admin = await isCurrentUserAdmin();
    setBusy(false);
    if (!admin) {
      await supabase.auth.signOut();
      return toast.error("This account doesn't have admin access.");
    }
    toast.success("Welcome back!");
    navigate({ to: "/admin/dashboard" });
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 8)
      return toast.error("Use a valid email and a password of 8+ characters.");
    setBusy(true);
    try {
      await setupAdmin({ data: { email: email.trim(), password } });
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) throw error;
      toast.success("Admin account created!");
      navigate({ to: "/admin/dashboard" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create the admin account.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-navy px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <Logo invert className="mb-5" />
          <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green">
            <ShieldCheck className="size-6" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-navy-foreground">
            {mode === "setup" ? "Create admin account" : "Admin sign in"}
          </h1>
          <p className="mt-1 text-sm text-navy-foreground/70">
            {mode === "setup"
              ? "First time here — set up your admin login."
              : "Manage leads, rates and categories."}
          </p>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-elevated">
          {mode === "loading" ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={mode === "setup" ? handleSetup : handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="h-11"
                  placeholder="you@hulumart.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete={mode === "setup" ? "new-password" : "current-password"}
                  className="h-11"
                  placeholder={mode === "setup" ? "8+ characters" : "Your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
                {busy ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <>
                    <Lock className="size-4" />
                    {mode === "setup" ? "Create account" : "Sign in"}
                  </>
                )}
              </Button>
            </form>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-foreground/70 transition-colors hover:text-navy-foreground"
          >
            <ArrowLeft className="size-4" /> Back to site
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
