'use client';

import { useState } from 'react';
import Modal from '@/app/ui/components/Modal';
import CreateItemForm from './CreateItemForm';
import { Plus } from 'lucide-react';

export default function CreateItemButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <button 
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
      >
        <Plus className="h-5 w-5" />
        <span>Adicionar Item</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Adicionar Novo Item ao Catálogo">
        <CreateItemForm onClose={handleCloseModal} />
      </Modal>
    </div>
  );
}
