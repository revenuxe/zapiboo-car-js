import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { Providers } from './providers';
import { getCurrentUser } from '@/integrations/supabase/server';
import { siteUrl, organizationSchema, websiteSchema } from '@/lib/seo';
import { JsonLd } from '@/components/JsonLd';
import { pageMetadata } from '@/lib/metadata';
import '@/styles.css';

// Every page is rendered per request, including pages with interactive islands.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const metadata: Metadata = {
  ...pageMetadata('/', 'Zapiboo | Buy & Sell Used Cars, Bikes & Scooters in Bangalore', 'Buy or sell used cars, bikes and scooters in Bangalore with free doorstep inspections, instant payment and RC transfer support.'),
  metadataBase: new URL(siteUrl),
  authors: [{ name: 'Zapiboo' }],
  icons: { icon: '/favicon.ico', apple: '/favicon.png' },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : undefined,
};
export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const user = await getCurrentUser();
  return <html lang="en"><head>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Manrope:wght@400;500;600;700&display=swap" />
  </head><body>
    <noscript><style>{'[data-ssr-reveal], main [style*="opacity:0"], main [style*="opacity: 0"] { opacity: 1 !important; transform: none !important; }'}</style></noscript>
    <JsonLd data={[organizationSchema('/'), websiteSchema()]} />
    <Providers initialUser={user}>{children}</Providers>
  </body></html>;
}
