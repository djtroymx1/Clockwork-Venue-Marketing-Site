
"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shuffle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";


const features = [
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Live Sync Across Devices",
    description: "View and control from any device. Booth edits sync in real time to every screen. Floor staff, the house mom, and managers see the live rotation and dance counts in the club or even remotely.",
    chips: ["Real-time", "Cross-device"],
  },
  {
    icon: <Shuffle className="h-8 w-8 text-primary" />,
    title: "Smart Stage Rotation",
    description: "Handles up to 10 stages. One tap advances dancers and starts timers, and you can move names manually at anytime.",
    chips: ["Multi-stage", "Automated"],
  },
  {
    icon: <FileText className="h-8 w-8 text-primary" />,
    title: "Shift Exports and Insights",
    description: "Save the night’s data and analyze later. Spot top earners, busiest nights, and total hours per dancer. Tip-out log for DJs.",
    chips: ["Analytics", "Data Export"],
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
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="text-center p-6 rounded-[18px] border border-border bg-card relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[3px] bg-primary"></div>
              <CardHeader className="items-center">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10">
                    {feature.icon}
                </div>
                <CardTitle className="text-2xl tracking-tight">{feature.title}</CardTitle>
                <div className="flex gap-2 mt-2">
                    {feature.chips.map(chip => (
                         <Badge key={chip} variant="outline" className="border-primary text-primary/90">{chip}</Badge>
                    ))}
                </div>
                <CardDescription className="pt-2 text-base text-muted-foreground">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
