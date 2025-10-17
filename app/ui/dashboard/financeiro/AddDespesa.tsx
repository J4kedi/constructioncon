import { getTenantPrismaClient } from '@/app/lib/prisma';
import { headers } from 'next/headers';
import AddDespesaButton from './AddDespesaButton';

export default async function AddDespesa() {
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');

  const prisma = getTenantPrismaClient(subdomain);
  const obras = await prisma.obra.findMany({
    select: { id: true, nome: true },
    orderBy: { nome: 'asc' },
  });

  return <AddDespesaButton obras={obras} />;
}
