import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-background py-20 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-text leading-tight mb-6">
          A Gestão da Sua Obra, <br className="hidden md:block" />
          <span className="text-primary">Simplificada e Centralizada</span>.
        </h1>
        <p className="max-w-3xl mx-auto text-lg md:text-xl text-text/80 mb-10">
          ConstructionCon é o software completo para construtoras que buscam eficiência, controle e transparência, do canteiro ao financeiro.
        </p>
        <div className="flex justify-center items-center gap-4 flex-wrap">
          <Link
            href="#"
            className="bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-primary/40 transform hover:-translate-y-1"
          >
            Ver Demonstração
          </Link>
          <Link
            href="#features"
            className="bg-transparent text-text border-2 border-secondary px-8 py-3 rounded-lg font-bold text-lg hover:bg-secondary/20 hover:border-primary transition-all duration-300"
          >
            Conhecer Mais <ArrowRight className="inline ml-2 h-5 w-5" />
          </Link>
        </div>
        <div className="mt-16">
          {/* Placeholder para a imagem do dashboard */}
          <div className="max-w-5xl mx-auto bg-secondary/30 rounded-xl p-4 shadow-2xl border border-secondary/20">
            <Image
              width={1200}
              height={680}
              src="https://placehold.co/1200x680/89a2e7/0b0c0f?text=Dashboard+ConstructionCon"
              alt="Dashboard do ConstructionCon"
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}