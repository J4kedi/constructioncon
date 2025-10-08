'use client';

import { useFormState } from 'react-dom';
import { deleteUser } from '@/app/actions/user.actions';
import { Trash2 } from 'lucide-react';
import { FormState } from '@/app/lib/action-handler';
import { useEffect } from 'react';

type DeleteUserProps = {
  id: string;
};

export function DeleteUser({ id }: DeleteUserProps) {
  const initialState: FormState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(deleteUser, initialState);

  useEffect(() => {
    if (state.message && !state.success) {
      alert(`Erro: ${state.message}`);
    }
    // Optionally, you could show a success message as well
    // if (state.message && state.success) {
    //   alert(state.message);
    // }
  }, [state]);

  return (
    <form
      action={dispatch}
      onSubmit={(e) => {
        if (!confirm('Tem certeza que deseja apagar este usuário?')) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-md p-2 hover:bg-secondary/20 cursor-pointer">
        <span className="sr-only">Delete</span>
        <Trash2 className="w-4 text-red-500" />
      </button>
    </form>
  );
}
