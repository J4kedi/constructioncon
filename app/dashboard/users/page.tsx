import { Suspense } from 'react';
import { UsersTableSkeleton } from '@/app/ui/components/skeletons';
import UserDataFetcher from './UserDataFetcher';

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <Suspense key={query + currentPage} fallback={<UsersTableSkeleton />}>
      <UserDataFetcher query={query} currentPage={currentPage} />
    </Suspense>
  );
}
