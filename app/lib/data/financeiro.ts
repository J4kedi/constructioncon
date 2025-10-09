import { getTenantPrismaClient } from '@/app/lib/prisma.ts';
import { Decimal } from '@prisma/client/runtime/library';

export async function fetchObrasStatus(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  const obrasStatusData = await tenantPrisma.obra.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  return obrasStatusData.map(item => ({ name: item.status, value: item._count.id }));
}

export async function fetchFinancialOverview(subdomain: string) {
    const tenantPrisma = getTenantPrismaClient(subdomain);

    const [faturamentoData, custosObrasData, obrasStatusData] = await Promise.all([
        tenantPrisma.obra.aggregate({
            _sum: { orcamentoTotal: true },
            where: { status: { not: 'CANCELADA' } },
        }),
        tenantPrisma.obra.aggregate({
            _sum: { currentCost: true },
        }),
        fetchObrasStatus(subdomain), // Reutilizando a nova função
    ]);

    const faturamento = faturamentoData._sum.orcamentoTotal ?? new Decimal(0);
    const custosObras = custosObrasData._sum.currentCost ?? new Decimal(0);

    const saidas = await tenantPrisma.estoqueMovimento.findMany({
        where: { tipo: 'SAIDA' },
        include: { catalogoItem: { select: { custoUnitario: true } } },
    });

    const custosEstoque = saidas.reduce((acc, saida) => {
        const custoMovimento = saida.catalogoItem.custoUnitario.mul(saida.quantidade * -1);
        return acc.add(custoMovimento);
    }, new Decimal(0));

    const stockLevels = await tenantPrisma.estoqueMovimento.groupBy({
        by: ['catalogoItemId'],
        _sum: { quantidade: true },
    });

    const itemsInStock = await tenantPrisma.catalogoItem.findMany({
        where: { id: { in: stockLevels.map(s => s.catalogoItemId) } },
        select: { id: true, custoUnitario: true },
    });

    const itemCustoMap = new Map(itemsInStock.map(i => [i.id, i.custoUnitario]));

    const valorEstoque = stockLevels.reduce((acc, level) => {
        const custo = itemCustoMap.get(level.catalogoItemId);
        const quantidade = level._sum.quantidade;
        if (custo && quantidade) {
            return acc.add(custo.mul(quantidade));
        }
        return acc;
    }, new Decimal(0));

    const custosTotais = custosObras.add(custosEstoque);
    const lucroBruto = faturamento.sub(custosTotais);

    return {
        faturamento: faturamento.mul(100).toNumber(),
        custosTotais: custosTotais.mul(100).toNumber(),
        lucroBruto: lucroBruto.mul(100).toNumber(),
        valorEstoque: valorEstoque.mul(100).toNumber(),
        obrasStatus: obrasStatusData,
    };
}

export async function fetchFinancialHistory(subdomain: string) {
    const tenantPrisma = getTenantPrismaClient(subdomain);

    const obras = await tenantPrisma.obra.findMany({
        select: { 
            orcamentoTotal: true, 
            currentCost: true, 
            createdAt: true 
        },
    });

    const saidasEstoque = await tenantPrisma.estoqueMovimento.findMany({
        where: { tipo: 'SAIDA' },
        include: { catalogoItem: { select: { custoUnitario: true } } },
    });

    const monthlyData = new Map<string, { faturamento: Decimal, custos: Decimal }>();

    obras.forEach(obra => {
        if (obra.createdAt) {
            const month = obra.createdAt.toISOString().slice(0, 7); // YYYY-MM
            const monthEntry = monthlyData.get(month) ?? { faturamento: new Decimal(0), custos: new Decimal(0) };
            
            monthEntry.faturamento = monthEntry.faturamento.add(obra.orcamentoTotal ?? 0);
            monthEntry.custos = monthEntry.custos.add(obra.currentCost ?? 0);

            monthlyData.set(month, monthEntry);
        }
    });

    saidasEstoque.forEach(saida => {
        if (saida.createdAt) {
            const month = saida.createdAt.toISOString().slice(0, 7); // YYYY-MM
            const monthEntry = monthlyData.get(month) ?? { faturamento: new Decimal(0), custos: new Decimal(0) };

            const custoMovimento = saida.catalogoItem.custoUnitario.mul(saida.quantidade * -1);
            monthEntry.custos = monthEntry.custos.add(custoMovimento);

            monthlyData.set(month, monthEntry);
        }
    });

    const sortedMonths = Array.from(monthlyData.keys()).sort();

    const formattedData = sortedMonths.map(month => {
        const data = monthlyData.get(month)!;
        const lucro = data.faturamento.sub(data.custos);
        return {
            name: month,
            Faturamento: data.faturamento.mul(100).toNumber(),
            Custos: data.custos.mul(100).toNumber(),
            Lucro: lucro.mul(100).toNumber(),
        };
    });

    return formattedData;
}