'use client';

import { useActionState, useEffect, useState, useRef } from 'react';
import { User, Lock, Camera } from 'lucide-react';
import { Prisma } from '@prisma/client';
import InputField from '@/app/ui/components/InputField';
import { updateProfile } from '@/app/actions/user.actions';
import { changePassword } from '@/app/actions/auth';
import Image from 'next/image';
import { FormState } from '@/app/lib/action-handler';
import { Button } from '@/app/ui/components/Button';
import { toast } from 'sonner';

import type { PlainUser } from '@/app/lib/definitions';

// --- Formulário de Dados do Perfil ---
function ProfileDataForm({ user }: { user: PlainUser }) {
  const initialState: FormState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(updateProfile, initialState);
  const [preview, setPreview] = useState<string | null>(user.avatarUrl);

  useEffect(() => {
    if (state.success) toast.success(state.message);
    if (state.message && !state.success) toast.error(state.message);
  }, [state]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <form action={dispatch} className="space-y-5">
      <h3 className="text-lg font-medium">Dados do Perfil</h3>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Image src={preview || '/avatar-placeholder.svg'} alt="Avatar" width={80} height={80} className="rounded-full" />
          <label htmlFor="image" className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-1.5 cursor-pointer hover:bg-primary/90">
            <Camera size={16} />
            <input id="image" name="image" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
          </label>
        </div>
        <div className="flex-grow">
          <InputField id="name" name="name" label="Nome do Usuário" Icon={User} defaultValue={user.name} required />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit">Salvar Dados</Button>
      </div>
    </form>
  );
}

// --- Formulário de Alteração de Senha ---
function PasswordChangeForm() {
  const initialState: FormState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(changePassword, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      formRef.current?.reset();
    }
    if (state.message && !state.success) toast.error(state.message);
  }, [state]);

  return (
    <form action={dispatch} ref={formRef} className="space-y-5">
      <h3 className="text-lg font-medium">Alterar Senha</h3>
      <InputField id="oldPassword" name="oldPassword" label="Senha Antiga" type="password" Icon={Lock} required />
      <InputField id="newPassword" name="newPassword" label="Nova Senha" type="password" Icon={Lock} required />
      <InputField id="confirmPassword" name="confirmPassword" label="Confirmar Nova Senha" type="password" Icon={Lock} required />
      <div className="flex justify-end">
        <Button type="submit">Alterar Senha</Button>
      </div>
    </form>
  );
}

// --- Componente Principal ---
export default function EditPerfilForm({ user, onClose }: { user: PlainUser, onClose: () => void }) {
  return (
    <div className="space-y-8 rounded-lg bg-background p-4 md:p-6">
      <ProfileDataForm user={user} />
      <div className="border-t border-secondary/20"></div>
      <PasswordChangeForm />
    </div>
  );
}