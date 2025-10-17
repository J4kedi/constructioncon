'use client';

import ModalFormButton from '@/app/ui/components/ModalFormButton';
import CreateObraForm from './CreateObraForm';
import { User } from '@prisma/client';

type CreateObraButtonProps = {
  customers: User[];
};

export default function CreateObraButton({ customers }: CreateObraButtonProps) {
  return (
    <ModalFormButton
      buttonLabel="Criar Nova Obra"
      modalTitle="Criar Nova Obra"
      // Oculta o texto em telas pequenas, mostrando apenas o ícone
      className="md:w-auto w-full justify-center px-4 md:px-2"
    >
      <CreateObraForm customers={customers} onClose={() => {}} />
    </ModalFormButton>
  );
}