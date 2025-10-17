
"use client";

import { Badge } from "@/components/ui/badge";

export function LiveColors() {
  const states = [
    { name: "Dance",    colorClass: "bg-yellow-400", note: "Dance button changes dancer name to yellow with a fall back 10 minute timer" },
    { name: "VIP",      colorClass: "bg-red-500",    note: "VIP host can start 15, 30 or 60 minute rooms which start corresponding countdown timer visible on all the devices." },
    { name: "On Tour",  colorClass: "bg-pink-500",   note: "When negotiating a room dancers can be temporarily put on tour and on tour status is cleared with the available button" },
    { name: "Available",colorClass: "bg-zinc-400",   note: "When the dancer is available and back on the floor pressing this button will cancel the default timers and mark the dancer clear across all screens" },
  ];

  return (
    <section id="live-colors" aria-labelledby="live-colors-title" className="py-16 sm:py-24 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Badge variant="outline" className="border-primary text-primary/90">Live Status Colors</Badge>
          <h2 id="live-colors-title" className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight">
            How Live Colors Work
          </h2>
          <p className="mt-4 text-muted-foreground">
            Highlight a dancer, click dance or vip button on the floor device and the dancer row color updates instantly on every screen. The VIP host can set champagne room time and a shared timer begins counting down.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {states.map((s) => (
            <div key={s.name} className="rounded-xl border border-border bg-card p-4 hover:-translate-y-[2px] transition-transform">
              <div className="flex items-center gap-3">
                <span className={`inline-block h-3 w-3 rounded-full ${s.colorClass}`} aria-hidden="true" />
                <h3 className="text-lg font-semibold">{s.name}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{s.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 mx-auto max-w-3xl rounded-xl border border-border bg-card p-4">
          <h3 className="text-lg font-semibold">VIP Host Mode</h3>
          <ul className="mt-2 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>One device at a time controls VIP. Others see that VIP Host Mode is active.</li>
            <li>Quick buttons start VIP timers: 15, 30, or 60 minutes with a visible countdown.</li>
            <li>The VIP row turns red on all devices and clears automatically when the timer ends.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
