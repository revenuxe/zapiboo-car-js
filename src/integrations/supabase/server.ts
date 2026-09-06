import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { Database } from './types';
import { supabaseConfig } from './config';

export const createSupabaseServerClient = cache(async () => {
  const cookieStore = await cookies();
  const { url, key } = supabaseConfig();
  return createServerClient<Database>(url, key, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (values) => {
        // Proxy refreshes cookies before Server Components render. Route
        // Handlers and Server Actions can also persist a refreshed session.
        try { values.forEach(({ name, value, options }) => cookieStore.set(name, value, options)); } catch { /* Read-only Server Component context. */ }
      },
    },
  });
});

export const getCurrentUser = cache(async () => {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect('/auth?redirectTo=%2Faccount');
  return user;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect('/admin/login');
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('user_roles').select('role').eq('user_id', user.id).eq('role', 'admin').maybeSingle();
  if (error || !data) redirect('/admin/login');
  return { user, supabase };
}
