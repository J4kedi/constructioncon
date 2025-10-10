import { headers } from 'next/headers';
import { fetchObrasStatus } from '@/app/lib/data/financeiro';
import ObrasStatusPieChart from '@/app/ui/dashboard/financeiro/ObrasStatusPieChart';
import { Suspense } from 'react';
import { OverviewPieChartSkeleton } from '@/app/ui/components/skeletons';

async function Status() {
	const headerList = await headers();
	const subdomain = headerList.get('x-tenant-subdomain');

	if (!subdomain) {
		return null;
	}

	const data = await fetchObrasStatus(subdomain);

	return (
		<div className="bg-background border border-secondary/20 rounded-lg p-6">
			<h2 className="text-xl font-bold text-text mb-4">Status das Obras</h2>
			<ObrasStatusPieChart data={data} />
		</div>
	);
}

export default async function StatusPage() {
	return (
		<Suspense fallback={<OverviewPieChartSkeleton />}>
			<Status />
		</Suspense>
	);
}