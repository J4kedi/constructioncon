import { Suspense } from 'react';
import { headers } from 'next/headers';
import { fetchFilteredUsers, fetchUsersTotalPages } from '@/app/lib/data';
import { UsersTableSkeleton } from '@/app/ui/components/skeletons';
import UsersPageContent from '@/app/dashboard/users/UsersPageContent';
import { auth } from '@/app/actions/auth';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');
  const session = await auth();
  // const currentUserRole = session?.user?.userRole;

  if (!subdomain) {
    return <p className="text-red-500">Erro: Tenant não pôde ser identificado.</p>;
  }

  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const totalPages = await fetchUsersTotalPages(subdomain, query);
  const users = await fetchFilteredUsers(subdomain, query, currentPage);

  return (
    <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
      <UsersPageContent 
        initialUsers={users} 
        totalPages={totalPages} 
        // currentUserRole={currentUserRole}
      />
    </Suspense>
  );
}
