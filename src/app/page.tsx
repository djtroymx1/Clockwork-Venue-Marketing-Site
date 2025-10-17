
import { Header } from "@/components/header";
import { Hero } from "@/components/sections/hero";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { LiveColors } from "@/components/sections/live-colors";
import { Cta } from "@/components/sections/cta";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";
import { Footer } from "@/components/footer";
import { Suspense } from "react";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Suspense>
        <Header />
      </Suspense>
      <main id="main-content" className="flex-grow">
        <Hero />
        <Features />
        <HowItWorks />
        <LiveColors />
        <Cta />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
