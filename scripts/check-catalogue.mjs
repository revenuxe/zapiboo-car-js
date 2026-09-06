import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!url || !key) throw new Error('Supply public Supabase environment variables.');
const client = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
const { data, error, status } = await client.from('vehicle_categories').select('id,name').eq('active', true).abortSignal(AbortSignal.timeout(10000));
console.log(JSON.stringify({ status, activeCategories: data?.length, error: error?.message }));
