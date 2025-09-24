'use client';

import { deleteUser } from '@/app/actions/user.actions';
import { Trash2 } from 'lucide-react';

type DeleteUserProps = {
  id: string;
};

export function DeleteUser({ id }: DeleteUserProps) {
  const deleteUserWithId = deleteUser.bind(null, id);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    if (!confirm('Tem certeza que deseja apagar este usuário?')) {
      event.preventDefault();
    }
  };

  return (
    <form action={deleteUserWithId} onSubmit={handleSubmit}>
      <button className="rounded-md border p-2 hover:bg-secondary/20">
        <span className="sr-only">Delete</span>
        <Trash2 className="w-4 text-red-500" />
      </button>
    </form>
  );
}