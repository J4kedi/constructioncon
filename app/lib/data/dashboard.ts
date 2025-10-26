import { getTenantPrismaClient } from '@/app/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { unstable_cache as cache } from 'next/cache';

async function _fetchDashboardData(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);

  const [faturamentoData, custosData, activeObrasCount, usersCount, saidasData, contasPagarVencidas, contasReceberVencidas] = await tenantPrisma.$transaction([
    tenantPrisma.obra.aggregate({
      _sum: { orcamentoTotal: true },
      where: { status: { not: 'CANCELADA' } },
    }),
    tenantPrisma.contaPagar.aggregate({
      _sum: { valor: true },
    }),
    tenantPrisma.obra.count({
      where: { status: 'EM_ANDAMENTO' },
    }),
    tenantPrisma.user.count(),
    tenantPrisma.estoqueMovimento.findMany({
        where: { tipo: 'SAIDA' },
        include: { catalogoItem: { select: { custoUnitario: true } } },
    }),
    tenantPrisma.contaPagar.aggregate({
      where: { status: 'VENCIDO' },
      _sum: { valor: true },
      _count: { id: true },
    }),
    tenantPrisma.contaReceber.aggregate({
      where: { status: 'VENCIDO' },
      _sum: { valor: true },
      _count: { id: true },
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
    contasPagarVencidasValor: contasPagarVencidas._sum.valor?.toNumber() || 0,
    contasPagarVencidasCount: contasPagarVencidas._count.id || 0,
    contasReceberVencidasValor: contasReceberVencidas._sum.valor?.toNumber() || 0,
    contasReceberVencidasCount: contasReceberVencidas._count.id || 0,
  };
}

export const fetchDashboardData = cache(
    _fetchDashboardData,
    ['dashboard-data'],
    { tags: ['dashboard-data'] }
);

export async function fetchObrasEmAndamentoCount(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  return await tenantPrisma.obra.count({
    where: { status: 'EM_ANDAMENTO' },
  });
}

export async function fetchContasProximasDoVencimentoCount(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  const today = new Date();
  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(today.getDate() + 7);

  const count = await tenantPrisma.contaPagar.count({
    where: {
      status: 'A_PAGAR',
      dataVencimento: {
        gte: today,
        lte: sevenDaysFromNow,
      },
    },
  });

  return count;
}