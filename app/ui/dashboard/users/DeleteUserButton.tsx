'use client';

import { useState, useEffect, useActionState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteUser } from '@/app/actions/user.actions';
import { FormState } from '@/app/lib/action-handler';
import ConfirmationModal from '@/app/ui/components/ConfirmationModal';
import { toast } from 'sonner';

interface DeleteUserProps {
  id: string;
  onSuccess?: () => void;
}

export function DeleteUser({ id, onSuccess }: DeleteUserProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialState: FormState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(deleteUser, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Usuário deletado com sucesso!');
      setIsModalOpen(false);
      onSuccess?.();
    }
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onSuccess]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <button 
        onClick={handleOpenModal} 
        className="rounded-md p-2 hover:bg-secondary/20 cursor-pointer"
        aria-label="Deletar usuário"
      >
        <Trash2 className="w-4 text-red-500" />
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formAction={dispatch}
        title="Confirmar Exclusão"
        confirmButtonText="Sim, excluir"
        errorMessage={state.message}
      >
        <input type="hidden" name="id" value={id} />
        <p>Tem certeza de que deseja excluir este usuário? <br /> Todas as informações associadas a ele serão perdidas permanentemente. <br /> Esta ação não pode ser desfeita.</p>
      </ConfirmationModal>
    </>
  );
}
