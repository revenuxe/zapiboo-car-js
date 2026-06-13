import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ArrowLeft, Chrome, Loader2, Recycle, ShieldCheck, Truck, Wallet } from "lucide-react";
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

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const redirectPath =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirectTo") || "/account"
      : "/account";
  const redirectTo =
    typeof window !== "undefined" ? `${window.location.origin}${redirectPath}` : undefined;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: redirectPath });
    });
  }, [navigate, redirectPath]);

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
    navigate({ to: redirectPath });
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
        emailRedirectTo: redirectTo,
        data: { full_name: nm.data, phone: phone.trim() },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! You're all set.");
    navigate({ to: redirectPath });
  };

  const signInWithGoogle = async () => {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (error) {
      setBusy(false);
      toast.error(error.message);
    }
  };

  const googleLabel = tab === "signin" ? "Sign in with Google" : "Sign up with Google";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-navy px-4 py-5 text-navy-foreground sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-6xl flex-col">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green">
              <Recycle className="size-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-extrabold leading-tight">HuluMart</p>
              <p className="truncate text-xs text-navy-foreground/65">Bengaluru scrap pickup</p>
            </div>
          </Link>
          <Button asChild variant="outlineLight" size="sm" className="shrink-0">
            <Link to="/">
              <ArrowLeft /> Back
            </Link>
          </Button>
        </div>

        <div className="grid flex-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="hidden lg:block"
          >
            <p className="text-sm font-bold uppercase tracking-[0.28em] text-primary">
              Customer account
            </p>
            <h1 className="mt-4 max-w-xl text-5xl font-extrabold leading-tight">
              Faster pickups, saved addresses, cleaner payments.
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-8 text-navy-foreground/72">
              Sign in once and keep your doorstep scrap pickups organized with HuluMart.
            </p>
            <div className="mt-8 grid gap-4">
              {[
                { icon: Truck, title: "Book quicker", text: "Reuse saved pickup details." },
                {
                  icon: ShieldCheck,
                  title: "Secure access",
                  text: "Your account is protected by Supabase auth.",
                },
                {
                  icon: Wallet,
                  title: "Easy tracking",
                  text: "Track requests and pickup history.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/7 p-4 backdrop-blur"
                >
                  <div className="flex size-11 items-center justify-center rounded-xl bg-white/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold">{item.title}</h2>
                    <p className="text-sm text-navy-foreground/65">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full justify-self-center rounded-[2rem] border border-white/15 bg-background p-5 text-foreground shadow-elevated sm:max-w-lg sm:p-7 lg:max-w-xl"
          >
            <div className="mb-6 rounded-3xl bg-gradient-to-br from-accent to-background p-5">
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-brand text-primary-foreground shadow-green">
                  <Recycle className="size-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-extrabold leading-tight">Your HuluMart account</h1>
                  <p className="text-sm text-muted-foreground">
                    Track pickups and get paid faster.
                  </p>
                </div>
              </div>
            </div>

            <Tabs value={tab} onValueChange={(v) => setTab(v as "signin" | "signup")}>
              <TabsList className="grid h-12 w-full grid-cols-2 rounded-2xl bg-muted p-1.5">
                <TabsTrigger value="signin" className="rounded-xl">
                  Sign in
                </TabsTrigger>
                <TabsTrigger value="signup" className="rounded-xl">
                  Create account
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="mt-5">
                <Button
                  type="button"
                  variant="google"
                  size="lg"
                  className="mb-4 h-12 w-full rounded-2xl"
                  disabled={busy}
                  onClick={signInWithGoogle}
                >
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Chrome className="size-4" />
                  )}
                  {googleLabel}
                </Button>
                <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
                <form onSubmit={signIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="si-email">Email</Label>
                    <Input
                      id="si-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-12 rounded-2xl bg-background px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si-pw">Password</Label>
                    <Input
                      id="si-pw"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="h-12 rounded-2xl bg-background px-4"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="h-12 w-full rounded-2xl"
                    disabled={busy}
                  >
                    {busy ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-5">
                <Button
                  type="button"
                  variant="google"
                  size="lg"
                  className="mb-4 h-12 w-full rounded-2xl"
                  disabled={busy}
                  onClick={signInWithGoogle}
                >
                  {busy ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Chrome className="size-4" />
                  )}
                  {googleLabel}
                </Button>
                <div className="mb-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="h-px flex-1 bg-border" />
                  or
                  <span className="h-px flex-1 bg-border" />
                </div>
                <form onSubmit={signUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-name">Full name</Label>
                    <Input
                      id="su-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="h-12 rounded-2xl bg-background px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-phone">Phone (WhatsApp)</Label>
                    <Input
                      id="su-phone"
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                      placeholder="10-digit mobile"
                      maxLength={10}
                      className="h-12 rounded-2xl bg-background px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Email</Label>
                    <Input
                      id="su-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="h-12 rounded-2xl bg-background px-4"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-pw">Password</Label>
                    <Input
                      id="su-pw"
                      type="password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 6 characters"
                      className="h-12 rounded-2xl bg-background px-4"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="hero"
                    size="lg"
                    className="h-12 w-full rounded-2xl"
                    disabled={busy}
                  >
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
      </div>
    </div>
  );
}
