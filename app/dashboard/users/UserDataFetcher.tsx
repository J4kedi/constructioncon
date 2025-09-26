import { headers } from 'next/headers';
import UsersPageContent from '@/app/dashboard/users/UsersPageContent';
import { auth } from '@/app/actions/auth';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { UserFetcher } from '@/app/lib/data/UserFetcher';

type UserDataFetcherProps = {
  searchParams: { [key: string]: string | undefined };
};

export default async function UserDataFetcher({ searchParams }: UserDataFetcherProps) {
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');
  const session = await auth();
  const currentUserRole = session?.user?.role;

  if (!subdomain) {
    return <p className="text-red-500">Erro: Tenant não pôde ser identificado.</p>;
  }

  const prisma = getTenantPrismaClient(subdomain);
  const userFetcher = new UserFetcher(prisma);
  const { data: users, totalPages } = await userFetcher.fetchPageData(searchParams);

  return (
    <UsersPageContent 
      initialUsers={users} 
      totalPages={totalPages} 
      currentUserRole={currentUserRole}
    />
  );
}
