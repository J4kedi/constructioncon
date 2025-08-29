'use client';

import { Lock, Mail, TriangleAlert, User } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { RegisterState, registerUser } from "../actions/auth";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-primary/40 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Registrando...' : 'Registrar Usuário'}
    </button>
  );
}

export default function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);

    const initialState: RegisterState = {};
    const [state, dispatch] = useActionState(registerUser, initialState);
    
    return (
        <main className="bg-background flex items-center justify-center py-16 sm:py-24">
            <div 
                // Conteúdo do formulário
                className="bg-background dark:bg-gradient-to-br dark:from-secondary/50 dark:to-background rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-secondary/20"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text">Crie um Novo Acesso</h1>
                    <p className="text-text/70 mt-2">Insira os dados para registrar um novo usuário no painel.</p>
                </div>

                <form action={dispatch}>
                    <div className="space-y-5">
                        {/* Campo Nome do Usuário */}
                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-text mb-1">Nome do Usuário</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />
                                <input 
                                    type="text" 
                                    id="fullName" 
                                    name="fullName"
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="João da Silva"
                                />
                            </div>
                        </div>

                        {/* Campo Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-text mb-1">Email de Acesso</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />
                                <input 
                                    type="email" 
                                    id="email" 
                                    name="email"
                                    required
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="joao.silva@suaempresa.com"
                                />
                            </div>
                        </div>
                        
                        {/* Campo Senha */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-text mb-1">Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    id="password" 
                                    name="password"
                                    required
                                    minLength={8}
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Campo Confirmar Senha */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text mb-1">Confirme a Senha</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-text/40" />
                                <input 
                                    type={showPassword ? 'text' : 'password'}
                                    id="confirmPassword" 
                                    name="confirmPassword"
                                    required
                                    minLength={8}
                                    className="w-full pl-10 pr-4 py-2 bg-secondary/20 border border-secondary/50 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {/* Checkbox para mostrar senha */}
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
                    {/* Exibição de Erro */}
                    {state.error && (
                        <div className="flex items-center gap-2 mt-4 text-red-500 bg-red-500/10 p-3 rounded-lg">
                            <TriangleAlert className="h-5 w-5" />
                            <p className="text-sm">{state.error}</p>
                        </div>
                    )}
                    <div className="mt-8">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </main>
    );
}