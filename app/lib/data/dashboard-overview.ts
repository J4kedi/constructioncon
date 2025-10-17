import { getTenantPrismaClient } from '../prisma';
import { unstable_cache as cache } from 'next/cache';
import { PrismaClient } from '@prisma/client';

// --- Higher-Order Function for Tenant Prisma Client ---

function withTenantPrisma<T>(fetcher: (prisma: PrismaClient, subdomain: string) => Promise<T>) {
  return async (subdomain: string): Promise<T> => {
    const tenantPrisma = getTenantPrismaClient(subdomain);
    return fetcher(tenantPrisma, subdomain);
  };
}

// --- Utility for Schema Name ---

const getSchemaName = (subdomain: string) => `tenant_${subdomain.replace(/-/g, '-')}`;

// --- Data Fetching Functions ---

const _fetchUpcomingDeadlines = withTenantPrisma(async (tenantPrisma) => {
  const umaSemanaAtras = new Date();
  umaSemanaAtras.setDate(umaSemanaAtras.getDate() + 7);

  const deadlines = await tenantPrisma.obra.findMany({
    where: {
      dataPrevistaFim: { lte: umaSemanaAtras },
      status: { notIn: ['CONCLUIDA', 'CANCELADA'] },
    },
    orderBy: { dataPrevistaFim: 'asc' },
    take: 5,
    select: { id: true, nome: true, dataPrevistaFim: true },
  });

  return deadlines.map(obra => ({ ...obra, dataPrevistaFim: obra.dataPrevistaFim.toISOString() }));
});

const _fetchBudgetOverruns = withTenantPrisma(async (tenantPrisma, subdomain) => {
  const schemaName = getSchemaName(subdomain);

  const overruns = await tenantPrisma.$queryRawUnsafe<{
    id: string;
    nome: string;
    overrun: number;
  }[]>(`
    SELECT 
      id, 
      nome, 
      ("currentCost" - "orcamentoTotal") as overrun
    FROM "${schemaName}"."Obra"
    WHERE "currentCost" > "orcamentoTotal"
    AND status NOT IN ('CONCLUIDA', 'CANCELADA')
    ORDER BY overrun DESC
    LIMIT 5;
  `);

  return overruns;
});

const _fetchLowStockItems = withTenantPrisma(async (tenantPrisma, subdomain) => {
  const schemaName = getSchemaName(subdomain);

  const lowStockItems = await tenantPrisma.$queryRawUnsafe<{
    id: string;
    nome: string;
    unidade: string;
    currentStock: number;
    nivelMinimo: number;
  }[]>(`
    WITH "StockSummary" AS (
      SELECT
        "catalogoItemId",
        SUM(quantidade) as "currentStock"
      FROM "${schemaName}"."EstoqueMovimento"
      GROUP BY "catalogoItemId"
    )
    SELECT 
      ci.id,
      ci.nome,
      ci.unidade,
      ss."currentStock",
      ci."nivelMinimo"
    FROM "${schemaName}"."CatalogoItem" ci
    JOIN "StockSummary" ss ON ci.id = ss."catalogoItemId"
    WHERE ss."currentStock" < ci."nivelMinimo"
    ORDER BY (ci."nivelMinimo" - ss."currentStock") DESC
    LIMIT 5;
  `);

  return lowStockItems;
});

const _fetchRecentActivity = withTenantPrisma(async (tenantPrisma) => {
  const recentObras = await tenantPrisma.obra.findMany({
    orderBy: { updatedAt: 'desc' },
    take: 10,
    select: { id: true, nome: true, status: true, updatedAt: true },
  });

  return recentObras.map(obra => ({
    id: obra.id,
    description: `Obra "${obra.nome}" atualizada para ${obra.status.replace('_', ' ').toLowerCase()}.`,
    timestamp: obra.updatedAt.toISOString(),
  }));
});

const _fetchProjectPerformance = withTenantPrisma(async (tenantPrisma) => {
  const obras = await tenantPrisma.obra.findMany({
    where: { status: { notIn: ['CONCLUIDA', 'CANCELADA'] } },
  });
  console.log('OBRAS:', obras);

  const performanceData = obras.map(obra => {
    console.log(`\n--- Calculando performance para: ${obra.nome} ---`);
    const earnedValue = obra.progressPercentage * obra.orcamentoTotal.toNumber();
    const actualCost = obra.currentCost.toNumber();

    const totalDuration = obra.dataPrevistaFim.getTime() - obra.dataInicio.getTime();
    const elapsedDuration = new Date().getTime() - obra.dataInicio.getTime();
    const plannedProgress = totalDuration > 0 ? Math.min(1, elapsedDuration / totalDuration) : 0;
    const plannedValue = plannedProgress * obra.orcamentoTotal.toNumber();

    const cpi = actualCost > 0 ? earnedValue / actualCost : 1;
    const spi = plannedValue > 0 ? earnedValue / plannedValue : 1;

    console.log({ earnedValue, actualCost, plannedValue, cpi, spi });

    const performanceItem = {
      id: obra.id,
      nome: obra.nome,
      cpi,
      spi,
      combinedScore: (cpi + spi) / 2,
    };
    console.log('PERFORMANCE ITEM:', performanceItem);
    return performanceItem;
  });

  performanceData.sort((a, b) => b.combinedScore - a.combinedScore);

  const bestPerformers = performanceData.slice(0, 5);
  const worstPerformers = performanceData.slice(-5).reverse();

  return { bestPerformers, worstPerformers };
});


// --- Funções Exportadas e Cacheadas ---

export const fetchUpcomingDeadlines = cache(_fetchUpcomingDeadlines, ['dashboard-deadlines'], { tags: ['dashboard-overview'] });
export const fetchBudgetOverruns = cache(_fetchBudgetOverruns, ['dashboard-overruns'], { tags: ['dashboard-overview'] });
export const fetchLowStockItems = cache(_fetchLowStockItems, ['dashboard-low-stock'], { tags: ['dashboard-overview'] });
export const fetchRecentActivity = cache(_fetchRecentActivity, ['dashboard-feed'], { tags: ['dashboard-overview'] });
export const fetchProjectPerformance = cache(_fetchProjectPerformance, ['project-performance'], { tags: ['dashboard-overview'] });
