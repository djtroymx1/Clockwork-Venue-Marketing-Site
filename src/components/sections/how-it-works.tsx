"use client";

import { cn } from "@/lib/utils";

const steps = [
  {
    name: "Set the roster",
    description: "Check entertainers in and organize your lineup.",
  },
  {
    name: "Run the rotation",
    description: "Tap Next, switch stages, and stay perfectly synced.",
  },
  {
    name: "Wrap up with insights",
    description: "Track dances and VIP rooms in real time and export data for analysis.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 md:py-28 bg-transparent">
      <div className="container mx-auto px-4 md:px-6">
        <div className={cn("text-center max-w-3xl mx-auto section-in-view")}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            <span className="underline-slide-in">Get started in minutes</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            No installs. Open in your browser and go.
          </p>
        </div>
        <div className="relative mt-16">
          <div aria-hidden="true" className="absolute left-1/2 top-4 hidden h-full w-px bg-border/25 md:block"></div>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-lg font-bold text-primary">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-xl font-semibold">{step.name}</h3>
                <p className="mt-2 text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
