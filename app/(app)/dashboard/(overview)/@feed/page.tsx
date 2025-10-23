import { Suspense } from 'react';
import { getRequestContext } from '@/app/lib/server-utils';
import { fetchRecentTransactions } from '@/app/lib/data/financeiro';
import ActivityFeed from '@/app/ui/dashboard/financeiro/ActivityFeed';
import { TransactionsTableSkeleton } from '@/app/ui/components/skeletons';

export default async function FeedPage() {
    const { subdomain } = await getRequestContext();

    if (!subdomain) {
        return null;
    }

    const recentTransactions = await fetchRecentTransactions(subdomain);

    return (
        <Suspense fallback={<TransactionsTableSkeleton />}>
            <div className="bg-background border border-secondary/20 rounded-lg p-6">
                <h2 className="text-xl font-bold text-text mb-4">Atividade Recente</h2>
                <ActivityFeed transactions={recentTransactions} />
            </div>
        </Suspense>
    );
}