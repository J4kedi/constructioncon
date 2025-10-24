'use client';

import Table from '@/app/ui/components/Table';
import { StatusBadge } from '@/app/ui/components/BadgeFactory';
import { formatDate } from '@/app/lib/utils';
import { Prisma, DocumentType } from '@prisma/client';
import { Download, Pencil } from 'lucide-react';
import { Button } from '@/app/ui/components/Button';
import { useTableState } from '@/app/lib/hooks/useTableState';

type DocumentoComRelacoes = Prisma.DocumentGetPayload<{
  include: {
    obra: true;
    contaPagar: { include: { supplier: true } };
    contaReceber: true;
  };
}>;

export default function DocumentosTable({ data }: { data: DocumentoComRelacoes[] }) {
  const headers = ['Nome', 'Tipo', 'Obra', 'Data de Upload'];

  const renderCells = (doc: DocumentoComRelacoes): React.ReactNode[] => [
    doc.name,
    <StatusBadge type="documentType" value={doc.type} />,
    doc.obra.nome,
    formatDate(doc.uploadedAt),
    <div className="flex justify-end gap-3">
      <Button variant="ghost" asChild>
        <a href={doc.url} target="_blank" rel="noopener noreferrer">
          <Download className="h-4 w-4" />
        </a>
      </Button>
    </div>
  ];

  return <Table headers={headers} data={data} renderCells={renderCells} />;
}