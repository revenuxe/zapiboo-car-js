import { useState } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { Menu, ArrowRight, User as UserIcon, LogOut, Car, LayoutDashboard } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Logo } from "@/components/Logo";
import { headerNavLinks as navLinks } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, displayName, initials } from "@/hooks/use-auth";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { user } = useAuth();

  const signOut = async () => {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo imageClassName="h-12 md:h-14" />

        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const active = pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3 text-sm font-medium transition-colors hover:bg-secondary"
                  aria-label="Account menu"
                >
                  <span className="flex size-8 items-center justify-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">
                    {initials(user)}
                  </span>
                  <span className="max-w-28 truncate">{displayName(user)}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account">
                    <UserIcon className="size-4" /> My account
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account">
                    <Car className="size-4" /> My vehicle bookings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-destructive focus:text-destructive">
                  <LogOut className="size-4" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
          <Button asChild variant="ghost" size="sm">
            <Link to="/pickup">
              Sell a vehicle
            </Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/pickup">
              Book pickup
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="mt-2 mb-8">
              <Logo imageClassName="h-12" />
            </div>

            {user && (
              <div className="mb-5 flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-brand text-sm font-bold text-primary-foreground">
                  {initials(user)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{displayName(user)}</p>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            )}

            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/account"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                >
                  <LayoutDashboard className="size-4" /> My account
                </Link>
              )}
            </nav>

            <div className="mt-6 flex flex-col gap-3">
              <Button asChild variant="hero" size="lg" onClick={() => setOpen(false)}>
                <Link to="/pickup">
                  Book pickup
                  <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" onClick={() => setOpen(false)}>
                <Link to="/pickup">
                  Sell a vehicle
                </Link>
              </Button>
              {user ? (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setOpen(false);
                    signOut();
                  }}
                >
                  <LogOut className="size-4" /> Sign out
                </Button>
              ) : (
                <Button asChild variant="outline" size="lg" onClick={() => setOpen(false)}>
                  <Link to="/auth">Sign in</Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
