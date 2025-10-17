'use server'

import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import CreateSaidaButton from '@/app/ui/dashboard/estoque/CreateSaidaButton';

import { formatObraForUI } from '@/app/lib/utils';

export default async function CreateSaida({ searchParams }: { searchParams?: any }) {
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');


  const tenantPrisma = getTenantPrismaClient(subdomain);

  const [catalogoItensData, obrasData] = await Promise.all([
    tenantPrisma.catalogoItem.findMany({ orderBy: { nome: 'asc' } }),
    tenantPrisma.obra.findMany({ orderBy: { nome: 'asc' } }),
  ]);

  const catalogoItens = catalogoItensData.map(item => ({
    ...item,
    custoUnitario: item.custoUnitario.toNumber(),
    nivelMinimo: item.nivelMinimo.toNumber(),
  }));

  const obras = obrasData.map(formatObraForUI);

  return <CreateSaidaButton catalogoItens={catalogoItens} obras={obras} />;
}
