import { headers } from 'next/headers';
import { fetchBudgetOverruns } from '@/app/lib/data/dashboard-overview';
import BudgetOverruns from '@/app/ui/dashboard/(overview)/BudgetOverruns';
import { Suspense } from 'react';
import { OverviewCardSkeleton } from '@/app/ui/components/skeletons';

async function Overruns() {
	const headerList = await headers();
	const subdomain = headerList.get('x-tenant-subdomain');

	if (!subdomain) {
		return null;
	}

	const overruns = await fetchBudgetOverruns(subdomain);

	return (
		<div className="bg-background border border-secondary/20 rounded-lg p-6">
			<h2 className="text-xl font-bold text-text mb-4">
				Obras Acima do Orçamento
			</h2>
			<BudgetOverruns overruns={overruns} />
		</div>
	);
}

export default async function OverrunsPage() {
	return (
		<Suspense fallback={<OverviewCardSkeleton />}>
			<Overruns />
		</Suspense>
	);
}
