"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

const AuthContext = createContext<{ user: User | null; loading: boolean }>({ user: null, loading: false });

export function AuthProvider({ initialUser, children }: { initialUser: User | null; children: ReactNode }) {
  const [user, setUser] = useState(initialUser);
  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);
  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  return <AuthContext.Provider value={{ user, loading: false }}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => useContext(AuthContext);
