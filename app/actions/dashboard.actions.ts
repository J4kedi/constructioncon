'use server';

import { getRequestContext } from '@/app/lib/server-utils.ts';
import { fetchDashboardOverview } from '@/app/lib/data/dashboard-overview.ts';
import { fetchSummaryData } from '@/app/lib/data/dashboard';

export async function getSummaryDataAction() {
    const { subdomain } = await getRequestContext();
    if (!subdomain) {
        throw new Error('Subdomínio não identificado para a ação de resumo.');
    }
    return fetchSummaryData(subdomain);
}

export async function getDashboardOverviewAction() {
    const { subdomain } = await getRequestContext();
    if (!subdomain) {
      throw new Error('Subdomínio não identificado.');
    }
    return fetchDashboardOverview(subdomain);
}