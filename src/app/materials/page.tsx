import PriceGuide from '@/views/materials';
import { pageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';
export const metadata = pageMetadata('/materials', 'Used Vehicle Price Guide in Bangalore | Zapiboo', 'Indicative starting prices for used cars, bikes and scooters in Bangalore.');
export default function Page() {
  return <><JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Used vehicle price guide', path: '/materials' }])} /><PriceGuide /></>;
}
