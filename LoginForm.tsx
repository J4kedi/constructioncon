'use client';

import { Mail, Lock, TriangleAlert } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from 'react-dom';
import { LoginState } from '@/app/lib/definitions';
import { authenticate } from '@/app/actions/auth';
import InputField from "./app/ui/components/InputField";


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-accent transition-all duration-300 shadow-lg hover:shadow-primary/40 disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  );
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  
  const initialState: LoginState = {};
  const [state, dispatch] = useActionState(authenticate, initialState);

  return (
    <main className="bg-background flex items-center justify-center py-16 sm:py-24">
      <div className="bg-background dark:bg-gradient-to-br dark:from-secondary/50 dark:to-background rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-secondary/20">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text">Acesse sua Conta</h1>
          <p className="text-text/70 mt-2">Digite seus dados para entrar no painel.</p>
        </div>

        <form action={dispatch}>
          <div className="space-y-5">
            <InputField
              id="email"
              name="email"
              label="Email de Acesso"
              Icon={Mail}
              type="email"
              placeholder="seu.email@suaempresa.com"
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

          {/* Exibição de Erro vindo da Server Action */}
          {state?.error && (
            <div className="flex items-center gap-2 mt-4 text-red-500 bg-red-500/10 p-3 rounded-lg">
                <TriangleAlert className="h-5 w-5" />
                <p className="text-sm">{state.error}</p>
            </div>
          )}

          {/* Botão Entrar */}
          <div className="mt-8">
            <SubmitButton />
          </div>
        </form>
      </div>
    </main>

  )
}
