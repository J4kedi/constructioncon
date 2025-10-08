import { Suspense } from 'react';
import { InvoiceSkeleton } from '@/app/ui/components/skeletons';
import GlobalUserDataFetcher from './GlobalUserDataFetcher';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  return (
    <Suspense key={query + currentPage} fallback={<InvoiceSkeleton />}>
      <GlobalUserDataFetcher searchParams={searchParams} />
    </Suspense>
  );
}