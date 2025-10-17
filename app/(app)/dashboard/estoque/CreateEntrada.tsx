'use server'

import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import CreateEntradaButton from '@/app/ui/dashboard/estoque/CreateEntradaButton';

export default async function CreateEntrada({ searchParams }: { searchParams?: any }) {
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');


  const tenantPrisma = getTenantPrismaClient(subdomain);

  const [catalogoItensData, suppliers] = await Promise.all([
    tenantPrisma.catalogoItem.findMany({ orderBy: { nome: 'asc' } }),
    tenantPrisma.supplier.findMany({ orderBy: { name: 'asc' } }),
  ]);

  const catalogoItens = catalogoItensData.map(item => ({
    ...item,
    custoUnitario: item.custoUnitario.toNumber(),
    nivelMinimo: item.nivelMinimo.toNumber(),
  }));

  return <CreateEntradaButton catalogoItens={catalogoItens} suppliers={suppliers} />;
}
