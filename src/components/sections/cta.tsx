"use client";

import { Button } from "@/components/ui/button";
import { WaitlistDialog } from "@/components/waitlist-dialog";
import { track } from "@/lib/analytics";

export function Cta() {
  const handleWaitlistClick = () => {
    track('cta_join_waitlist_click');
  };

  return (
    <section id="cta" className="py-16 md:py-20 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <div className="bg-card rounded-lg p-8 md:p-12 shadow-lg border border-border">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">Ready to streamline your nights?</h2>
              <p className="mt-2 text-lg text-muted-foreground">Join the waitlist to get early access.</p>
            </div>
            <div className="flex-shrink-0">
               <WaitlistDialog onOpen={handleWaitlistClick}>
                <Button size="lg" className="w-full sm:w-auto">
                  Join Waitlist
                </Button>
               </WaitlistDialog>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
