import { getTenantPrismaClient } from '@/app/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';

export async function fetchObrasStatus(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  const obrasStatusData = await tenantPrisma.obra.groupBy({
    by: ['status'],
    _count: { id: true },
  });
  return obrasStatusData.map(item => ({ name: item.status, value: item._count.id }));
}

export async function fetchFinancialHistory(subdomain: string) {
    const tenantPrisma = getTenantPrismaClient(subdomain);

    const obras = await tenantPrisma.obra.findMany({
        select: { 
            orcamentoTotal: true, 
            currentCost: true, 
            createdAt: true 
        },
        where: { status: { not: 'CANCELADA' } }
    });

    const saidasEstoque = await tenantPrisma.estoqueMovimento.findMany({
        where: { tipo: 'SAIDA' },
        select: { 
            quantidade: true, 
            data: true,
            catalogoItem: { select: { custoUnitario: true } } 
        },
    });

    const monthlyData = new Map<string, { faturamento: Decimal, custos: Decimal }>();

    obras.forEach(obra => {
        const month = obra.createdAt.toISOString().slice(0, 7);
        const monthEntry = monthlyData.get(month) ?? { faturamento: new Decimal(0), custos: new Decimal(0) };
        
        monthEntry.faturamento = monthEntry.faturamento.add(obra.orcamentoTotal ?? 0);
        monthEntry.custos = monthEntry.custos.add(obra.currentCost ?? 0);

        monthlyData.set(month, monthEntry);
    });

    saidasEstoque.forEach(saida => {
        const month = saida.data.toISOString().slice(0, 7);
        const monthEntry = monthlyData.get(month) ?? { faturamento: new Decimal(0), custos: new Decimal(0) };

        const custoMovimento = saida.catalogoItem.custoUnitario.mul(saida.quantidade);
        monthEntry.custos = monthEntry.custos.add(custoMovimento);

        monthlyData.set(month, monthEntry);
    });

    const sortedMonths = Array.from(monthlyData.keys()).sort();

    const formattedData = sortedMonths.map(month => {
        const data = monthlyData.get(month)!;
        const lucro = data.faturamento.sub(data.custos);
        return {
            name: month,
            Faturamento: data.faturamento.toNumber(),
            Custos: data.custos.toNumber(),
            Lucro: lucro.toNumber(),
        };
    });

    return formattedData;
}

export async function fetchRecentTransactions(subdomain: string, limit: number = 10) {
    const tenantPrisma = getTenantPrismaClient(subdomain);

    const despesas = await tenantPrisma.despesa.findMany({
        take: limit,
        orderBy: { data: 'desc' },
        select: {
            id: true,
            descricao: true,
            valor: true,
            categoria: true,
            data: true,
            obra: { select: { nome: true } }
        }
    });

    const receitas = await tenantPrisma.receita.findMany({
        take: limit,
        orderBy: { data: 'desc' },
        select: {
            id: true,
            descricao: true,
            valor: true,
            data: true,
            obra: { select: { nome: true } }
        }
    });

    const transactions = [
        ...despesas.map(d => ({ ...d, valor: d.valor.toNumber(), tipo: 'DESPESA' as const })),
        ...receitas.map(r => ({ ...r, valor: r.valor.toNumber(), tipo: 'RECEITA' as const, categoria: 'N/A' }))
    ];

    return transactions.sort((a, b) => b.data.getTime() - a.data.getTime()).slice(0, limit);
}