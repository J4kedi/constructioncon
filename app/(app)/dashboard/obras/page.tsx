import { Suspense } from 'react';
import { headers } from 'next/headers';
import { ObrasTableSkeleton } from '@/app/ui/components/skeletons';
import Search from '@/app/ui/components/search';
import ObrasTable from '@/app/ui/dashboard/obras/ObrasTable';
import Pagination from '@/app/ui/dashboard/pagination';
import { ObraFetcher } from '@/app/lib/data/ObraFetcher';
import { formatObraForUI } from '@/app/lib/utils';
import CreateObra from '@/app/ui/dashboard/obras/CreateObra';
import PageHeader from '@/app/ui/components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function ObrasPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');


  const obraFetcher = new ObraFetcher(subdomain);
  const { data: obras, totalPages } = await obraFetcher.fetchPageData(
    resolvedSearchParams,
  );

  const formattedObras = obras.map(formatObraForUI);

  const query = (resolvedSearchParams?.query as string) || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  return (
    <div className="w-full">
      <PageHeader 
        title="Minhas Obras"
        searchPlaceholder="Buscar obras..."
        actionButtons={<CreateObra />}
      />

      <Suspense key={query + currentPage} fallback={<ObrasTableSkeleton />}>
        <ObrasTable obras={formattedObras} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
