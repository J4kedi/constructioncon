'use client';

import { useState } from 'react';
import { Button } from '@/app/ui/components/Button';
import Modal from '@/app/ui/components/Modal';
import CreateDocumentoForm from '@/app/ui/dashboard/financeiro/documentos/CreateDocumentoForm';
import { Obra, ContaPagar, ContaReceber } from '@prisma/client';
import { Plus } from 'lucide-react';

interface CreateDocumentoButtonProps {
  obras: Pick<Obra, 'id' | 'nome'>[];
}

export default function CreateDocumentoButton({ obras }: CreateDocumentoButtonProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>
        <Plus className="h-4 w-4 md:mr-2" />
        <span className="hidden md:block">Adicionar Documento</span>
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Adicionar Novo Documento">
        <CreateDocumentoForm 
          obras={obras}
          onClose={() => setModalOpen(false)} isOpen={false}        />
      </Modal>
    </>
  );
}
