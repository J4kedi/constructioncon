import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { Card } from '@/app/ui/dashboard/cards';
import { Archive, DollarSign, AlertTriangle } from 'lucide-react';
import { Decimal } from '@prisma/client/runtime/library';
import LowStockList from '@/app/ui/dashboard/estoque/LowStockList';
import { EstoqueFetcher } from '@/app/lib/data/EstoqueFetcher';
import { UnidadeMedida } from '@prisma/client';
import { fetchLowStockItems } from '@/app/lib/data/dashboard-overview';
import EstoqueTable from '@/app/ui/dashboard/estoque/EstoqueTable';

export default async function EstoqueDataWrapper({ query }: { query: string }) {
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');

  
  const estoqueFetcher = new EstoqueFetcher(subdomain!);
  const [{ data: estoqueItems, totalPages }, lowStockItemsData, totalItemsInCatalog] = await Promise.all([
    estoqueFetcher.fetchPageData({ query }),
    fetchLowStockItems(subdomain),
    getTenantPrismaClient(subdomain).catalogoItem.count(),
  ]);

  const totalValue = estoqueItems.reduce((acc, item) => {
    if (item.quantidadeAtual.gt(0)) {
      return acc.plus(item.custoUnitario.times(item.quantidadeAtual));
    }
    return acc;
  }, new Decimal(0));

  const formattedTotalValue = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totalValue.toNumber());

  const lowStockItems = lowStockItemsData.map(item => ({
    id: item.id,
    nome: item.nome,
    unidade: item.unidade as UnidadeMedida,
    nivelMinimo: item.nivelMinimo,
    quantidadeAtual: item.currentStock,
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card 
          title="Valor Total do Estoque"
          value={formattedTotalValue}
          icon={<DollarSign className="h-5 w-5 text-primary" />}
        />
        <Card 
          title="Itens no Catálogo"
          value={totalItemsInCatalog}
          icon={<Archive className="h-5 w-5 text-primary" />}
        />
        <Card 
          title="Itens com Estoque Baixo"
          value={lowStockItems.length}
          icon={<AlertTriangle className="h-5 w-5 text-primary" />}
        />
      </div>

      <div className="mt-6">
        <EstoqueTable items={estoqueItems.map(item => ({...item, custoUnitario: item.custoUnitario.toNumber(), nivelMinimo: item.nivelMinimo.toNumber(), quantidadeAtual: item.quantidadeAtual.toNumber()}))} />
      </div>

      {lowStockItems.length > 0 && (
        <div className="mt-6">
          <LowStockList items={lowStockItems} />
        </div>
      )}
    </div>
  );
}
