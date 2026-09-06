"use client";
import type { User } from "@supabase/supabase-js";
import { useAuthContext } from "@/components/AuthProvider";
export const useAuth = useAuthContext;

export function displayName(user: User | null): string {
  if (!user) return "";
  const meta = user.user_metadata as { full_name?: string; name?: string } | undefined;
  return meta?.full_name || meta?.name || user.email?.split("@")[0] || "Account";
}

export function initials(user: User | null): string {
  const name = displayName(user);
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
