import { Suspense } from 'react';
import { getRequestContext } from '@/app/lib/server-utils.ts';
import { fetchDashboardData } from '@/app/lib/data/dashboard';
import { getFinancialHistoryAction } from '@/app/actions/financeiro.actions';
import { Card } from '@/app/ui/dashboard/cards';
import FinancialHistoryChart from '@/app/ui/dashboard/financeiro/FinancialHistoryChart';
import { formatCurrency } from '@/app/lib/utils';
import { DollarSign, TrendingDown, TrendingUp, Archive } from 'lucide-react';
import { CardsSkeleton, TransactionsTableSkeleton } from '@/app/ui/components/skeletons';
import AddDespesa from '@/app/ui/dashboard/financeiro/AddDespesa';
import RecentTransactions from '@/app/ui/dashboard/financeiro/RecentTransactions';
import PageHeader from '@/app/ui/components/PageHeader';

async function FinancialCards() {
  const { subdomain } = await getRequestContext();
  const overviewData = await fetchDashboardData(subdomain!);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <Card title="Faturamento Total" value={formatCurrency(overviewData.faturamento)} icon={<DollarSign className="h-5 w-5 text-primary" />} />
      <Card title="Custos Totais" value={formatCurrency(overviewData.custosTotais)} icon={<TrendingDown className="h-5 w-5 text-primary" />} />
      <Card title="Lucro Bruto" value={formatCurrency(overviewData.lucroBruto)} icon={<TrendingUp className="h-5 w-5 text-primary" />} />
      <Card title="Custo de Materiais" value={formatCurrency(overviewData.custoMateriais)} icon={<Archive className="h-5 w-5 text-primary" />} />
    </div>
  );
}

async function FinancialChart() {
  const historyData = await getFinancialHistoryAction();
  return (
    <div className="bg-background border border-secondary/20 rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold text-text mb-4">Histórico Financeiro Mensal</h2>
      <FinancialHistoryChart data={historyData} />
    </div>
  );
}

export default async function Page() {
  return (
    <div className="w-full">
      <PageHeader 
        title="Painel Financeiro"
        searchPlaceholder="Buscar transações..."
        actionButtons={<AddDespesa />}
      />
      
      <Suspense fallback={<CardsSkeleton />}>
        <FinancialCards />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
        <div className="lg:col-span-3">
          <Suspense fallback={<CardsSkeleton />}>
            <FinancialChart />
          </Suspense>
        </div>
      </div>
      
      <div className="lg:col-span-2">
        <Suspense fallback={<TransactionsTableSkeleton />}>
          <RecentTransactions />
        </Suspense>
      </div>
    </div>
  );
}