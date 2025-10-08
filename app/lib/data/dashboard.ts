import { getTenantPrismaClient } from '@/app/lib/prisma';
import { formatCurrency } from "../utils";

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
