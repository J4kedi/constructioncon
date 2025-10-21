'use client';

import Table from '@/app/ui/components/Table';
import { Badge } from '@/app/ui/components/Badge';
import { formatDate } from '@/app/lib/utils';
import { Prisma } from '@prisma/client';
import { Download } from 'lucide-react';
import { Button } from '@/app/ui/components/Button';

type DocumentoComRelacoes = Prisma.DocumentGetPayload<{
  include: {
    obra: true;
    contaPagar: { include: { supplier: true } };
    contaReceber: true;
  };
}>;

export default function DocumentosTable({ data }: { data: DocumentoComRelacoes[] }) {
  const headers = ['Nome', 'Tipo', 'Fornecedor/Cliente', 'Obra', 'Data de Upload'];

  const renderRow = (doc: DocumentoComRelacoes) => (
    <tr key={doc.id} className="w-full border-b py-3 text-sm last-of-type:border-none">
      <td className="whitespace-nowrap px-3 py-3">{doc.name}</td>
      <td className="whitespace-nowrap px-3 py-3"><Badge variant="outline">{doc.type}</Badge></td>
      <td className="whitespace-nowrap px-3 py-3">{doc.contaPagar?.supplier?.name || doc.contaReceber?.cliente || 'N/A'}</td>
      <td className="whitespace-nowrap px-3 py-3">{doc.obra.nome}</td>
      <td className="whitespace-nowrap px-3 py-3">{formatDate(doc.uploadedAt)}</td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          <Button variant="ghost" asChild>
            <a href={doc.url} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </td>
    </tr>
  );

  return <Table headers={headers} data={data} renderRow={renderRow} />;
}
