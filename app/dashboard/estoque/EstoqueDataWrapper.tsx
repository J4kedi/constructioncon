import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { Card } from '@/app/ui/dashboard/cards';
import { Archive, DollarSign, AlertTriangle } from 'lucide-react';
import { Decimal } from '@prisma/client/runtime/library';
import LowStockList from '@/app/ui/dashboard/estoque/LowStockList';
import { CatalogoItem } from '@prisma/client';

// Define um tipo expandido para incluir a quantidade calculada
type CatalogoItemWithQuantity = CatalogoItem & { quantidadeAtual: number };

export default async function EstoqueDataWrapper() {
  const headerList = headers();
  const subdomain = headerList.get('x-tenant-subdomain');

  if (!subdomain) {
    throw new Error('Subdomínio não identificado.');
  }

  const tenantPrisma = getTenantPrismaClient(subdomain);

  // 1. Busca todos os itens do catálogo
  const allItems = await tenantPrisma.catalogoItem.findMany();

  // 2. Agrega as quantidades de todas as movimentações
  const stockQuantities = await tenantPrisma.estoqueMovimento.groupBy({
    by: ['catalogoItemId'],
    _sum: {
      quantidade: true,
    },
  });

  // 3. Combina os dados e calcula os KPIs
  let totalValue = new Decimal(0);
  const lowStockItems: CatalogoItemWithQuantity[] = [];

  const itemsWithStock = allItems.map(item => {
    const stock = stockQuantities.find(sq => sq.catalogoItemId === item.id);
    const quantity = stock?._sum.quantidade ?? new Decimal(0);
    return { ...item, quantidadeAtual: quantity };
  });

  for (const item of itemsWithStock) {
    if (item.quantidadeAtual.gt(0)) {
      const value = item.quantidadeAtual.times(item.custoUnitario);
      totalValue = totalValue.plus(value);
    }
    if (item.quantidadeAtual.lt(item.nivelMinimo)) {
      lowStockItems.push({
        ...item,
        quantidadeAtual: item.quantidadeAtual.toNumber(), // Converte para número para o componente
      });
    }
  }

  const formattedTotalValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalValue.toNumber());

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card 
          title="Valor Total do Estoque"
          value={formattedTotalValue}
          icon={<DollarSign className="h-5 w-5 text-primary" />}
        />
        <Card 
          title="Itens no Catálogo"
          value={allItems.length}
          icon={<Archive className="h-5 w-5 text-primary" />}
        />
        <Card 
          title="Itens com Estoque Baixo"
          value={lowStockItems.length}
          icon={<AlertTriangle className="h-5 w-5 text-primary" />}
        />
      </div>

      {/* Outros Componentes do Dashboard */}
      <div>
        <LowStockList items={lowStockItems} />
      </div>
    </div>
  );
}