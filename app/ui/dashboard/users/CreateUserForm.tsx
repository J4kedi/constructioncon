'use client';

import { Lock, Mail, TriangleAlert, User, Briefcase } from "lucide-react";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { RegisterState } from "@/app/lib/definitions";
import { registerUser } from "@/app/actions/auth";
import InputField from "@/app/ui/components/InputField";

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

    const initialState: RegisterState = {};
    const [state, dispatch] = useActionState(registerUser, initialState);

    if (state.success) {
        if(onClose) onClose();
    }
    
    return (
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

                <InputField
                    id="role"
                    name="role"
                    label="Função"
                    Icon={Briefcase}
                    type="text"
                    placeholder="Ex: USER, CUSTOMER"
                    required
                />

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
    );
}