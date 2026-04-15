import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero, ProjectCard } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Guide } from "@/components/sections/guide";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Stats } from "@/components/sections/stats";
import { Pricing } from "@/components/sections/pricing";
import { MidCTA } from "@/components/sections/mid-cta";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Problem />
        <ProjectCard />
        <Guide />
        <Features />
        <HowItWorks />
        <Stats />
        <Pricing />
        <MidCTA />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
