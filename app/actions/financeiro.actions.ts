'use server';

import { getRequestContext } from '@/app/lib/server-utils';
import { fetchFinancialHistory } from '@/app/lib/data/financeiro';

export async function getFinancialHistoryAction() {
    const { subdomain } = await getRequestContext();
    return fetchFinancialHistory(subdomain!);
}