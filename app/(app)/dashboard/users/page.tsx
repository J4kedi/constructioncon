import { Suspense } from 'react';
import { headers } from 'next/headers';
import { UsersTableSkeleton } from '@/app/ui/components/skeletons';
import Search from '@/app/ui/components/search';
import UsersTable from '@/app/ui/dashboard/users/table';
import Pagination from '@/app/ui/dashboard/pagination';
import { auth } from '@/app/actions/auth';
import CreateUserButton from '@/app/ui/dashboard/users/CreateUserButton';
import { UserFetcher } from '@/app/lib/data/UserFetcher';
import PageHeader from '@/app/ui/components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');

  const userFetcher = new UserFetcher(subdomain, { includeCompany: false });
  const { data: users, totalPages } = await userFetcher.fetchPageData(resolvedSearchParams ?? {});

  const session = await auth();
  const currentUserRole = session?.user?.role;

  return (
    <div className="w-full">
      <PageHeader 
        title="Usuários"
        actionButtons={<CreateUserButton />}
        searchPlaceholder="Buscar usuários..."
      />

      <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
        <UsersTable users={users} currentUserRole={currentUserRole} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}