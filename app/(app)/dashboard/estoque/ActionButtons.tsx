import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import CreateItemButton from '@/app/ui/dashboard/estoque/CreateItemButton';
import CreateEntradaButton from '@/app/ui/dashboard/estoque/CreateEntradaButton';
import CreateSaidaButton from '@/app/ui/dashboard/estoque/CreateSaidaButton';

export default async function ActionButtons() {
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');

  if (!subdomain) {
    return null;
  }

  const tenantPrisma = getTenantPrismaClient(subdomain);

  const [catalogoItensData, suppliers, obrasData] = await Promise.all([
    tenantPrisma.catalogoItem.findMany({ orderBy: { nome: 'asc' } }),
    tenantPrisma.supplier.findMany({ orderBy: { name: 'asc' } }),
    tenantPrisma.obra.findMany({ orderBy: { nome: 'asc' } }),
  ]);

  const catalogoItens = catalogoItensData.map(item => ({
    ...item,
    custoUnitario: item.custoUnitario.toNumber(),
    nivelMinimo: item.nivelMinimo.toNumber(),
  }));

  const obras = obrasData.map(obra => ({
    ...obra,
    orcamentoTotal: obra.orcamentoTotal.toString(),
    currentCost: obra.currentCost.toString(),
  }));

  return (
    <div className="flex items-center gap-4">
      <CreateItemButton />
      <CreateEntradaButton catalogoItens={catalogoItens} suppliers={suppliers} />
      <CreateSaidaButton catalogoItens={catalogoItens} obras={obras} />
    </div>
  );
}