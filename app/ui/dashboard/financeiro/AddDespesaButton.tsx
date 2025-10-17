'use client';

import ModalFormButton from '@/app/ui/components/ModalFormButton';
import CreateDespesaForm from './CreateDespesaForm';
import { Obra } from '@prisma/client';

interface AddDespesaButtonProps {
  obras: Pick<Obra, 'id' | 'nome'>[];
}

export default function AddDespesaButton({ obras }: AddDespesaButtonProps) {
  return (
    <ModalFormButton
      buttonLabel="Adicionar Despesa"
      modalTitle="Adicionar Nova Despesa"
    >
      <CreateDespesaForm obras={obras} onClose={() => {}} />
    </ModalFormButton>
  );
}
