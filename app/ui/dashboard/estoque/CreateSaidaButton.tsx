'use client';

import { useState } from 'react';
import Modal from '@/app/ui/components/Modal';
import CreateSaidaForm from './CreateSaidaForm';
import { ArrowUp } from 'lucide-react';
import type { PlainCatalogoItem } from './CreateEntradaButton'; // Reutiliza o tipo

// Obras também podem ter Decimals, então criamos um tipo "puro" para elas
export type PlainObra = {
  id: string;
  nome: string;
  // Adicione outros campos se necessário
};

interface CreateSaidaButtonProps {
  catalogoItens: PlainCatalogoItem[];
  obras: PlainObra[];
}

export default function CreateSaidaButton({ catalogoItens, obras }: CreateSaidaButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div>
      <button 
        onClick={handleOpenModal}
        className="flex items-center gap-2 px-4 py-2 border border-secondary/50 text-text hover:bg-secondary/20 rounded-md transition-colors"
      >
        <ArrowUp className="h-5 w-5" />
        <span>Registrar Saída</span>
      </button>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Registrar Saída de Item do Estoque">
        <CreateSaidaForm 
          catalogoItens={catalogoItens} 
          obras={obras}
          onClose={handleCloseModal} 
        />
      </Modal>
    </div>
  );
}