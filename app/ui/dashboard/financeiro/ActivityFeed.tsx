'use client';

import { ActivityFeedItem } from './ActivityFeedItem';
import { Button } from '@/app/ui/components/Button';
import Link from 'next/link';
import { formatDateForFeed } from '@/app/lib/utils';

type Transaction = {
  id: string;
  descricao: string;
  valor: number;
  data: Date;
  tipo: 'RECEITA' | 'DESPESA';
};

interface ActivityFeedProps {
  transactions: Transaction[];
}

export default function ActivityFeed({ transactions }: ActivityFeedProps) {
  if (transactions.length === 0) {
    return <p className="text-center text-text/70 mt-4">Nenhuma transação recente.</p>;
  }

  // Group transactions by date
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const dateKey = formatDateForFeed(new Date(transaction.data));
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(transaction);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto">
        {Object.entries(groupedTransactions).map(([date, transactionsOnDate]) => (
          <div key={date} className="mb-4 last:mb-0">
            <h3 className="text-sm font-semibold text-text/80 mb-2 sticky top-0 bg-background/80 backdrop-blur-sm py-1">{date}</h3>
            <ul className="divide-y divide-secondary/20">
              {transactionsOnDate.map((transaction) => (
                <ActivityFeedItem 
                  key={transaction.id}
                  type={transaction.tipo}
                  description={transaction.descricao}
                  value={transaction.valor}
                  date={new Date(transaction.data)}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-4 text-center">
        <Button variant="link" asChild>
          <Link href="/dashboard/financeiro/extrato">Ver todas</Link>
        </Button>
      </div>
    </div>
  );
}
