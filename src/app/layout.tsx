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
const defaultTitle = 'Clockwork Venue \u2014 Console for Night Operations';
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function(){
            function ready(fn){
              if (document.readyState !== 'loading') fn();
              else document.addEventListener('DOMContentLoaded', fn);
            }
            ready(function(){
              if (window.matchMedia('(min-width: 701px)').matches) return;
              if (document.querySelector('.sf-sticky-cta')) return;
              
              var wrap = document.createElement('div');
              wrap.className = 'sf-sticky-cta';
              wrap.setAttribute('role','region');
              wrap.setAttribute('aria-label','Mobile call to action');
              
              var btn = document.createElement('button');
              btn.id = 'sfStickyJoin';
              btn.className = 'sf-btn-primary';
              btn.type = 'button';
              btn.textContent = 'Join Waitlist';
              
              wrap.appendChild(btn);
              document.body.appendChild(wrap);
              
              window.openWaitlistModal = () => {
                const waitlistTrigger = document.querySelector('[data-dialog="waitlist"]');
                if (waitlistTrigger instanceof HTMLElement) {
                  waitlistTrigger.click();
                }
              };
              
              btn.addEventListener('click', function(e){
                e.preventDefault();
                try {
                  if (typeof window.openWaitlistModal === 'function') {
                    window.openWaitlistModal();
                    return;
                  }
                  var target = document.querySelector('[data-sf-join]') || document.querySelector('#waitlist') || document.querySelector('a[href*="waitlist"]');
                  if (target && target.tagName === 'A' && target.href) {
                    window.location.href = target.href;
                  } else if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  } else {
                    var contact = document.querySelector('#contact');
                    if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                } catch (_) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              });
              
              var footer = document.querySelector('footer');
              var contact = document.querySelector('#contact');
              if ('IntersectionObserver' in window && (footer || contact)) {
                var observer = new IntersectionObserver(function(entries){
                  var isIntersecting = entries.some(function(entry) {
                    return entry.isIntersecting;
                  });
                  if (isIntersecting) {
                    wrap.style.opacity = '0';
                    wrap.style.pointerEvents = 'none';
                  } else {
                    wrap.style.opacity = '';
                    wrap.style.pointerEvents = '';
                  }
                }, { threshold: 0 });
                if(footer) observer.observe(footer);
                if(contact) observer.observe(contact);
              }
            });
          })();
        `,
          }}
        />
      </body>
    </html>
  );
}
