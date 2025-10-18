
"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shuffle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Users,
    title: "Live Sync Across Devices",
    description: "View and control from any device. Booth edits sync in real time to every screen. Floor staff, the house mom, and managers see the live rotation and dance counts in the club or even remotely.",
    chips: ["Real-time", "Cross-device"],
  },
  {
    icon: Shuffle,
    title: "Smart Stage Rotation",
    description: "Handles up to 10 stages. One tap advances dancers and starts timers, and you can move names manually at anytime.",
    chips: ["Multi-stage", "Automated"],
  },
  {
    icon: FileText,
    title: "Shift Exports and Insights",
    description: "Save the night's data and analyze later. Spot top earners, busiest nights, and total hours per dancer. Tip-out log for DJs.",
    chips: ["Analytics", "Data Export"],
  },
];

const accentStyles = [
  {
    indicator: "bg-[#3F8CFF]",
    iconBg: "bg-[#3F8CFF]/10",
    iconColor: "text-[#3F8CFF]",
    badge: "border-[#3F8CFF] text-[#3F8CFF]",
  },
  {
    indicator: "bg-[#1FB8C6]",
    iconBg: "bg-[#1FB8C6]/10",
    iconColor: "text-[#1FB8C6]",
    badge: "border-[#1FB8C6] text-[#1FB8C6]",
  },
  {
    indicator: "bg-[#18B06B]",
    iconBg: "bg-[#18B06B]/10",
    iconColor: "text-[#18B06B]",
    badge: "border-[#18B06B] text-[#18B06B]",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <div className={cn("text-center max-w-3xl mx-auto section-in-view")}>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              <span className="underline-slide-in">Everything you need, nothing you don&apos;t.</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
                Clockwork Venue is purpose-built to solve the unique challenges of stage management in adult clubs.
            </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => {
            const accent = accentStyles[index % accentStyles.length];
            const Icon = feature.icon;
            return (
              // rotate accent styling for visual rhythm across feature cards
              <Card 
                key={index} 
                className={cn(
                  "text-center p-6 rounded-[18px] border border-white/10 bg-[#0F1923] relative overflow-hidden transition-all duration-300",
                  "hover:bg-[#1A2332] hover:border-[#3F8CFF]/50 hover:shadow-[0_0_30px_rgba(63,140,255,0.15)]"
                )}
              >
                <div className={cn("absolute top-0 left-0 w-full h-[3px]", accent.indicator)}></div>
                <CardHeader className="items-center">
                  <div className={cn("mb-4 flex h-16 w-16 items-center justify-center rounded-lg", accent.iconBg)}>
                    <Icon className={cn("h-8 w-8", accent.iconColor)} />
                  </div>
                  <CardTitle className="text-2xl tracking-tight">{feature.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    {feature.chips.map((chip) => (
                      <Badge
                        key={chip}
                        variant="outline"
                        className={cn("border bg-transparent", accent.badge)}
                      >
                        {chip}
                      </Badge>
                    ))}
                  </div>
                  <CardDescription className="pt-2 text-base text-muted-foreground">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
