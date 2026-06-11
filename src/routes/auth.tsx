import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Loader2, ArrowLeft, Recycle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Sign in or create an account | HuluMart" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AuthPage,
});

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(6, "Password must be at least 6 characters").max(72);
const nameSchema = z.string().trim().min(2, "Enter your name").max(80);

function AuthPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);

  // shared
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/account" });
    });
  }, [navigate]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const em = emailSchema.safeParse(email);
    if (!em.success) return toast.error(em.error.issues[0].message);
    if (!password) return toast.error("Enter your password.");
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: em.data, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    navigate({ to: "/account" });
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const em = emailSchema.safeParse(email);
    if (!em.success) return toast.error(em.error.issues[0].message);
    const nm = nameSchema.safeParse(name);
    if (!nm.success) return toast.error(nm.error.issues[0].message);
    const pw = passwordSchema.safeParse(password);
    if (!pw.success) return toast.error(pw.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: em.data,
      password: pw.data,
      options: {
        emailRedirectTo: window.location.origin + "/account",
        data: { full_name: nm.data, phone: phone.trim() },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! You're all set.");
    navigate({ to: "/account" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-navy px-4 py-12 text-navy-foreground">
      <div className="absolute left-6 top-6">
        <Button asChild variant="outlineLight" size="sm">
          <Link to="/">
            <ArrowLeft /> Back to site
          </Link>
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-background p-6 text-foreground shadow-elevated sm:p-8"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground shadow-green">
            <Recycle className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Your HuluMart account</h1>
            <p className="text-sm text-muted-foreground">Track pickups & get paid faster.</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin">Sign in</TabsTrigger>
            <TabsTrigger value="signup">Create account</TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-5">
            <form onSubmit={signIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="si-email">Email</Label>
                <Input id="si-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="si-pw">Password</Label>
                <Input id="si-pw" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-5">
            <form onSubmit={signUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="su-name">Full name</Label>
                <Input id="su-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-phone">Phone (WhatsApp)</Label>
                <Input id="su-phone" type="tel" inputMode="numeric" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile" maxLength={10} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-email">Email</Label>
                <Input id="su-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="su-pw">Password</Label>
                <Input id="su-pw" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to HuluMart's fair-pricing terms.
        </p>
      </motion.div>
    </div>
  );
}
