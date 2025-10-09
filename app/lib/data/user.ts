import { getTenantPrismaClient } from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
import { UserQueryBuilder } from "./query/UserQueryBuilder";
import type { User, UserRole } from "@prisma/client";
import { getAllTenants } from './tenant';

const ITEMS_PER_PAGE = 8;

export async function fetchFilteredUsers(subdomain: string, query: string, currentPage: number) {
  try {
    const tenantPrisma = getTenantPrismaClient(subdomain);
    const userQueryBuilder = new UserQueryBuilder();
    const queryArgs = userQueryBuilder
      .withSearch(query)
      .withPage(currentPage)
      .build();

    const [users, totalCount] = await tenantPrisma.$transaction([
      tenantPrisma.user.findMany(queryArgs),
      tenantPrisma.user.count({ where: queryArgs.where }),
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return { users, totalPages };

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch filtered users.');
  }
}

export async function getUserByCredentials(email, password, subdomain) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  try {
    const user = await tenantPrisma.user.findUnique({ where: { email } });
    if (!user) {
        console.log(`Login falhou: Utilizador ${email} não encontrado no tenant ${subdomain}`);
        return null;
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (passwordsMatch) return user;

    return null;
  } catch (error) {
    console.error("Database error during credential check:", error);
    throw new Error('Failed to fetch user by credentials.');
  }
}

export async function fetchUsers(subdomain: string, filters: {
    name?: string;
    roles?: UserRole[];
    createdAfter?: Date;
    sortBy?: string;
    page?: number;
}) {
    try {
        const tenantPrisma = getTenantPrismaClient(subdomain);
        const query = new UserQueryBuilder()
            .withName(filters.name)
            .withRoles(filters.roles)
            .createdAfter(filters.createdAfter)
            .sortBy(filters.sortBy)
            .withPage(filters.page)
            .build();

        const users = await tenantPrisma.user.findMany(query);
        return users;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch users.');
    }
}

export async function fetchPageUsers(subdomain: string) {
    const users = await fetchUsers(subdomain, {
        roles: ['USER', 'END_CUSTOMER']
    });
    return users;
}

export async function fetchUsersTotalPages(subdomain: string, query: string) {
    try {
        const tenantPrisma = getTenantPrismaClient(subdomain);
        const whereClause = new UserQueryBuilder()
            .withSearch(query)
            .buildWhere();

        const count = await tenantPrisma.user.count({ where: whereClause });
        const totalPages = Math.ceil(count / 8);
        return totalPages;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch total number of users.');
    }
}

export async function fetchUserById(subdomain: string, id: string) {
  try {
    const tenantPrisma = getTenantPrismaClient(subdomain);
    const user = await tenantPrisma.user.findUnique({
      where: { id },
    });
    return user;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

async function fetchUsersFromTenant(tenant, query) {
  try {
    const tenantPrisma = getTenantPrismaClient(tenant.subdomain);
    const where = query ? {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } },
      ],
    } : {};

    const users = await tenantPrisma.user.findMany({ where });
    return users.map(u => ({ ...u, companyName: tenant.name }));
  } catch (error) {
    console.error(`Failed to fetch users for tenant ${tenant.subdomain}:`, error);
    return [];
  }
}

export async function fetchFilteredGlobalUsers(query: string, currentPage: number) {
  const tenants = await getAllTenants();
  let allUsers: (User & { companyName: string })[] = [];

  for (const tenant of tenants) {
    const users = await fetchUsersFromTenant(tenant, query);
    allUsers.push(...users);
  }

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  return allUsers.slice(offset, offset + ITEMS_PER_PAGE);
}

export async function fetchGlobalUsersTotalPages(query: string) {
  const tenants = await getAllTenants();
  let totalCount = 0;

  for (const tenant of tenants) {
    try {
      const tenantPrisma = getTenantPrismaClient(tenant.subdomain);
      const where = query ? {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      } : {};
      const count = await tenantPrisma.user.count({ where });
      totalCount += count;
    } catch (error) {
      console.error(`Failed to count users for tenant ${tenant.subdomain}:`, error);
    }
  }

  return Math.ceil(totalCount / ITEMS_PER_PAGE);
}
