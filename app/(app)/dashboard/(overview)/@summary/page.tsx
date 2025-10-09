import { headers } from 'next/headers';
import { fetchSummaryData } from '@/app/lib/data/dashboard';
import SummaryClient from './SummaryClient';

export default async function SummaryPage() {
  const headerList = await headers();
  const subdomain = headerList.get('x-tenant-subdomain');

  if (!subdomain) {
    return null; 
  }

  const initialData = await fetchSummaryData(subdomain);

  return <SummaryClient initialData={initialData} />;
}
