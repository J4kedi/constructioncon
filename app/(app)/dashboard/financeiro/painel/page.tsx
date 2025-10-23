import { Suspense } from 'react';
import { getRequestContext } from '@/app/lib/server-utils';
import { fetchAllObrasSimple } from '@/app/lib/data/obra';
import { fetchContasAPagar, fetchContasAReceber, fetchRecentTransactions, fetchFinancialHistory } from '@/app/lib/data/financeiro';
import { fetchObrasEmAndamentoCount, fetchProximaContaPagar } from '@/app/lib/data/dashboard';
import { formatDate } from '@/app/lib/utils';

import PageHeader from '@/app/ui/components/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';
import KeyKPIsCard, { KPI } from '@/app/ui/dashboard/financeiro/KeyKPIsCard';
import FinancialHistoryChart from '@/app/ui/dashboard/financeiro/FinancialHistoryChart';
import ActivityFeed from '@/app/ui/dashboard/financeiro/ActivityFeed';
import CreateContaPagarButton from '@/app/ui/dashboard/financeiro/contas-a-pagar/CreateContaPagarButton';
import CreateContaReceberButton from '@/app/ui/dashboard/financeiro/contas-a-receber/CreateContaReceberButton';
import { CardsSkeleton, ChartSkeleton, TransactionsTableSkeleton } from '@/app/ui/components/skeletons';

export default async function Page() {
  const { subdomain } = await getRequestContext();
  if (!subdomain) return <p>Subdomínio não encontrado.</p>;

  const [obras, recentTransactions, historyData, obrasCount, proximaConta] = await Promise.all([
    fetchAllObrasSimple(subdomain),
    fetchRecentTransactions(subdomain),
    fetchFinancialHistory(subdomain),
    fetchObrasEmAndamentoCount(subdomain),
    fetchProximaContaPagar(subdomain),
  ]);

  const kpis: KPI = {
    obrasEmAndamento: obrasCount,
    tarefasAtrasadas: 5, // Simulado
    proximaConta: proximaConta ? { valor: proximaConta.valor.toNumber(), data: formatDate(proximaConta.dataVencimento, 'dd/MM') } : null,
    saldoAtual: 125340.50, // Simulado
  };

  return (
    <div className="w-full space-y-6">
      <PageHeader 
        title="Painel Financeiro"
        actionButtons={
          <div className="flex gap-2">
            <CreateContaPagarButton obras={obras} />
            <CreateContaReceberButton obras={obras} />
          </div>
        }
      />
      
      <Suspense fallback={<CardsSkeleton />}>
        <KeyKPIsCard kpis={kpis} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-8 space-y-6">
          <Suspense fallback={<ChartSkeleton />}>
            <Card>
              <CardHeader>
                <CardTitle>Histórico Financeiro Mensal</CardTitle>
              </CardHeader>
              <CardContent className="h-[400px]">
                <FinancialHistoryChart data={historyData} />
              </CardContent>
            </Card>
          </Suspense>
        </div>

        {/* Coluna Lateral */}
        <div className="lg:col-span-4">
          <Suspense fallback={<TransactionsTableSkeleton />}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Transações Recentes</CardTitle>
              </CardHeader>
              <CardContent>
                <ActivityFeed transactions={recentTransactions} />
              </CardContent>
            </Card>
          </Suspense>
        </div>
      </div>
    </div>
  );
}