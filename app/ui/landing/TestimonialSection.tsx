import { testimonials } from "@/app/lib/data";

export default function TestimonialSection() {
  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-background/80 to-background dark:from-secondary/10 dark:to-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text">O que nossos parceiros dizem</h2>
          <p className="mt-4 text-lg text-text/70 max-w-2xl mx-auto">
            Construtoras de pequeno e médio porte que confiam no ConstructionCon.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background/80 dark:bg-background/90 p-8 rounded-xl shadow-lg border border-secondary/20 flex flex-col backdrop-blur-sm">
              <p className="text-text/80 italic mb-6 flex-grow">"{testimonial.quote}"</p>
              <div className="flex items-center">
                {/* Se tiver avatar, descomente e ajuste o src */}
                {/* <Image src={testimonial.avatar} alt={testimonial.name} width={48} height={48} className="rounded-full mr-4" /> */}
                <div>
                  <p className="font-bold text-text">{testimonial.name}</p>
                  <p className="text-sm text-primary">{testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}