import Pickup from '@/views/pickup';
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
  return <><JsonLd data={[serviceSchema('/pickup'), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Book free valuation', path: '/pickup' }])]} /><Pickup pickupSearch={pickupSearch} /></>;
}
