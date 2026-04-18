import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CinematicHero } from "@/components/sections/cinematic-hero";
import { Guide } from "@/components/sections/guide";
import { Features } from "@/components/sections/features";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Stats } from "@/components/sections/stats";
import { Pricing } from "@/components/sections/pricing";
import { MidCTA } from "@/components/sections/mid-cta";
import { FAQ } from "@/components/sections/faq";
import { FinalCTA } from "@/components/sections/final-cta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: {
      type: "website" as const,
      title: t("title"),
      description: t("description"),
      siteName: "ArkyHub",
      locale: locale === "es" ? "es_ES" : "en_US",
    },
    twitter: {
      card: "summary_large_image" as const,
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Header />
      <main className="flex-1">
        <CinematicHero />
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
