'use client';

import { useState, ReactNode } from 'react';
import PageHeader from '@/app/ui/components/PageHeader';
import { Button } from '@/app/ui/components/Button';
import { Plus } from 'lucide-react';
import CreateContaPagarForm from '@/app/ui/dashboard/financeiro/contas-a-pagar/CreateContaPagarForm';
import type { Obra, Supplier } from '@prisma/client';

interface ContasAPagarClientPageProps {
  table: ReactNode;
  obras: Pick<Obra, 'id' | 'nome'>[];
  suppliers: Pick<Supplier, 'id' | 'name'>[];
}

export default function ContasAPagarClientPage({ table, obras, suppliers }: ContasAPagarClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      <PageHeader
        title="Contas a Pagar"
        actionButtons={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Conta
          </Button>
        }
        searchPlaceholder="Buscar por fornecedor ou descrição..."
      />
      <div className="mt-6">
        {table}
      </div>
      <CreateContaPagarForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        obras={obras} 
        suppliers={suppliers}
      />
    </div>
  );
}
