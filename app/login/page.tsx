'use client';
import { Mail, Lock } from "lucide-react";
import { useState } from "react";

export default function Login(){
  const [showPassword, setShowPassword] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form_dado = new FormData(e.currentTarget);
    const email = form_dado.get('email');
    const password = form_dado.get('password');

    console.log('Tentando entrar no login com:', email, password);
  }

  return(
    <main className="bg-background flex items-center justify-center py-16 sm:py-24">
            <div 
                className="bg-background dark:bg-gradient-to-br dark:from-secondary/50 dark:to-background 
                           rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-secondary/20"
            >
              <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text">Acesse sua Conta</h1>
                    <p className="text-text/70 mt-2">Digite seus dados para entrar no painel.</p>
                </div>

                <form onSubmit={submit}>
                    <div className="space-y-5">
                        {}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email de Acesso</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 
                                               rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="seu.email@suaempresa.com"
                                />
                            </div>
                        </div>

                        {}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text mb-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    id="password" 
                                    name="password"
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 
                                               rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {}
                        <div className="flex items-center">
                            <input
                                id="showPassword"
                                type="checkbox"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="h-4 w-4 rounded border-secondary/50 text-primary focus:ring-primary"
                            />
                            <label htmlFor="showPassword" className="ml-2 block text-sm text-text/80">
                                Mostrar senha
                            </label>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button 
                            type="submit"
                            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg 
                                       hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-primary/40"
                        >
                            Entrar
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-text/70">
                        Ainda não tem uma conta?{' '}
                        <a href="/register" className="font-semibold text-primary hover:underline">
                            Registre-se
                        </a>
                    </p>
                </div>
            </div>
        </main>

  )
}
