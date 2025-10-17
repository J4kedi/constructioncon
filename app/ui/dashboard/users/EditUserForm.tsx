import { Briefcase, User, Shield } from 'lucide-react';
import { Prisma, UserRole } from '@prisma/client';
import InputField from '@/app/ui/components/InputField';
import SelectField from '@/app/ui/components/SelectField';
import { updateUser } from '@/app/actions/user.actions';
import { toast } from 'sonner';
import { PlainUser } from '@/app/lib/definitions';

export default function EditUserForm({ user, onClose }: { user: PlainUser, onClose: () => void }) {
  
  const initialState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(updateUser, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Usuário atualizado com sucesso!');
      onClose();
    }
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onClose]);

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

        <SelectField
          id="role"
          name="role"
          label="Função"
          Icon={Shield}
          defaultValue={user.role}
          required
        >
          {Object.values(UserRole).map(role => (
            <option key={role} value={role}>{role.replace('_', ' ').toLowerCase()}</option>
          ))}
        </SelectField>

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
