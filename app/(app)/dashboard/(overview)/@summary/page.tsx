import { headers } from 'next/headers';
import { fetchDashboardData } from '@/app/lib/data/dashboard';
import { Suspense } from 'react';
import { Card } from '@/app/ui/dashboard/cards';
import { formatCurrency } from '@/app/lib/utils';
import { DollarSign, TrendingUp, Briefcase, Users } from 'lucide-react';
import { CardsSkeleton } from '@/app/ui/components/skeletons';

async function Summary() {
	const headerList = await headers();
	const subdomain = headerList.get('x-tenant-subdomain');

	if (!subdomain) {
		return null;
	}

	const data = await fetchDashboardData(subdomain);

	return (
        <>
            <Card title="Faturamento Total" value={formatCurrency(data.faturamento)} icon={<DollarSign className="h-5 w-5 text-primary" />} />
            <Card title="Lucro Bruto" value={formatCurrency(data.lucroBruto)} icon={<TrendingUp className="h-5 w-5 text-primary" />} />
            <Card title="Obras Ativas" value={data.activeObrasCount} icon={<Briefcase className="h-5 w-5 text-primary" />} />
            <Card title="Usuários" value={data.usersCount} icon={<Users className="h-5 w-5 text-primary" />} />
        </>
    );
}

export default async function SummaryPage() {
	return (
		<Suspense fallback={<CardsSkeleton />}>
			<Summary />
		</Suspense>
	);
}