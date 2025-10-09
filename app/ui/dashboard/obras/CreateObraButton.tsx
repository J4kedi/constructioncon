'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '@/app/ui/components/Modal';
import CreateObraForm from './CreateObraForm';
import { User } from '@prisma/client';
import { Button } from '@/app/ui/components/Button';

type CreateObraButtonProps = {
  customers: User[];
};

export default function CreateObraButton({ customers }: CreateObraButtonProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setModalOpen(true)}>
        <Plus size={20} />
        <span>Criar Nova Obra</span>
      </Button>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Criar Nova Obra"
      >
        <CreateObraForm customers={customers} onClose={() => setModalOpen(false)} />
      </Modal>
    </>
  );
}