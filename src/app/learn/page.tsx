import React from "react";
import { legalConfig } from "@/lib/legal";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Run every shift like clockwork: live rotation, VIP timers, payouts, and reports in one console.",
  openGraph: {
    title: `Resources | ${legalConfig.brandName}`,
    description:
      "Run every shift like clockwork: live rotation, VIP timers, payouts, and reports in one console.",
  },
};

const resourcePages = [
  {
    title: "Tutorials",
    description: "Step-by-step guides and videos to master Clockwork Venue features.",
    href: "/learn/tutorials",
  },
  {
    title: "Manual",
    description: "A comprehensive reference for every feature and setting.",
    href: "/learn/manual",
  },
];

export default function Page() {
  return (
    <main className="sf-legal" role="main">
      <h1>Resources</h1>
      <p>
        Welcome to the Clockwork Venue resource hub. Here you&apos;ll find
        everything you need to get started and master the platform.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {resourcePages.map((page) => (
          <Link
            href={page.href}
            key={page.href}
            className="block group"
            aria-label={`View ${page.title}`}
          >
            <div className="sf-legal-hub-card flex flex-col justify-between h-full p-6 rounded-2xl border border-border group-hover:border-primary transition-all duration-200 group-hover:-translate-y-[2px]">
              <div>
                <h2 className="text-lg font-bold">{page.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {page.description}
                </p>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-primary font-medium group-hover:translate-x-1 transition-transform duration-200">
                  <span>View {page.title}</span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
