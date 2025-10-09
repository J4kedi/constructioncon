import { Suspense } from 'react';
import { headers } from 'next/headers';
import { UsersTableSkeleton } from '@/app/ui/components/skeletons';
import Search from '@/app/ui/components/search';
import { fetchFilteredUsers } from '@/app/lib/data/user';
import UsersTable from '@/app/ui/dashboard/users/table';
import Pagination from '@/app/ui/dashboard/pagination';
import { auth } from '@/app/actions/auth';
import CreateUserButton from '@/app/ui/dashboard/users/CreateUserButton';

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

  if (!subdomain) {
    return <p className="text-red-500">Subdomínio não identificado.</p>;
  }

  const { users, totalPages } = await fetchFilteredUsers(subdomain, query, currentPage);
  const session = await auth();
  const currentUserRole = session?.user?.role;

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Usuários</h1>
        <CreateUserButton />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar usuários..." />
      </div>

      <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
        <UsersTable users={users} currentUserRole={currentUserRole} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}