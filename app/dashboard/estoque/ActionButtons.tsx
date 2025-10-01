import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import CreateItemButton from '@/app/ui/dashboard/estoque/CreateItemButton';
import CreateEntradaButton from '@/app/ui/dashboard/estoque/CreateEntradaButton';
import CreateSaidaButton from '@/app/ui/dashboard/estoque/CreateSaidaButton';

// Este é um Server Component para buscar os dados necessários para os botões de ação
// e então renderizar os botões (que são Client Components)
export default async function ActionButtons() {
  const headerList = headers();
  const subdomain = headerList.get('x-tenant-subdomain');

  if (!subdomain) {
    return null; // Ou renderizar um estado de erro/desabilitado
  }

  const tenantPrisma = getTenantPrismaClient(subdomain);

  // Busca todos os dados necessários para os formulários de uma só vez
  const [catalogoItensData, suppliers, obrasData] = await Promise.all([
    tenantPrisma.catalogoItem.findMany({ orderBy: { nome: 'asc' } }),
    tenantPrisma.supplier.findMany({ orderBy: { name: 'asc' } }),
    tenantPrisma.obra.findMany({ orderBy: { nome: 'asc' } }),
  ]);

  // "Sanitiza" os dados, convertendo tipos complexos (Decimal) em tipos simples (number/string)
  // antes de passá-los para Client Components.
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