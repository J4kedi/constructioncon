import { getTenantPrismaClient } from '@/app/lib/prisma';
import { formatCurrency } from "../utils";
import { fetchFinancialOverview } from './financeiro';

// Função para os cards do topo do overview (nova)
export async function fetchSummaryData(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);

  const financialData = await fetchFinancialOverview(subdomain);
  const activeObrasCount = await tenantPrisma.obra.count({
    where: { status: 'EM_ANDAMENTO' },
  });

  return {
    faturamento: financialData.faturamento,
    lucroBruto: financialData.lucroBruto,
    activeObrasCount,
  };
}

// Função antiga, pode ser obsoleta
export async function fetchDashboardData(subdomain: string) {
  try {
    const tenantPrisma = getTenantPrismaClient(subdomain);

    const obrasCountPromise = tenantPrisma.obra.count();
    const usersCountPromise = tenantPrisma.user.count();
    const budgetPromise = tenantPrisma.obra.aggregate({
      _sum: {
        orcamentoTotal: true,
      },
    });
    const costPromise = tenantPrisma.obra.aggregate({
      _sum: {
        currentCost: true,
      },
    });

    const [
      numberOfObras,
      numberOfUsers,
      budgetData,
      costData
    ] = await Promise.all([
      obrasCountPromise,
      usersCountPromise,
      budgetPromise,
      costPromise,
    ]);

    const totalBudget = formatCurrency(budgetData._sum.orcamentoTotal?.toNumber() ?? 0);
    const totalCost = formatCurrency(costData._sum.currentCost?.toNumber() ?? 0);

    return {
      numberOfObras,
      numberOfUsers,
      totalBudget,
      totalCost,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dashboard card data.');
  }
}