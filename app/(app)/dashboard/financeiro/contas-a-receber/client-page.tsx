'use client';

import { useState, ReactNode } from 'react';
import PageHeader from '@/app/ui/components/PageHeader';
import { Button } from '@/app/ui/components/Button';
import { Plus } from 'lucide-react';
import CreateContaReceberForm from '@/app/ui/dashboard/financeiro/contas-a-receber/CreateContaReceberForm';
import type { Obra } from '@prisma/client';

interface ContasAReceberClientPageProps {
  table: ReactNode;
  obras: Pick<Obra, 'id' | 'nome'>[];
}

export default function ContasAReceberClientPage({ table, obras }: ContasAReceberClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full">
      <PageHeader
        title="Contas a Receber"
        actionButtons={
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Conta
          </Button>
        }
        searchPlaceholder="Buscar por cliente ou descrição..."
      />
      <div className="mt-6">
        {table}
      </div>
      <CreateContaReceberForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        obras={obras} 
      />
    </div>
  );
}
