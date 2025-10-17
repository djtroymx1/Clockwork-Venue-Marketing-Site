
import Link from "next/link";
import Image from "next/image";
import { legalConfig } from "@/lib/legal";

const productLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#live-colors", label: "Live Colors" },
  { href: "/#features", label: "Live Sync Demo" },
];

const companyLinks = [
  { href: "/company", label: "Company" },
  { href: "/#contact", label: "Contact" },
  { href: "/learn", label: "Resources" },
];

const legalLinks = [
  { href: "/legal", label: "Legal" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/dmca", label: "DMCA" },
];

const LinkItem = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link
      href={href}
      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {label}
    </Link>
  </li>
);

export function Footer() {
  return (
    <footer className="bg-card relative border-t border-border/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12 md:py-16">
          <div className="flex flex-col items-center md:items-start text-center md:text-left md:col-span-1">
            <Link href="/" aria-label={`${legalConfig.brandName} Home`}>
              <Image
                src="/assets/brand/clockwork-venue/logo-wordmark-800.png"
                alt="Clockwork Venue logo"
                width={352}
                height={108}
                className="block object-contain h-14 w-auto sm:h-[72px] md:h-24"
                priority
              />
            </Link>
             <p className="mt-2 sm:mt-4 text-sm font-medium text-muted-foreground leading-relaxed max-w-[32ch] tracking-tight">
              Real-time rotation software for clubs.
            </p>
          </div>
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8 text-center md:text-left">
            <div>
              <h3 className="font-headline font-medium tracking-tight text-foreground">Product</h3>
              <ul className="mt-4 space-y-3">
                {productLinks.map((link) => (
                  <LinkItem key={link.label} {...link} />
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-medium tracking-tight text-foreground">Company</h3>
              <ul className="mt-4 space-y-3">
                {companyLinks.map((link) => (
                  <LinkItem key={link.label} {...link} />
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-headline font-medium tracking-tight text-foreground">Legal</h3>
              <ul className="mt-4 space-y-3">
                {legalLinks.map((link) => (
                  <LinkItem key={link.label} {...link} />
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="py-6 border-t border-border/50 text-sm text-muted-foreground">
           <p>{legalConfig.legalLine()}</p>
        </div>
      </div>
    </footer>
  );
}
