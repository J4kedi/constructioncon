'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import Modal from '@/app/ui/components/Modal';
import CreateObraForm from '@/app/ui/dashboard/obras/CreateObraForm';

// Supondo que você terá uma lista de clientes para passar para o formulário
// Por enquanto, passaremos um array vazio.
// const customers = await fetchUsers(subdomain, { roles: [UserRole.END_CUSTOMER] });

export default function ObrasPage() {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Minhas Obras</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors shadow-md"
        >
          <Plus size={20} />
          <span>Criar Nova Obra</span>
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Criar Nova Obra"
      >
        <CreateObraForm customers={[]} />
      </Modal>

      <div className="mt-8">
        {/* A tabela ou lista de obras será adicionada aqui no futuro */}
        <p className="text-center text-text/60">Nenhuma obra encontrada.</p>
      </div>
    </div>
  );
}
