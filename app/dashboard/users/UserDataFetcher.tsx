import { headers } from 'next/headers';
import { fetchFilteredUsers, fetchUsersTotalPages } from '@/app/lib/data';
import UsersPageContent from '@/app/dashboard/users/UsersPageContent';
import { auth } from '@/app/actions/auth';

type UserDataFetcherProps = {
  query: string;
  currentPage: number;
};

export default async function UserDataFetcher({ query, currentPage }: UserDataFetcherProps) {
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');
  const session = await auth();
  const currentUserRole = session?.user?.role;

  if (!subdomain) {
    return <p className="text-red-500">Erro: Tenant não pôde ser identificado.</p>;
  }

  const totalPages = await fetchUsersTotalPages(subdomain, query);
  const users = await fetchFilteredUsers(subdomain, query, currentPage);

  return (
    <UsersPageContent 
      initialUsers={users} 
      totalPages={totalPages} 
      currentUserRole={currentUserRole}
    />
  );
}
