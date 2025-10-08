'use client';

import { Lock, Mail, TriangleAlert, User, Briefcase } from "lucide-react";
import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { registerUser } from "@/app/actions/auth";
import InputField from "@/app/ui/components/InputField";
import { UserRole } from "@prisma/client";

import { FormState } from "@/app/lib/action-handler";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary/80 transition-all duration-300 shadow-lg hover:shadow-primary/40 disabled:bg-gray-400 disabled:cursor-not-allowed"
    >
      {pending ? 'Criando Usuário...' : 'Criar Usuário'}
    </button>
  );
}

type CreateUserFormProps = {
  onClose?: () => void;
};

export default function CreateUserForm({ onClose }: CreateUserFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    const initialState: FormState = { message: null, errors: {} };
    const [state, dispatch] = useActionState(registerUser, initialState);

    useEffect(() => {
        if (state.success && onClose) {
            onClose();
        }
    }, [state.success, onClose]);
    
    return (
        <form action={dispatch}>
            <div className="space-y-5">
                <InputField
                    id="name"
                    name="name"
                    label="Nome do Usuário"
                    Icon={User}
                    type="text"
                    placeholder="João da Silva"
                    errors={state.errors?.name}
                    required
                />

                <InputField
                    id="email"
                    name="email"
                    label="Email de Acesso"
                    Icon={Mail}
                    type="email"
                    placeholder="joao.silva@suaempresa.com"
                    errors={state.errors?.email}
                    required
                />
                
                <InputField
                    id="password"
                    name="password"
                    label="Senha"
                    Icon={Lock}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    errors={state.errors?.password}
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
                    errors={state.errors?.confirmPassword}
                    required
                    minLength={8}
                />

                <div>
                  <label htmlFor="role" className="mb-2 block text-sm font-medium">Função</label>
                  <div className="relative">
                    <select
                      id="role"
                      name="role"
                      className="peer block w-full cursor-pointer rounded-md border border-secondary/30 bg-background py-2 pl-10 text-sm outline-none placeholder:text-text/60 focus:border-primary focus:ring-1 focus:ring-primary/50"
                      defaultValue="USER"
                    >
                      {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{role.replace('_', ' ').toLowerCase()}</option>
                      ))}
                    </select>
                    <Briefcase className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-text/70" />
                  </div>
                   {state.errors?.role &&
                    state.errors.role.map((error: string) => (
                        <p className="mt-2 text-sm text-red-500" key={error}>
                        {error}
                        </p>
                    ))}
                </div>

                <div className="flex items-center">
                    <input
                        id="showPassword-modal"
                        type="checkbox"
                        checked={showPassword}
                        onChange={() => setShowPassword(!showPassword)}
                        className="h-4 w-4 rounded border-secondary/50 text-primary focus:ring-primary"
                    />
                    <label htmlFor="showPassword-modal" className="ml-2 block text-sm text-text/80">
                        Mostrar senha
                    </label>
                </div>

            </div>
            {state.message && (
                <div className="flex items-center gap-2 mt-4 text-red-500 bg-red-500/10 p-3 rounded-lg">
                    <TriangleAlert className="h-5 w-5" />
                    <p className="text-sm">{state.message}</p>
                </div>
            )}
            <div className="mt-8">
                <SubmitButton />
            </div>
        </form>
    );
}