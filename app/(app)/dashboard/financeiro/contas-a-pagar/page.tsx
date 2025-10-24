import { Suspense } from 'react';
import ContasAPagarTable from '@/app/ui/dashboard/financeiro/contas-a-pagar/Table';
import ContasAPagarClientPage from './client-page';
import TableSkeleton from '@/app/ui/components/skeletons';
import { fetchContasAPagar } from '@/app/lib/data/financeiro';
import { fetchAllObrasSimple } from '@/app/lib/data/obra';
import { getRequestContext } from '@/app/lib/server-utils';

import { fetchAllSuppliers } from '@/app/lib/data/supplier';

// ... (código existente)

export default async function ContasAPagarPage() {
  const { subdomain } = await getRequestContext();
  const [rawContas, obras, suppliers] = await Promise.all([
    fetchContasAPagar(subdomain!),
    fetchAllObrasSimple(subdomain!),
    fetchAllSuppliers(subdomain!),
  ]);

  const contas = rawContas;

  return (
    <ContasAPagarClientPage
      obras={obras}
      suppliers={suppliers}
      table={
        <Suspense fallback={<TableSkeleton />}>
          <ContasAPagarTable data={contas} />
        </Suspense>
      }
    />
  );
}
