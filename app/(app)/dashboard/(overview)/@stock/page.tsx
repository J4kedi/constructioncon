import { headers } from 'next/headers';
import { fetchLowStockItems } from '@/app/lib/data/dashboard-overview';
import LowStockList from '@/app/ui/dashboard/estoque/LowStockList';
import { Suspense } from 'react';
import { OverviewCardSkeleton } from '@/app/ui/components/skeletons';

async function Stock() {
	const headerList = await headers();
	const subdomain = headerList.get('x-tenant-subdomain');

	if (!subdomain) {
		return null;
	}

	const items = await fetchLowStockItems(subdomain);

	return (
		<div className="bg-background border border-secondary/20 rounded-lg p-6">
			<LowStockList items={items} />
		</div>
	);
}

export default async function StockPage() {
	return (
		<Suspense fallback={<OverviewCardSkeleton />}>
			<Stock />
		</Suspense>
	);
}
