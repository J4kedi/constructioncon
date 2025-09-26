'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '@/app/ui/components/Modal';
import CreateObraForm from './CreateObraForm';
import { User } from '@prisma/client';

type CreateObraButtonProps = {
  customers: User[];
};

export default function CreateObraButton({ customers }: CreateObraButtonProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-md"
      >
        <Plus size={20} />
        <span>Criar Nova Obra</span>
      </button>

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
