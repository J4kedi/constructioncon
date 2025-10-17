import { getTenantPrismaClient } from '@/app/lib/prisma';
import { Decimal } from '@prisma/client/runtime/library';
import { formatObraForUI } from '@/app/lib/utils.ts';



export async function fetchEstoquePageData(subdomain: string | null) {
  if (!subdomain) {
    return { catalogoItens: [], suppliers: [], obras: [] };
  }

  const tenantPrisma = getTenantPrismaClient(subdomain);
  const [catalogoItensData, suppliersData, obrasData] = await Promise.all([
    tenantPrisma.catalogoItem.findMany({ orderBy: { nome: 'asc' } }),
    tenantPrisma.supplier.findMany({ orderBy: { name: 'asc' } }),
    tenantPrisma.obra.findMany({ orderBy: { nome: 'asc' } }),
  ]);

  const catalogoItens = catalogoItensData.map(item => ({ ...item, custoUnitario: item.custoUnitario.toNumber(), nivelMinimo: item.nivelMinimo.toNumber() }));
  const suppliers = suppliersData;
  const obras = obrasData.map(formatObraForUI);

  return { catalogoItens, suppliers, obras };
}