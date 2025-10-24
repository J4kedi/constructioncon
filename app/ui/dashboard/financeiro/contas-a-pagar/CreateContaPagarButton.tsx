'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/components/Button';
import Modal from '@/app/ui/components/Modal';
import CreateContaPagarForm from '@/app/ui/dashboard/financeiro/contas-a-pagar/CreateContaPagarForm';
import { Obra } from '@prisma/client';
import { Plus } from 'lucide-react';

interface CreateContaPagarButtonProps {
  obras: Pick<Obra, 'id' | 'nome'>[];
}

export default function CreateContaPagarButton({ obras }: CreateContaPagarButtonProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>
        <Plus className="h-4 w-4 md:mr-2" />
        <span className="hidden md:block">Adicionar Despesa</span>
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Adicionar Nova Conta a Pagar">
        <CreateContaPagarForm obras={obras} onClose={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
