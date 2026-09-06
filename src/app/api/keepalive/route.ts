import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/integrations/supabase/config';
import type { Database } from '@/integrations/supabase/types';

export const dynamic = 'force-dynamic';
export async function GET() {
  const { url, key } = supabaseConfig();
  const supabase = createClient<Database>(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  const { error, count } = await supabase.from('leads').select('id', { count: 'exact', head: true });
  if (error) return Response.json({ ok: false, error: 'Database health check failed.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  return Response.json({ ok: true, checkedAt: new Date().toISOString(), leadsCount: count ?? 0 }, { headers: { 'Cache-Control': 'no-store' } });
}
