
"use client";

import { cn } from "@/lib/utils";

const testimonials = [
  {
    quote: "I ran rotations with pen and paper for years. Clockwork Venue is a game changer.",
    name: "Steve",
    role: "DJ • Cheetah",
    initials: "S",
  },
  {
    quote: "Being able to connect floor staff so they can see my rotation in real time is amazing.",
    name: "Jamie",
    role: "DJ • Ultra",
    initials: "J",
  },
  {
    quote: "Exports feature make the night easy to analyze, all in one place.",
    name: "Anthony",
    role: "Manager • Scores",
    initials: "A",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" aria-label="Testimonials" className="bg-transparent">
       <div className="sf-container">
        <div className={cn("text-center max-w-3xl mx-auto section-in-view")}>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl sf-h2">
            What DJs and managers say
          </h2>
        </div>
        <ul className="sf-testimonial-list" role="list">
          {testimonials.map((testimonial) => (
            <li key={testimonial.name} className="sf-testimonial-card">
              <div className="sf-card-accent"></div>
              <blockquote className="sf-quote">
                “{testimonial.quote}”
              </blockquote>
              <div className="sf-person">
                <div className="sf-avatar" aria-hidden="true">{testimonial.initials}</div>
                <div className="sf-meta">
                  <span className="sf-name">{testimonial.name}</span>
                  <span className="sf-role">{testimonial.role}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
