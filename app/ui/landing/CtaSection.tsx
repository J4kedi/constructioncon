import Link from "next/link";

export default function CtaSection() {
  return (
    <section id="pricing" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-primary to-accent text-white rounded-2xl p-10 md:p-16 text-center shadow-2xl shadow-primary/30">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Pronto para Transformar a Gestão da Sua Construtora?</h2>
          <p className="max-w-2xl mx-auto text-lg mb-8 text-white/80">
            Agende uma demonstração gratuita e descubra na prática como o ConstructionCon pode otimizar seus processos e impulsionar seus resultados.
          </p>
          <Link
            href="#"
            className="bg-secondary text-white/85 px-8 py-3 rounded-lg font-bold text-lg hover:bg-accent transition-all duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Agendar Demonstração Agora
          </Link>
        </div>
      </div>
    </section>
  );
}