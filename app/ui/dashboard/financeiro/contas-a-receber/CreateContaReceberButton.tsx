'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/components/Button';
import Modal from '@/app/ui/components/Modal';
import CreateContaReceberForm from '@/app/ui/dashboard/financeiro/contas-a-receber/CreateContaReceberForm';
import { Obra } from '@prisma/client';
import { Plus } from 'lucide-react';

interface CreateContaReceberButtonProps {
  obras: Pick<Obra, 'id' | 'nome'>[];
}

export default function CreateContaReceberButton({ obras }: CreateContaReceberButtonProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setModalOpen(true)} variant="secondary">
        <Plus className="h-4 w-4 md:mr-2" />
        <span className="hidden md:block">Adicionar Receita</span>
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Adicionar Nova Conta a Receber">
        <CreateContaReceberForm obras={obras} onClose={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}
