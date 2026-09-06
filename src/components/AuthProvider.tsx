"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const postAuthRedirectKey = 'zapiboo-post-auth-redirect';

function resumePostAuthRedirect() {
  if (typeof window === 'undefined') return;
  const target = window.sessionStorage.getItem(postAuthRedirectKey);
  if (!target || !target.startsWith('/pickup?bookingAuth=1')) return;
  if (`${window.location.pathname}${window.location.search}` === target) {
    window.sessionStorage.removeItem(postAuthRedirectKey);
    return;
  }
  window.sessionStorage.removeItem(postAuthRedirectKey);
  window.location.replace(target);
}

const AuthContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: false });

export function AuthProvider({ initialUser, children }: { initialUser: User | null; children: ReactNode }) {
  const [user, setUser] = useState(initialUser);
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session) resumePostAuthRedirect();
    });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session) resumePostAuthRedirect();
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return <AuthContext.Provider value={{ user, loading: false }}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
