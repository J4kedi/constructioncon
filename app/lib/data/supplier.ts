import { getTenantPrismaClient } from '@/app/lib/prisma';

export async function fetchAllSuppliers(subdomain: string) {
  try {
    const tenantPrisma = getTenantPrismaClient(subdomain);
    const suppliers = await tenantPrisma.supplier.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
    return suppliers;
  } catch (error) {
    console.error('Database Error em fetchAllSuppliers:', error);
    return [];
  }
}
