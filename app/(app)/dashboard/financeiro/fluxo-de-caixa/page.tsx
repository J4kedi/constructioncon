import { Suspense } from 'react';
import FluxoDeCaixaClientPage from './client-page';
import { fetchCashFlowData } from '@/app/lib/data/financeiro';
import { getRequestContext } from '@/app/lib/server-utils';
import TableSkeleton from '@/app/ui/components/skeletons';

export default async function FluxoDeCaixaPage() {
  const { subdomain } = await getRequestContext();
  const cashFlowData = await fetchCashFlowData(subdomain!);

  return (
    <Suspense fallback={<TableSkeleton />}>
      <FluxoDeCaixaClientPage data={cashFlowData} />
    </Suspense>
  );
}