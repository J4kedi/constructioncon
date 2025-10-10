import { headers } from 'next/headers';
import { fetchRecentActivity } from '@/app/lib/data/dashboard-overview';
import RecentActivityFeed from '@/app/ui/dashboard/(overview)/RecentActivityFeed';
import { Suspense } from 'react';
import { OverviewCardSkeleton } from '@/app/ui/components/skeletons';

async function Feed() {
	const headerList = await headers();
	const subdomain = headerList.get('x-tenant-subdomain');

	if (!subdomain) {
		return null;
	}

	const activities = await fetchRecentActivity(subdomain);

	return (
		<div className="bg-background border border-secondary/20 rounded-lg p-6">
			<h2 className="text-xl font-bold text-text mb-4">Atividade Recente</h2>
			<RecentActivityFeed activities={activities} />
		</div>
	);
}

export default async function FeedPage() {
	return (
		<Suspense fallback={<OverviewCardSkeleton />}>
			<Feed />
		</Suspense>
	);
}
