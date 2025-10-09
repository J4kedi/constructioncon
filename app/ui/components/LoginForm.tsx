'use client';

import { Mail, Lock, TriangleAlert } from "lucide-react";
import { useActionState, useState } from "react"; // Corrigido
import { useFormStatus } from 'react-dom';
import { LoginState } from '@/app/lib/definitions';
import { authenticate } from '@/app/actions/auth';
import InputField from "./InputField";
import { Button } from './Button';

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Entrando...' : 'Entrar'}
    </Button>
  );
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  
  const initialState: LoginState = {};
  const [state, dispatch] = useActionState(authenticate, initialState); // Corrigido

  return (
    <main className="bg-background flex items-center justify-center py-16 sm:py-24 min-h-screen">
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

          {state?.error && (
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

  )
}
