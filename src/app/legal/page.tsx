
import React from "react";
import { legalConfig } from "@/lib/legal";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: `Legal Center • ${legalConfig.brandName}` };

const legalPages = [
    {
        title: "Terms of Service",
        description: "The rules and guidelines for using our service.",
        href: "/terms"
    },
    {
        title: "Privacy Policy",
        description: "How we collect, use, and protect your data.",
        href: "/privacy"
    },
    {
        title: "DMCA Takedown Policy",
        description: "How to report copyright infringement.",
        href: "/dmca"
    },
    {
        title: "Security & Trust",
        description: "Our commitment to data protection and platform security.",
        href: "/legal/security"
    }
];

export default function Page() {
return (
<main className="sf-legal" role="main">
<h1>Legal Center</h1>
<p>
    We believe in transparency. Here you’ll find the legal documents that govern your use of Clockwork Venue.
</p>

<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
    {legalPages.map(page => (
        <div key={page.href} className="sf-legal-hub-card flex flex-col justify-between">
            <div>
                <h2 className="text-lg font-bold">{page.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{page.description}</p>
            </div>
            <div className="mt-4">
                <Button asChild variant="outline">
                    <Link href={page.href}>View Policy</Link>
                </Button>
            </div>
        </div>
    ))}
</div>
</main>
);
}
