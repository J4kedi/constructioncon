'use client';

import { Lock, Mail, Shield, User } from "lucide-react";
import { useActionState, useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { registerUser } from "@/app/actions/auth";
import InputField from "@/app/ui/components/InputField";
import SelectField from "@/app/ui/components/SelectField";
import { Button } from "@/app/ui/components/Button";
import { toast } from "sonner";

interface RegisterFormProps {
  onClose?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Registrando...' : 'Registrar Usuário'}
    </Button>
  );
}

export default function RegisterForm({ onClose }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [state, dispatch] = useActionState(registerUser, { success: false });

  useEffect(() => {
    if (state.success) {
      toast.success("Usuário registrado com sucesso!");
      if (onClose) {
        onClose();
      }
    }
    if (state.errors) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  return (
    <div className="w-full max-w-lg p-4">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-text">Crie um Novo Acesso</h1>
        <p className="text-text/70 mt-1">Insira os dados para registrar um novo usuário no painel.</p>
      </div>

      <form action={dispatch}>
        <div className="space-y-4">
          <InputField
            id="name"
            name="name"
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

          <SelectField
            id="role"
            name="role"
            label="Função"
            Icon={Shield}
            defaultValue="USER"
            required
          >
            <option value="USER">Usuário</option>
            <option value="COMPANY_ADMIN">Administrador</option>
            <option value="END_CUSTOMER">Cliente Final</option>
          </SelectField>

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
        
        <div className="mt-6">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
