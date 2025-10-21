'use client';

import { formatCurrency, formatDate } from '@/app/lib/utils';
import Table from '@/app/ui/components/Table';

interface CashFlowData {
  date: string;
  entradas: number;
  saidas: number;
  saldoProjetado: number;
}

export function CashFlowTable({ data }: { data: CashFlowData[] }) {
  const headers = ['Data', 'Entradas', 'Saídas', 'Saldo Projetado'];

  const renderRow = (item: CashFlowData) => (
    <tr key={item.date} className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
      <td className="whitespace-nowrap px-3 py-3">{formatDate(item.date)}</td>
      <td className="whitespace-nowrap px-3 py-3 text-green-500">{formatCurrency(item.entradas)}</td>
      <td className="whitespace-nowrap px-3 py-3 text-red-500">{formatCurrency(item.saidas)}</td>
      <td className="whitespace-nowrap px-3 py-3 font-medium">{formatCurrency(item.saldoProjetado)}</td>
    </tr>
  );

  return <Table headers={headers} data={data} renderRow={renderRow} />;
}
