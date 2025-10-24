import { Suspense } from 'react';
import ContasAReceberTable from '@/app/ui/dashboard/financeiro/contas-a-receber/Table';
import ContasAReceberClientPage from './client-page';
import TableSkeleton from '@/app/ui/components/skeletons';
import { fetchContasAReceber } from '@/app/lib/data/financeiro';
import { fetchAllObrasSimple } from '@/app/lib/data/obra';
import { getRequestContext } from '@/app/lib/server-utils';

export default async function ContasAReceberPage() {
  const { subdomain } = await getRequestContext();
  const [rawContas, obras] = await Promise.all([
    fetchContasAReceber(subdomain!),
    fetchAllObrasSimple(subdomain!),
  ]);

  const contas = rawContas;

  return (
    <ContasAReceberClientPage
      obras={obras}
      table={
        <Suspense fallback={<TableSkeleton />}>
          <ContasAReceberTable data={contas} />
        </Suspense>
      }
    />
  );
}
