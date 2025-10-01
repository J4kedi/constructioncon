'use client';

import { useState } from 'react';
import Modal from '@/app/ui/components/Modal';
import CreateEntradaForm from './CreateEntradaForm';
import { ArrowDown } from 'lucide-react';
import type { Supplier } from '@prisma/client';

// Tipo "puro" para o item de catálogo, seguro para passar para client components
export type PlainCatalogoItem = {
  id: string;
  nome: string;
  custoUnitario: number;
  nivelMinimo: number;
  // Adicione outros campos se necessário no futuro
};

interface CreateEntradaButtonProps {
  catalogoItens: PlainCatalogoItem[];
  suppliers: Supplier[];
}

export default function CreateEntradaButton({ catalogoItens, suppliers }: CreateEntradaButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <button 
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-4 py-2 bg-secondary/20 text-text hover:bg-secondary/30 rounded-md transition-colors"
      >
        <ArrowDown className="h-5 w-5" />
        <span>Registrar Entrada</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Registrar Entrada de Item no Estoque">
        <CreateEntradaForm 
          catalogoItens={catalogoItens} 
          suppliers={suppliers}
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}