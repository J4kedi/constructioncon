import { Suspense } from 'react';
import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { ObrasTableSkeleton } from '@/app/ui/components/skeletons';
import CreateObraButton from '@/app/ui/dashboard/obras/CreateObraButton';
import { UserRole } from '@prisma/client';
import Search from '@/app/ui/components/search';
import { fetchFilteredObras } from '@/app/lib/data/obra';
import ObrasTable from '@/app/ui/dashboard/obras/ObrasTable';
import Pagination from '@/app/ui/dashboard/pagination';
import { PlainObra } from '@/app/lib/definitions'; // Importação corrigida

export const dynamic = 'force-dynamic';

export default async function ObrasPage({
  searchParams 
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');
  
  if (!subdomain) {
    return <p className="text-red-500">Subdomínio não identificado.</p>;
  }

  const { obras, totalPages } = await fetchFilteredObras(subdomain, query, currentPage);

  const formattedObras: PlainObra[] = obras.map(obra => ({
    ...obra,
    orcamentoTotal: obra.orcamentoTotal.toNumber(),
    currentCost: obra.currentCost.toNumber(),
    dataInicio: new Date(obra.dataInicio).toLocaleDateString('pt-BR'),
  }));

  const prisma = getTenantPrismaClient(subdomain);
  const customers = await prisma.user.findMany({
    where: { role: UserRole.END_CUSTOMER },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Minhas Obras</h1>
        <CreateObraButton customers={customers} />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar obras..." />
      </div>

      <Suspense key={query + currentPage} fallback={<ObrasTableSkeleton />}>
        <ObrasTable obras={formattedObras} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
