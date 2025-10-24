import { formatCurrency, formatDate } from '@/app/lib/utils';
import Table from '@/app/ui/components/Table';
import { StatusBadge } from '@/app/ui/components/BadgeFactory';
import type { ContaPagar } from '@prisma/client';

export default function ContasAPagarTable({ data: contas }: { data: ContaPagar[] }) {
  const headers = ['Fornecedor', 'Vencimento', 'Valor', 'Status'];

  const renderCells = (conta: ContaPagar): React.ReactNode[] => [
    conta.fornecedor,
    formatDate(conta.dataVencimento),
    formatCurrency(conta.valor),
    <StatusBadge type="contaStatus" value={conta.status} />,
    <div className="flex justify-end gap-3">
      {/* Ações rápidas aqui */}
    </div>
  ];

  return <Table headers={headers} data={contas} renderCells={renderCells} />;
}
