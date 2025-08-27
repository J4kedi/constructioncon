'use client';

import { Building, Mail, MessageSquare, Phone } from "lucide-react";

export default function ContactForm() {
    return (
        <main className="bg-background flex items-center justify-center py-16 sm:py-24">
            <div 
                // Conteúdo do formulário
                className="bg-background dark:bg-gradient-to-br dark:from-secondary/50 dark:to-background rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-secondary/20"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text">Agendar Demonstração</h1>
                    <p className="text-text/70 mt-2">Preencha o formulário e nossa equipe entrará em contato.</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); alert('Formulário enviado!'); }}>
                    <div className="space-y-5">
                        {/* Campo Nome da Empresa */}
                        <div>
                            <label htmlFor="companyName" className="block text-sm font-medium text-text mb-1">Nome da Empresa</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />
                                <input 
                                    type="text" 
                                    id="companyName" 
                                    name="companyName"
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="Sua Construtora LTDA"
                                />
                            </div>
                        </div>

                        {/* Campo Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="contato@suaempresa.com"
                                />
                            </div>
                        </div>
                        
                        {/* Campo Telefone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-text mb-1">Telefone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />
                                <input 
                                    type="tel" 
                                    id="phone" 
                                    name="phone"
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="(41) 99999-9999"
                                />
                            </div>
                        </div>

                        {/* Campo Mensagem */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-text mb-1">Mensagem (Opcional)</label>
                            <div className="relative">
                                <MessageSquare className="absolute left-3 top-4 h-5 w-5 text-text/40" />
                                <textarea 
                                    id="message" 
                                    name="message"
                                    rows={4}
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
                                    placeholder="Gostaria de saber mais sobre a personalização do sistema..."
                                ></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button 
                            type="submit"
                            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-primary/40"
                        >
                            Enviar Solicitação
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}