import SellUsedCar from '@/views/sell-used-car';
import { pageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema, serviceSchema } from '@/lib/seo';
export const metadata = pageMetadata('/sell-used-car', 'Sell Your Used Car in Bangalore | Free Valuation | Zapiboo', 'Sell your used car in Bangalore with a free doorstep inspection and a market-linked offer. Share your registration number, book a visit and review your options.');
export default function Page() {
  return <><JsonLd data={[serviceSchema('/sell-used-car'), breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Sell used car', path: '/sell-used-car' }])]} /><SellUsedCar /></>;
}
