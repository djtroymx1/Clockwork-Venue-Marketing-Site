import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Suspense, type ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { legalConfig } from '@/lib/legal';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';

const VERCEL_URL = process.env.VERCEL_URL ? `https://stageflow-app.com` : 'http://localhost:3000';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const siteName = legalConfig.brandName;
const defaultTitle = 'Clockwork Venue | Console for Night Operations';
const defaultDescription =
  'Run every shift like clockwork: live rotation, VIP timers, payouts, and reports in one console.';
const ogImagePath = '/assets/brand/clockwork-venue/og-cover.png';

export const metadata: Metadata = {
  metadataBase: new URL(VERCEL_URL),
  title: {
    default: defaultTitle,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  manifest: '/site.webmanifest',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: '/',
    siteName,
    images: [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: `${siteName} logo on a dark background`,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: [ogImagePath],
  },
  icons: {
    icon: [
      { url: '/assets/brand/clockwork-venue/favicon.ico', sizes: 'any' },
    ],
    apple: '/assets/brand/clockwork-venue/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteName,
    "url": "https://stageflow-app.com",
    "logo": "https://stageflow-app.com/assets/brand/clockwork-venue/logo-wordmark-800.png",
    "legalName": legalConfig.legalOwner,
  };

  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground"
        >
          Skip to content
        </a>
        <Suspense fallback={null}>
          {children}
        </Suspense>
        <Toaster />
        <CookieConsentBanner />
      </body>
    </html>
  );
}
