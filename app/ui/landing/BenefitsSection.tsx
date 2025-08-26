import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function BenefitsSection() {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-primary font-semibold">PARA SUA CONSTRUTORA</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text mt-2 mb-4">Centralize a gestão e ganhe eficiência.</h2>
            <p className="text-text/80 mb-6">
              Com o ConstructionCon, você elimina planilhas complexas e sistemas desconectados. Tenha uma visão 360º de todas as suas obras, otimize recursos, reduza custos e tome decisões baseadas em dados precisos e atualizados.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start"><ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-1 mr-2" /><span className="text-text">Visão consolidada de finanças e estoque.</span></li>
              <li className="flex items-start"><ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-1 mr-2" /><span className="text-text">Acompanhamento de progresso em tempo real.</span></li>
              <li className="flex items-start"><ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-1 mr-2" /><span className="text-text">Relatórios automáticos para análise estratégica.</span></li>
            </ul>
          </div>
          <div className="p-4 bg-secondary/30 rounded-xl shadow-lg border border-secondary/20">
            <Image
              width={600}
              height={400}
              src="https://placehold.co/600x400/5471c4/f2f4f8?text=Visão+Gerencial"
              alt="Visão Gerencial"
              className="rounded-lg w-full h-auto"
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-12 items-center mt-20">
          <div className="p-4 bg-secondary/30 rounded-xl shadow-lg border border-secondary/20 md:order-2">
            <Image
              width={600}
              height={400}
              src="https://placehold.co/600x400/567ff0/f2f4f8?text=Portal+do+Cliente"
              alt="Portal do Cliente"
              className="rounded-lg w-full h-auto"
            />
          </div>
          <div className="md:order-1">
            <span className="text-primary font-semibold">PARA SEU CLIENTE</span>
            <h2 className="text-3xl md:text-4xl font-bold text-text mt-2 mb-4">Transparência que gera confiança.</h2>
            <p className="text-text/80 mb-6">
              Fortaleça o relacionamento com seus clientes oferecendo uma experiência digital única. Através do portal, eles podem acompanhar o avanço da obra, visualizar documentos importantes e realizar pagamentos de forma simples e segura.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start"><ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-1 mr-2" /><span className="text-text">Barra de progresso visual e intuitiva.</span></li>
              <li className="flex items-start"><ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-1 mr-2" /><span className="text-text">Acesso a contratos, plantas e documentos.</span></li>
              <li className="flex items-start"><ArrowRight className="h-5 w-5 text-accent flex-shrink-0 mt-1 mr-2" /><span className="text-text">Pagamentos via Pix e boleto com segurança.</span></li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}