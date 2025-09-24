'use client';

import { deleteUser } from '@/app/actions/user.actions';
import { Trash2 } from 'lucide-react';

type DeleteUserProps = {
  id: string;
};

export function DeleteUser({ id }: DeleteUserProps) {
  const deleteUserWithId = deleteUser.bind(null, id);

  return (
    <form 
      action={deleteUserWithId}
      onSubmit={(e) => {
        if (!confirm('Tem certeza que deseja apagar este usuário?')) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="rounded-md p-2 hover:bg-secondary/20 cursor-pointer">
        <span className="sr-only">Delete</span>
        <Trash2 className="w-4 text-red-500" />
      </button>
    </form>
  );
}