'use server';

import { getRequestContext } from '@/app/lib/server-utils';
import { fetchFinancialOverview, fetchFinancialHistory } from '@/app/lib/data/financeiro';

export async function getFinancialOverviewAction() {
    const { subdomain } = await getRequestContext();
    if (!subdomain) {
      throw new Error('Subdomínio não identificado.');
    }
    return fetchFinancialOverview(subdomain);
}

export async function getFinancialHistoryAction() {
    const { subdomain } = await getRequestContext();
    if (!subdomain) {
      throw new Error('Subdomínio não identificado.');
    }
    return fetchFinancialHistory(subdomain);
}