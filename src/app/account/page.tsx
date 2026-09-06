import AccountPage from '@/views/account';
import { requireUser } from '@/integrations/supabase/server';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('/account', 'My account | Zapiboo', 'Manage your Zapiboo account.', true);
export default async function Page() {
  const user = await requireUser();
  return <AccountPage initialUser={user} />;
}
