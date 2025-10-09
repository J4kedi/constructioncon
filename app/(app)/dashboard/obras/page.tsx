import { Suspense } from 'react';
import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { ObrasTableSkeleton } from '@/app/ui/components/skeletons';
import CreateObraButton from '@/app/ui/dashboard/obras/CreateObraButton';
import { UserRole } from '@prisma/client';
import Search from '@/app/ui/components/search';
import ObrasTable from '@/app/ui/dashboard/obras/ObrasTable';
import Pagination from '@/app/ui/dashboard/pagination';
import { ObraFetcher } from '@/app/lib/data/ObraFetcher';
import { formatObraForUI } from '@/app/lib/utils';

export const dynamic = 'force-dynamic';

export default async function ObrasPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');

  if (!subdomain) {
    return <p className="text-red-500">Subdomínio não identificado.</p>;
  }

  const obraFetcher = new ObraFetcher(subdomain);
  const { data: obras, totalPages } = await obraFetcher.fetchPageData(
    resolvedSearchParams,
  );

  const formattedObras = obras.map(formatObraForUI);

  const prisma = getTenantPrismaClient(subdomain);
  const customers = await prisma.user.findMany({
    where: { role: UserRole.END_CUSTOMER },
    orderBy: { name: 'asc' },
  });

  const query = (resolvedSearchParams?.query as string) || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

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
