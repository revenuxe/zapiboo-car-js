import Home from '@/views/index';
import { pageMetadata } from '@/lib/metadata';
import { breadcrumbSchema, localBusinessSchema, serviceSchema } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';

export const metadata = pageMetadata('/', 'Sell & Buy Used Cars, Bikes & Scooters in Bangalore | Zapiboo', 'Sell your used car, bike or scooter in Bangalore at the best price. Free doorstep inspection, instant payment, free RC transfer — and verified second-hand vehicles to buy.');
export default function Page() {
  return <><JsonLd data={[localBusinessSchema('/'), serviceSchema('/'), breadcrumbSchema([{ name: 'Home', path: '/' }])]} /><Home /></>;
}
