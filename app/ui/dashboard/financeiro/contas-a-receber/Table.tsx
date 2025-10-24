import { formatCurrency, formatDate } from '@/app/lib/utils';
import Table from '@/app/ui/components/Table';
import { StatusBadge } from '@/app/ui/components/BadgeFactory';
import type { ContaReceber } from '@prisma/client';

export default function ContasAReceberTable({ data: contas }: { data: ContaReceber[] }) {
  const headers = ['Cliente', 'Vencimento', 'Valor', 'Status'];

  const renderCells = (conta: ContaReceber): React.ReactNode[] => [
    conta.cliente,
    formatDate(conta.dataVencimento),
    formatCurrency(conta.valor),
    <StatusBadge type="contaStatus" value={conta.status} />,
    <div className="flex justify-end gap-3">
      {/* Ações rápidas aqui */}
    </div>
  ];

  return <Table headers={headers} data={contas} renderCells={renderCells} />;
}
