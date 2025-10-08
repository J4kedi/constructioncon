import { getPublicPrismaClient, getTenantPrismaClient } from '@/app/lib/prisma';
import type { User } from "@prisma/client";

export async function getAllTenants() {
  const prisma = getPublicPrismaClient();
  try {
    const tenants = await prisma.tenant.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return tenants;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch all tenants.');
  }
}

export async function findCompany(subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  const company = await tenantPrisma.company.findFirst();
  if (!company) {
    throw new Error(`Registro da empresa não encontrado no schema do tenant: ${subdomain}. O script 'seed-tenant' foi executado?`);
  }
  return company;
}

export async function getAllUsersAcrossTenants(): Promise<(User & { companyName: string })[]> {
  const tenants = await getAllTenants();
  const allUsers: (User & { companyName: string })[] = [];

  for (const tenant of tenants) {
    try {
      const tenantPrisma = getTenantPrismaClient(tenant.subdomain);
      const users = await tenantPrisma.user.findMany({
        include: {
          company: true,
        },
      });
      const usersWithCompanyName = users.map(user => ({ ...user, companyName: tenant.name }));
      allUsers.push(...usersWithCompanyName);
    } catch (error) {
      console.error(`Failed to fetch users for tenant ${tenant.subdomain}:`, error);
    }
  }
  return allUsers;
}
