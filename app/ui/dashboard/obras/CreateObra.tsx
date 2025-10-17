import { getTenantPrismaClient } from '@/app/lib/prisma';
import { headers } from 'next/headers';
import { UserRole } from '@prisma/client';
import CreateObraButton from './CreateObraButton';
import { Button } from '@/app/ui/components/Button';

export default async function CreateObra() {
  const headerList = await headers();
  const subdomain = headerList.get('x-tenant-subdomain');


  const prisma = getTenantPrismaClient(subdomain);
  const customers = await prisma.user.findMany({
    where: { role: UserRole.END_CUSTOMER },
    orderBy: { name: 'asc' },
  });

  return <CreateObraButton customers={customers} />;
}
