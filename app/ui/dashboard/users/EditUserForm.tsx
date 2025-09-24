'use client';

import { useActionState, useEffect } from 'react';
import { User, Briefcase, Pencil } from 'lucide-react';
import { Prisma, UserRole } from '@prisma/client';
import InputField from '@/app/ui/components/InputField';
import { updateUser } from '@/app/actions/user.actions';

type UserPayload = Prisma.UserGetPayload<{}>;

export default function EditUserForm({ user, onClose }: { user: UserPayload, onClose: () => void }) {
  
  const initialState = { message: null, errors: {}, success: false };
  const updateUserWithId = updateUser.bind(null);
  const [state, dispatch] = useActionState(updateUserWithId, initialState);

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={user.id} />
      <div className="space-y-5 rounded-lg bg-background p-4 md:p-6">
        <h2 className="text-xl font-semibold">Editar Usuário</h2>
        
        <InputField
          id="name"
          name="name"
          label="Nome do Usuário"
          Icon={User}
          defaultValue={user.name}
          required
        />

        <InputField
          id="jobTitle"
          name="jobTitle"
          label="Cargo"
          Icon={Briefcase}
          defaultValue={user.jobTitle || ''}
        />

        <div>
          <label htmlFor="role" className="mb-2 block text-sm font-medium">Função</label>
          <select
            id="role"
            name="role"
            className="peer block w-full cursor-pointer rounded-md border border-secondary/30 bg-background py-2 pl-4 text-sm outline-none placeholder:text-text/60 focus:border-primary focus:ring-1 focus:ring-primary/50"
            defaultValue={user.role}
            aria-describedby="role-error"
          >
            {Object.values(UserRole).map(role => (
              <option key={role} value={role}>{role.replace('_', ' ').toLowerCase()}</option>
            ))}
          </select>
        </div>

        {state.message && (
          <div aria-live="polite" className="text-sm text-red-500">
            <p>{state.message}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="flex h-10 items-center rounded-lg bg-gray-200 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-300">
            Cancelar
          </button>
          <button type="submit" className="flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-white transition-colors hover:bg-primary/90">
            Salvar Alterações
          </button>
        </div>
      </div>
    </form>
  );
}
