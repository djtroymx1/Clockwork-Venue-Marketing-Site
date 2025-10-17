
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { legalConfig } from '@/lib/legal';
import { track } from '@/lib/analytics';

const CONSENT_STORAGE_KEY = 'cookie_consent_given';

export function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!consent) {
        setIsVisible(true);
      }
    } catch (error) {
      // In SSR or if localStorage is unavailable, we default to not showing the banner.
      // This prevents layout shifts or errors during server rendering.
      setIsVisible(false);
    }
  }, []);

  const handleAccept = () => {
    try {
      track('cookie_consent_accept');
      localStorage.setItem(CONSENT_STORAGE_KEY, new Date().toISOString());
      setIsVisible(false);
    } catch (error) {
      console.error("Could not save cookie consent to localStorage", error);
      // Still hide banner even if localStorage fails to provide a good user experience.
      setIsVisible(false);
    }
  };

  const handleLearnMore = () => {
    track('cookie_consent_learn_more');
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className={cn(
        "fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl p-4 rounded-lg shadow-2xl",
        "bg-card border border-primary/20",
        "flex flex-col sm:flex-row items-center justify-between gap-4"
      )}
    >
      <p className="text-sm text-muted-foreground flex-grow text-center sm:text-left">
        {legalConfig.brandWithMark()} uses cookies and analytics to improve your experience. See our{' '}
        <Link href="/privacy" className="underline hover:text-foreground transition-colors" aria-label="Read our Privacy Policy">
          Privacy Policy
        </Link>{' '}
        for details.
      </p>
      <div className="flex-shrink-0 flex items-center gap-3">
        <Button
          onClick={handleAccept}
          size="sm"
          aria-label="Accept cookies and close this banner"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Accept
        </Button>
        <Button
          variant="outline"
          size="sm"
          asChild
          onClick={handleLearnMore}
          className="border-secondary text-secondary hover:bg-secondary/20"
        >
          <Link href="/privacy" aria-label="Learn more about our privacy policy">Learn More</Link>
        </Button>
      </div>
    </div>
  );
}

// Developer utility to reset consent for testing purposes.
// Can be called from the browser console: window.resetCookieConsent()
if (typeof window !== 'undefined') {
  (window as any).resetCookieConsent = () => {
    try {
      localStorage.removeItem(CONSENT_STORAGE_KEY);
      console.log('Cookie consent reset. Please refresh the page.');
      window.location.reload();
    } catch (error) {
      console.error('Could not reset cookie consent.', error);
    }
  };
}
