'use client';

import Table from '@/app/ui/components/Table';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import { StatusBadge } from '@/app/ui/components/BadgeFactory';

type Transaction = {
  id: string;
  descricao: string;
  valor: any;
  categoria: string;
  data: Date;
  tipo: 'RECEITA' | 'DESPESA';
  obra?: { nome: string } | null;
};

interface RecentTransactionsTableProps {
  transactions: Transaction[];
}

export default function RecentTransactionsTable({ transactions }: RecentTransactionsTableProps) {
  const headers = ['Descrição', 'Valor', 'Tipo', 'Categoria', 'Obra', 'Data'];

  const renderRow = (transaction: Transaction) => (
    <tr key={transaction.id} className="w-full border-b border-secondary/20 text-sm">
      <td className="whitespace-nowrap py-3 pl-6 pr-3 font-medium">
        {transaction.descricao}
      </td>
      <td className={`whitespace-nowrap px-3 py-3 ${transaction.tipo === 'RECEITA' ? 'text-success' : 'text-destructive'}`}>
        {formatCurrency(transaction.valor)}
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <StatusBadge type="transactionType" value={transaction.tipo} />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {transaction.categoria}
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {transaction.obra?.nome || 'N/A'}
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {formatDate(transaction.data.toISOString())}
      </td>
    </tr>
  );

  if (transactions.length === 0) {
    return <p className="text-center text-text/70 mt-4">Nenhuma transação recente.</p>;
  }

  return <Table headers={headers} data={transactions} renderRow={renderRow} />;
}
