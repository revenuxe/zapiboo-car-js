import OrdersPage from "@/views/orders";
import { requireUser } from "@/integrations/supabase/server";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/orders", "My Pickup Orders | Zapiboo", "Track and manage your Zapiboo vehicle pickup orders.", true);

export default async function Page() {
  await requireUser();
  return <OrdersPage />;
}
