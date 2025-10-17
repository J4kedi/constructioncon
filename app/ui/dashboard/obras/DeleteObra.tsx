'use client';

import { useState, useEffect, useActionState } from 'react';
import { Trash2 } from 'lucide-react';
import { deleteObra } from '@/app/actions/obra.actions';
import { FormState } from '@/app/lib/action-handler';
import ConfirmationModal from '@/app/ui/components/ConfirmationModal';
import { toast } from 'sonner';

interface DeleteObraProps {
  id: string;
  onSuccess?: () => void;
}

export function DeleteObra({ id, onSuccess }: DeleteObraProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const initialState: FormState = { message: null, errors: {}, success: false };
  const [state, dispatch] = useActionState(deleteObra, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Obra deletada com sucesso!');
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
        aria-label="Deletar Obra"
      >
        <Trash2 className="w-4 text-red-500" />
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        formAction={dispatch}
        title="Confirmar Exclusão da Obra"
        confirmButtonText="Sim, excluir obra"
        errorMessage={state.message}
      >
        <input type="hidden" name="id" value={id} />
        <p>Tem certeza de que deseja excluir esta obra? Todos os dados financeiros e de estoque associados a ela podem ser afetados. Esta ação não pode ser desfeita.</p>
      </ConfirmationModal>
    </>
  );
}
