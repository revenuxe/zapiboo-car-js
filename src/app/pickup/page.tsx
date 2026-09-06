import { unstable_serialize } from 'swr';
import { ServerData } from '@/components/ServerData';
import Pickup from '@/views/pickup';
import { createSupabaseServerClient } from '@/integrations/supabase/server';
import { pageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, serviceSchema } from '@/lib/seo';
export const metadata = pageMetadata('/pickup', 'Book a Free Vehicle Inspection in Bengaluru | Zapiboo', 'Book a free doorstep vehicle inspection across Bengaluru in a few taps. Get a fair market-linked offer and same-day payment.');
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const search = await searchParams;
  const pickupSearch = {
    vehicle: typeof search.vehicle === 'string' && ['car', 'bike', 'scooter', 'commercial'].includes(search.vehicle) ? search.vehicle : undefined,
    pincode: typeof search.pincode === 'string' && /^\d{6}$/.test(search.pincode) ? search.pincode : undefined,
    bookingAuth: search.bookingAuth === '1' ? '1' as const : undefined,
  };
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from('vehicle_categories').select('id, name, image_url').eq('active', true).order('sort_order').order('name');
  const fallback = error ? {} : { [unstable_serialize(['vehicle-catalogue', 'vehicle_categories', undefined])]: data };
  return <><JsonLd data={[serviceSchema('/pickup'), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Book free valuation', path: '/pickup' }])]} /><ServerData fallback={fallback}><Pickup pickupSearch={pickupSearch} /></ServerData></>;
}
