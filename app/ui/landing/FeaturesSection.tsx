import { features } from "@/app/lib/constants";

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-b from-background to-background/80 dark:from-background dark:to-secondary/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text">Tudo que sua construtora precisa</h2>
          <p className="mt-4 text-lg text-text/70 max-w-2xl mx-auto">
            Desde o controle financeiro até a comunicação com o cliente, temos as ferramentas certas para o seu sucesso.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gradient-to-br from-background to-background/50 dark:from-background/80 dark:to-background/90 p-6 rounded-xl shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300 border border-secondary/20">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">{feature.title}</h3>
              <p className="text-text/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}