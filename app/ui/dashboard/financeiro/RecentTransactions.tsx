import { fetchRecentTransactions } from '@/app/lib/data/financeiro';
import { getRequestContext } from '@/app/lib/server-utils';
import RecentTransactionsTable from './RecentTransactionsTable';

export default async function RecentTransactions() {
  const { subdomain } = await getRequestContext();
  const transactions = await fetchRecentTransactions(subdomain!);

  return (
    <div className="bg-background border border-secondary/20 rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-text mb-4">Transações Recentes</h2>
      <RecentTransactionsTable transactions={transactions} />
    </div>
  );
}
