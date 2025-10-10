import { headers } from 'next/headers';
import { fetchSummaryData } from '@/app/lib/data/dashboard';
import SummaryClient from './SummaryClient';
import { Suspense } from 'react';
import { SummarySkeleton } from '@/app/ui/components/skeletons';

async function Summary() {
	const headerList = await headers();
	const subdomain = (await headerList).get('x-tenant-subdomain');

	if (!subdomain) {
		return null;
	}

	const initialData = await fetchSummaryData(subdomain);

	return <SummaryClient initialData={initialData} />;
}

export default async function SummaryPage() {
	return (
		<Suspense fallback={<SummarySkeleton />}>
			<Summary />
		</Suspense>
	);
}
