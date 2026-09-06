"use client";
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';
import { supabaseConfig } from './config';
function createSupabaseClient() {
  const { url, key } = supabaseConfig();
  return createBrowserClient<Database>(url, key);
}
let client: ReturnType<typeof createSupabaseClient> | undefined;
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, property) {
    client ??= createSupabaseClient();
    return Reflect.get(client, property, client);
  },
});
