import { Suspense } from 'react';
import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { ObrasTableSkeleton } from '@/app/ui/components/skeletons';
import CreateObraButton from '@/app/ui/dashboard/obras/CreateObraButton';
import { UserRole } from '@prisma/client';
import Search from '@/app/ui/components/search';
import ObrasDataFetcher from './ObrasDataFetcher';

export default async function ObrasPage({
  searchParams 
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');
  let customers = [];
  if (subdomain) {
    const prisma = getTenantPrismaClient(subdomain);
    customers = await prisma.user.findMany({
      where: { role: UserRole.END_CUSTOMER },
      orderBy: { name: 'asc' },
    });
  }

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

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
        <ObrasDataFetcher searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
