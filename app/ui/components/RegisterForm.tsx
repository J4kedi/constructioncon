'use client';

import { Lock, Mail, TriangleAlert, User } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { RegisterState } from "@/app/lib/definitions";
import { registerUser } from "@/app/actions/auth";
import InputField from "./InputField";

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
                className="bg-background dark:bg-gradient-to-br dark:from-secondary/50 dark:to-background rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-secondary/20"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-text">Crie um Novo Acesso</h1>
                    <p className="text-text/70 mt-2">Insira os dados para registrar um novo usuário no painel.</p>
                </div>

                <form action={dispatch}>
                    <div className="space-y-5">
                        <InputField
                            id="fullName"
                            name="fullName"
                            label="Nome do Usuário"
                            Icon={User}
                            type="text"
                            placeholder="João da Silva"
                            required
                        />

                        <InputField
                            id="email"
                            name="email"
                            label="Email de Acesso"
                            Icon={Mail}
                            type="email"
                            placeholder="joao.silva@suaempresa.com"
                            required
                        />
                        
                        <InputField
                            id="password"
                            name="password"
                            label="Senha"
                            Icon={Lock}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />

                        <InputField
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirme a Senha"
                            Icon={Lock}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            required
                            minLength={8}
                        />

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