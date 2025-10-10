import { headers } from 'next/headers';
import { fetchUpcomingDeadlines } from '@/app/lib/data/dashboard-overview';
import UpcomingDeadlines from '@/app/ui/dashboard/(overview)/UpcomingDeadlines';
import { Suspense } from 'react';
import { OverviewCardSkeleton } from '@/app/ui/components/skeletons';

async function Deadlines() {
	const headerList = await headers();
	const subdomain = headerList.get('x-tenant-subdomain');

	if (!subdomain) {
		return null;
	}

	const deadlines = await fetchUpcomingDeadlines(subdomain);

	return (
		<div className="bg-background border border-secondary/20 rounded-lg p-6">
			<h2 className="text-xl font-bold text-text mb-4">Prazos Apertados</h2>
			<UpcomingDeadlines deadlines={deadlines} />
		</div>
	);
}
export default async function DeadlinesPage() {
	return (
		<Suspense fallback={<OverviewCardSkeleton />}>
			<Deadlines />
		</Suspense>
	);
}
