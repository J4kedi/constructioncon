import { getPublicPrismaClient, getTenantPrismaClient } from '@/app/lib/prisma';
import bcrypt from 'bcrypt';
import { UserQueryBuilder } from "./queryBuilder";
import { formatCurrency } from "./utils";
import type { User, UserRole } from "@prisma/client";
import { FEATURE_UI_MAP } from './feature-map';

const SERVICES = [
  { name: 'BFF', url: 'http://localhost:8080/health' },
  { name: 'Frontend (Marketplace)', url: 'http://localhost:3001/health' },
  { name: 'Serviço de Catálogo', url: 'http://localhost:3002/health' },
  { name: 'Serviço de Pedidos', url: 'http://localhost:3020/health' },
  { name: 'Função de Cotação', url: 'http://localhost:3004/health' },
];

export async function getSystemHealthStatus() {
  const statusPromises = SERVICES.map(async (service) => {
    try {
      const response = await fetch(service.url, { method: 'GET', cache: 'no-store' });
      if (response.ok) {
        return { name: service.name, status: 'Online' as const };
      }
      return { name: service.name, status: 'Offline' as const, error: `Status: ${response.status}` };
    } catch (error: any) {
      console.error(`Health check failed for ${service.name}:`, error.message);
      return { name: service.name, status: 'Offline' as const, error: 'Não foi possível conectar.' };
    }
  });

  const statuses = await Promise.all(statusPromises);
  return statuses;
}

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

export async function fetchNavLinks() {
    const publicPrisma = getPublicPrismaClient();
    
    try {
        const features = await publicPrisma.feature.findMany({
            orderBy: { name: 'asc' }
        });

        const navLinks = features.map(feature => {
            const uiDetails = FEATURE_UI_MAP[feature.key];
            if (!uiDetails) return null;

            return {
                name: feature.name,
                href: uiDetails.href,
                featureKey: feature.key,
            };
        }).filter(Boolean);

        return navLinks;

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch navigation links.');
    }
}

export async function fetchObraById(id: string, subdomain: string) {
    try {
        const tenantPrisma = getTenantPrismaClient(subdomain);
        const obra = await tenantPrisma.obra.findUnique({
            where: { id },
        });

        if (!obra) {
            console.warn(`Obra com id ${id} não encontrada no subdomínio ${subdomain}`);
            return null;
        }

        return obra;
    } catch (error) {
        console.error('Database Error em fetchObraById:', error);
        return null;
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

const ITEMS_PER_PAGE = 8;

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
