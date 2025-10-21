import { Suspense } from 'react';
import ContasAPagarTable from '@/app/ui/dashboard/financeiro/contas-a-pagar/Table';
import ContasAPagarClientPage from './client-page';
import TableSkeleton from '@/app/ui/components/skeletons';
import { fetchContasAPagar } from '@/app/lib/data/financeiro';
import { fetchAllObrasSimple } from '@/app/lib/data/obra';
import { getRequestContext } from '@/app/lib/server-utils';

export default async function ContasAPagarPage() {
  const { subdomain } = await getRequestContext();
  const [contas, obras] = await Promise.all([
    fetchContasAPagar(subdomain!),
    fetchAllObrasSimple(subdomain!),
  ]);

  return (
    <ContasAPagarClientPage
      obras={obras}
      table={
        <Suspense fallback={<TableSkeleton />}>
          <ContasAPagarTable data={contas} />
        </Suspense>
      }
    />
  );
}
