import { formatCurrency, formatDate } from '@/app/lib/utils';
import Table from '@/app/ui/components/Table';
import { BadgeFactory } from '@/app/ui/components/BadgeFactory';
import type { ContaReceber } from '@prisma/client';

export default function ContasAReceberTable({ data: contas }: { data: ContaReceber[] }) {
  const headers = ['Cliente', 'Vencimento', 'Valor', 'Status', ''];

  const renderRow = (conta: ContaReceber) => (
    <tr key={conta.id} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      <td className="whitespace-nowrap px-3 py-3">{conta.cliente}</td>
      <td className="whitespace-nowrap px-3 py-3">{formatDate(conta.dataVencimento)}</td>
      <td className="whitespace-nowrap px-3 py-3">{formatCurrency(conta.valor)}</td>
      <td className="whitespace-nowrap px-3 py-3">
        <BadgeFactory type="contaStatus" status={conta.status} />
      </td>
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <div className="flex justify-end gap-3">
          {/* Ações rápidas aqui */}
        </div>
      </td>
    </tr>
  );

  return <Table headers={headers} data={contas} renderRow={renderRow} />;
}
