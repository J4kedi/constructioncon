import { getTenantPrismaClient } from '../prisma';
import { Decimal } from '@prisma/client/runtime/library';

export async function fetchUpcomingDeadlines(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
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
}

export async function fetchBudgetOverruns(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  const allActiveObras = await tenantPrisma.obra.findMany({
    where: { status: { notIn: ['CONCLUIDA', 'CANCELADA'] } },
    select: { id: true, nome: true, orcamentoTotal: true, currentCost: true }
  });

  return allActiveObras.filter(obra => 
    obra.currentCost.gt(obra.orcamentoTotal)
  ).map(obra => ({
    id: obra.id,
    nome: obra.nome,
    overrun: obra.currentCost.sub(obra.orcamentoTotal).toNumber(),
  })).sort((a, b) => b.overrun - a.overrun).slice(0, 5);
}

export async function fetchLowStockItems(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  const stockLevels = await tenantPrisma.estoqueMovimento.groupBy({
    by: ['catalogoItemId'],
    _sum: { quantidade: true },
  });

  const items = await tenantPrisma.catalogoItem.findMany({
    where: { id: { in: stockLevels.map(s => s.catalogoItemId) } },
    select: { id: true, nivelMinimo: true, nome: true, unidade: true },
  });

  const itemMap = new Map(items.map(i => [i.id, i]));

  return stockLevels.map(level => {
    const item = itemMap.get(level.catalogoItemId)!;
    const currentStock = level._sum.quantidade ?? new Decimal(0);
    return { ...item, currentStock };
  }).filter(item => 
    item.currentStock.lt(item.nivelMinimo)
  ).map(item => ({
    id: item.id,
    nome: item.nome,
    unidade: item.unidade,
    nivelMinimo: item.nivelMinimo.toNumber(),
    currentStock: item.currentStock.toNumber(),
  })).slice(0, 5);
}

export async function fetchRecentActivity(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
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
}

export async function fetchDashboardOverview(subdomain: string) {
  const [deadlines, overruns, lowStock, feed] = await Promise.all([
    fetchUpcomingDeadlines(subdomain),
    fetchBudgetOverruns(subdomain),
    fetchLowStockItems(subdomain),
    fetchRecentActivity(subdomain),
  ]);

  return { deadlines, overruns, lowStock, feed };
}
