import type { Metadata } from 'next';
import { absoluteUrl } from './seo';

export function pageMetadata(path: string, title: string, description: string, noindex = false): Metadata {
  const image = absoluteUrl('/og-image.webp');
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: { type: 'website', siteName: 'Zapiboo', locale: 'en_IN', url: absoluteUrl(path), title, description, images: [{ url: image, width: 1920, height: 1080, alt: 'Used cars, bikes and scooters in Bangalore' }] },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}
