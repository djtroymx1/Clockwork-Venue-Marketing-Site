
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { WaitlistDialog } from "./waitlist-dialog";
import { track } from "@/lib/analytics";
import Image from "next/image";
import { legalConfig } from "@/lib/legal";
import { useAuth } from "@/hooks/use-auth";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it Works" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "/learn", label: "Resources" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();

  const handleWaitlistClick = () => {
    track('nav_join_waitlist_click');
  };
  
  const isManagerOrAdmin = user && (user.role === 'Manager' || user.role === 'Admin');

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6 min-h-[76px] md:min-h-[96px]">
        <Link href="/" className="flex items-center" aria-label={`${legalConfig.brandName} Home`}>
          <Image
            src="/assets/brand/clockwork-venue/logo-wordmark-800.png"
            alt="Clockwork Venue logo"
            width={352}
            height={108}
            className="block h-20 w-auto object-contain sm:h-24"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
           {isManagerOrAdmin && (
            <Link href="/manager" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Manager
            </Link>
          )}
          <WaitlistDialog onOpen={handleWaitlistClick}>
              <Button size="sm" className="ml-2">Join Waitlist</Button>
          </WaitlistDialog>
        </nav>
        
        <div className="flex items-center gap-2 md:hidden">
          <WaitlistDialog onOpen={handleWaitlistClick}>
            <Button size="sm">Join</Button>
          </WaitlistDialog>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader className="p-4 border-b flex flex-row items-center justify-between">
                 <SheetTitle className="sr-only">Main Menu</SheetTitle>
                 <Link href="/" className="flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
                    <Image 
                      src="/assets/brand/clockwork-venue/logo-wordmark-800.png"
                      alt="Clockwork Venue logo"
                      width={160}
                      height={49}
                      className="block h-7 w-auto object-contain"
                      style={{ paddingTop: '2px' }}
                      priority
                    />
                </Link>
                 <SheetTrigger asChild>
                   <Button variant="ghost" size="icon">
                      <X className="h-6 w-6" />
                      <span className="sr-only">Close menu</span>
                   </Button>
                 </SheetTrigger>
              </SheetHeader>
              <div className="flex h-full flex-col">
                <nav className="flex flex-col gap-4 p-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                      scroll={false}
                    >
                      {link.label}
                    </Link>
                  ))}
                  {isManagerOrAdmin && (
                    <Link href="/manager" className="text-lg font-medium" onClick={() => setIsMobileMenuOpen(false)}>
                      Manager
                    </Link>
                  )}
                </nav>
                <div className="mt-auto p-4 border-t">
                  <WaitlistDialog onOpen={handleWaitlistClick}>
                    <Button className="w-full">Join Waitlist</Button>
                  </WaitlistDialog>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
