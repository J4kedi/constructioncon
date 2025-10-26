import { getTenantPrismaClient } from '@/app/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { unstable_noStore as noStore } from 'next/cache';

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

    const despesas = await tenantPrisma.contaPagar.findMany({
        take: limit,
        orderBy: { dataEmissao: 'desc' },
        select: {
            id: true,
            supplier: { select: { name: true } },
            valor: true,
            categoria: true,
            dataEmissao: true,
            obra: { select: { nome: true } }
        }
    });

    const receitas = await tenantPrisma.contaReceber.findMany({
        take: limit,
        orderBy: { dataEmissao: 'desc' },
        select: {
            id: true,
            cliente: true,
            valor: true,
            dataEmissao: true,
            obra: { select: { nome: true } }
        }
    });

    const transactions = [
        ...despesas.map(d => ({ id: d.id, descricao: d.supplier?.name ?? 'Fornecedor não informado', valor: d.valor.toNumber(), data: d.dataEmissao, tipo: 'DESPESA' as const, categoria: d.categoria, obra: d.obra })),
        ...receitas.map(r => ({ id: r.id, descricao: r.cliente, valor: r.valor.toNumber(), data: r.dataEmissao, tipo: 'RECEITA' as const, categoria: 'N/A', obra: r.obra }))
    ];

    return transactions.sort((a, b) => b.data.getTime() - a.data.getTime()).slice(0, limit);
}

export async function fetchContasAPagar(subdomain: string) {
  noStore();
  const prisma = getTenantPrismaClient(subdomain);

  try {
    const contas = await prisma.contaPagar.findMany({
      orderBy: {
        dataVencimento: 'asc',
      },
    });
    return contas;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch contas a pagar.');
  }
}

export async function fetchContasAReceber(subdomain: string) {
  noStore();
  const prisma = getTenantPrismaClient(subdomain);

  try {
    const contas = await prisma.contaReceber.findMany({
      orderBy: {
        dataVencimento: 'asc',
      },
    });
    return contas;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch contas a receber.');
  }
}

export async function fetchCashFlowData(subdomain: string) {
  noStore();
  const prisma = getTenantPrismaClient(subdomain);

  try {
    const contasAPagar = await prisma.contaPagar.findMany({
      where: { status: 'A_PAGAR' },
      select: { dataVencimento: true, valor: true },
    });

    const contasAReceber = await prisma.contaReceber.findMany({
      where: { status: 'A_RECEBER' },
      select: { dataVencimento: true, valor: true },
    });

    console.log('--- DEBUG: Contas Buscadas ---', { contasAPagar, contasAReceber });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const projectionEndDate = new Date(today);
    projectionEndDate.setDate(today.getDate() + 90);

    console.log('--- DEBUG: Período de Projeção ---', { today, projectionEndDate });

    const dailyMovements = new Map<string, { entradas: Decimal; saidas: Decimal }>();

    contasAReceber.forEach(c => {
      if (c.dataVencimento >= today && c.dataVencimento <= projectionEndDate) {
        const dateStr = c.dataVencimento.toISOString().split('T')[0];
        const day = dailyMovements.get(dateStr) ?? { entradas: new Decimal(0), saidas: new Decimal(0) };
        day.entradas = day.entradas.add(c.valor);
        dailyMovements.set(dateStr, day);
      }
    });

    contasAPagar.forEach(c => {
      if (c.dataVencimento >= today && c.dataVencimento <= projectionEndDate) {
        const dateStr = c.dataVencimento.toISOString().split('T')[0];
        const day = dailyMovements.get(dateStr) ?? { entradas: new Decimal(0), saidas: new Decimal(0) };
        day.saidas = day.saidas.add(c.valor);
        dailyMovements.set(dateStr, day);
      }
    });

    console.log('--- DEBUG: Movimentações Diárias Agrupadas ---', Object.fromEntries(dailyMovements));

    const sortedDates = Array.from(dailyMovements.keys()).sort();
    let saldoAcumulado = new Decimal(0);

    const cashFlowProjection = sortedDates.map(dateStr => {
      const day = dailyMovements.get(dateStr)!;
      const saldoDoDia = day.entradas.sub(day.saidas);
      saldoAcumulado = saldoAcumulado.add(saldoDoDia);
      return {
        date: dateStr,
        entradas: day.entradas.toNumber(),
        saidas: day.saidas.toNumber(),
        saldoProjetado: saldoAcumulado.toNumber(),
      };
    });

    return cashFlowProjection;

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch cash flow data.');
  }
}

export async function fetchDocumentos(subdomain: string, query?: string) {
  noStore();
  const prisma = getTenantPrismaClient(subdomain);

  try {
    const documentos = await prisma.document.findMany({
      where: {
        type: {
          in: ['NOTA_FISCAL_SERVICO', 'NOTA_FISCAL_PRODUTO', 'BOLETO'],
        },
        OR: query ? [
          { name: { contains: query, mode: 'insensitive' } },
          { obra: { nome: { contains: query, mode: 'insensitive' } } },
          { contaPagar: { supplier: { name: { contains: query, mode: 'insensitive' } } } },
          { contaReceber: { cliente: { contains: query, mode: 'insensitive' } } },
        ] : undefined,
      },
      include: {
        obra: true,
        contaPagar: {
          include: {
            supplier: true,
          },
        },
        contaReceber: true,
      },
      orderBy: {
        uploadedAt: 'desc',
      },
    });
    return documentos;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch documentos.');
  }
}

export async function fetchSaldoAtual(subdomain: string): Promise<Decimal> {
  const tenantPrisma = getTenantPrismaClient(subdomain);

  const [totalRecebido, totalPago] = await Promise.all([
    tenantPrisma.contaReceber.aggregate({
      _sum: { valor: true },
      where: { status: 'RECEBIDO' },
    }),
    tenantPrisma.contaPagar.aggregate({
      _sum: { valor: true },
      where: { status: 'PAGO' },
    }),
  ]);

  const saldo = new Decimal(totalRecebido._sum.valor || 0).minus(
    new Decimal(totalPago._sum.valor || 0)
  );

  return saldo;
}

export async function fetchTarefasAtrasadasCount(subdomain: string): Promise<number> {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  const today = new Date();

  const count = await tenantPrisma.etapa.count({
    where: {
      dataFimPrevista: { lt: today },
      status: { not: 'CONCLUIDA' },
    },
  });

  return count;
}