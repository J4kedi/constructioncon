import { getTenantPrismaClient } from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
import { UserQueryBuilder } from "./queryBuilder";
import { formatCurrency } from "./utils";
import type { UserRole } from "@prisma/client";

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

export async function fetchDashboardData(subdomain: string) {
  try {
    const tenantPrisma = getTenantPrismaClient(subdomain);

    const obrasCountPromise = tenantPrisma.obra.count();
    const usersCountPromise = tenantPrisma.user.count();
    const budgetPromise = tenantPrisma.obra.aggregate({
      _sum: {
        orcamentoTotal: true,
      },
    });
    const costPromise = tenantPrisma.obra.aggregate({
      _sum: {
        currentCost: true,
      },
    });

    const [
      numberOfObras,
      numberOfUsers,
      budgetData,
      costData
    ] = await Promise.all([
      obrasCountPromise,
      usersCountPromise,
      budgetPromise,
      costPromise,
    ]);

    const totalBudget = formatCurrency(budgetData._sum.orcamentoTotal?.toNumber() ?? 0);
    const totalCost = formatCurrency(costData._sum.currentCost?.toNumber() ?? 0);

    return {
      numberOfObras,
      numberOfUsers,
      totalBudget,
      totalCost,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch dashboard card data.');
  }
}

export async function fetchFilteredUsers(subdomain: string, query: string, currentPage: number) {
    try {
        const tenantPrisma = getTenantPrismaClient(subdomain);
        const queryArgs = new UserQueryBuilder()
            .withSearch(query)
            .withPage(currentPage)
            .build();

        const users = await tenantPrisma.user.findMany(queryArgs);
        return users;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch filtered users.');
    }
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
