'use client';

import { useState } from 'react';
import PageHeader from '@/app/ui/components/PageHeader';
import DocumentosTable from '@/app/ui/dashboard/financeiro/documentos/Table';
import { Button } from '@/app/ui/components/Button';
import { Plus } from 'lucide-react';
import { Prisma, Obra, ContaPagar, ContaReceber } from '@prisma/client';
import CreateDocumentoForm from '@/app/ui/dashboard/financeiro/documentos/CreateDocumentoForm';
import { toast } from 'sonner';

type DocumentoComRelacoes = Prisma.DocumentGetPayload<{
  include: {
    obra: true;
    contaPagar: { include: { supplier: true } };
    contaReceber: true;
  };
}>;

interface DocumentosClientPageProps {
  documentos: DocumentoComRelacoes[];
  obras: Pick<Obra, 'id' | 'nome'>[];
  contasPagar: ContaPagar[];
  contasReceber: ContaReceber[];
}

export default function DocumentosClientPage({ documentos, obras, contasPagar, contasReceber }: DocumentosClientPageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const actionButtons = (
    <div className="flex gap-2">
      <Button onClick={() => setIsModalOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Documento
      </Button>
      <Button variant="secondary" onClick={() => toast.info('Funcionalidade de emissão de NFS-e em breve!')}>
        Emitir NFS-e
      </Button>
    </div>
  );

  return (
    <div className="w-full">
      <PageHeader
        title="Documentos Fiscais"
        searchPlaceholder="Buscar por nome, obra, fornecedor ou cliente..."
        actionButtons={actionButtons}
      />
      <div className="mt-6">
        <DocumentosTable data={documentos} />
      </div>
      <CreateDocumentoForm 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        obras={obras}
        contasPagar={contasPagar}
        contasReceber={contasReceber}
      />
    </div>
  );
}
