
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WaitlistDialog } from "@/components/waitlist-dialog";
import { track } from "@/lib/analytics";
import { useAuth } from "@/hooks/use-auth";

export function Hero() {
  const { user } = useAuth();
  const handleWaitlistClick = () => {
    track('hero_join_waitlist_click');
  };

  const handleLaunchAppClick = () => {
    track('launch_app_click');
  };
  
  const getLoginUrl = () => {
    const baseUrl = "https://stageflow-74ec8.web.app/";
    if (user?.email) {
      return `${baseUrl}?email=${encodeURIComponent(user.email)}`;
    }
    return baseUrl;
  }

  return (
    <section id="hero" className="hero-animated py-20 md:py-32">
      <div className="hero-content container mx-auto px-4 md:px-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
          Run flawless stage rotations, every night.
        </h1>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-muted-foreground md:text-xl">
          Built for adult clubs. DJs, floor staff, and managers stay perfectly in sync.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <WaitlistDialog onOpen={handleWaitlistClick}>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-[#3F8CFF] hover:bg-[#3F8CFF]/90 text-white shadow-[0_0_30px_rgba(63,140,255,0.3)]"
            >
              Join Waitlist
            </Button>
          </WaitlistDialog>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="w-full sm:w-auto border-[#1FB8C6] text-[#1FB8C6] hover:bg-[#1FB8C6]/10"
          >
            <Link href={getLoginUrl()} target="_blank" rel="noopener noreferrer" onClick={handleLaunchAppClick}>
              Launch Web App
            </Link>
          </Button>
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Pricing, coming soon.
        </p>
      </div>
    </section>
  );
}

    
