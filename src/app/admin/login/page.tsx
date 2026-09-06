import AdminLogin from '@/views/admin.login';
import { createSupabaseServerClient } from '@/integrations/supabase/server';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('/admin/login', 'Admin Login | Zapiboo', 'Sign in to Zapiboo administration.', true);
export default async function Page() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc('admin_exists');
  return <AdminLogin initialMode={error || data ? 'signin' : 'setup'} />;
}
