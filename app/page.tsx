import Header from "@/app/ui/components/Header";
import Footer from "@/app/ui/components/Footer";
import HeroSection from "@/app/ui/landing/HeroSection";
import FeaturesSection from "@/app/ui/landing/FeaturesSection";
import BenefitsSection from "@/app/ui/landing/BenefitsSection";
import TestimonialSection from "@/app/ui/landing/TestimonialSection";
import CtaSection from "@/app/ui/landing/CtaSection";

export const metadata = {
  title: "ConstructionCon - Gestão de Obras Simplificada",
  description: "Software completo para construtoras que buscam eficiência, controle e transparência, do canteiro ao financeiro.",
};

export default function Page() {
  return (
    <div>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <BenefitsSection />
        <TestimonialSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
