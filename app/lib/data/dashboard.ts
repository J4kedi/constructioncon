import { getTenantPrismaClient } from '@/app/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { unstable_cache as cache } from 'next/cache';

async function _fetchDashboardData(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);

  const [faturamentoData, custosData, activeObrasCount, usersCount, saidasData] = await tenantPrisma.$transaction([
    // 1. Faturamento
    tenantPrisma.obra.aggregate({
      _sum: { orcamentoTotal: true },
      where: { status: { not: 'CANCELADA' } },
    }),
    // 2. Custos Totais
    tenantPrisma.contaPagar.aggregate({
      _sum: { valor: true },
    }),
    // 3. Obras Ativas
    tenantPrisma.obra.count({
      where: { status: 'EM_ANDAMENTO' },
    }),
    // 4. Contagem de Usuários
    tenantPrisma.user.count(),
    // 5. Custo de Materiais (Saídas de Estoque)
    tenantPrisma.estoqueMovimento.findMany({
        where: { tipo: 'SAIDA' },
        include: { catalogoItem: { select: { custoUnitario: true } } },
    }),
  ]);

  const faturamento = faturamentoData._sum.orcamentoTotal ?? new Decimal(0);
  const custosTotais = custosData._sum.valor ?? new Decimal(0);
  const lucroBruto = faturamento.sub(custosTotais);

  const custoMateriais = saidasData.reduce((acc, saida) => {
    const custoMovimento = saida.catalogoItem.custoUnitario.mul(saida.quantidade);
    return acc.add(custoMovimento);
  }, new Decimal(0));

  return {
    faturamento: faturamento.toNumber(),
    custosTotais: custosTotais.toNumber(),
    lucroBruto: lucroBruto.toNumber(),
    activeObrasCount,
    usersCount,
    custoMateriais: custoMateriais.toNumber(),
  };
}

export const fetchDashboardData = cache(
    _fetchDashboardData,
    ['dashboard-data'],
    { tags: ['dashboard-data'] }
);