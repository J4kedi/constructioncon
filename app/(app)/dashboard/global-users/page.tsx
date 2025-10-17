import { Suspense } from 'react';
import { InvoiceSkeleton } from '@/app/ui/components/skeletons';
import GlobalUserDataFetcher from './GlobalUserDataFetcher';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  return (
    <Suspense key={query + currentPage} fallback={<InvoiceSkeleton />}>
      <GlobalUserDataFetcher searchParams={searchParams} />
    </Suspense>
  );
}