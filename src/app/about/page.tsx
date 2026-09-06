import About from '@/views/about';
import { pageMetadata } from '@/lib/metadata';
import { JsonLd } from '@/components/JsonLd';
import { breadcrumbSchema } from '@/lib/seo';

export const metadata = pageMetadata('/about', 'About Zapiboo | Used Vehicle Selling in Bangalore', 'Learn how Zapiboo helps vehicle owners in Bangalore sell used cars, bikes and scooters through a clear, inspection-led process.');

export default function Page() {
  return <><JsonLd data={breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }])} /><About /></>;
}
