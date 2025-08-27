import { PrismaClient } from '@prisma/client';
import { env } from 'process';

declare global {
  var prismaClients: Record<string, PrismaClient> | undefined;
}

const prismaClients = global.prismaClients || {};

const DATABASE_URL_BASE = env.DATABASE_URL!.split('?')[0];

export function getPrismaClient(tenantId: string): PrismaClient {
  if (prismaClients[tenantId]) {
    return prismaClients[tenantId];
  }

  const tenantDatabaseUrl = `${DATABASE_URL_BASE}?schema=${tenantId}`;

  const newPrismaClient = new PrismaClient({
    datasources: {
      db: {
        url: tenantDatabaseUrl,
      },
    },
    log: tenantId === 'public' ? ['query', 'info', 'warn', 'error'] : [],
  });

  prismaClients[tenantId] = newPrismaClient;

  return newPrismaClient;
}

export const publicPrisma = getPrismaClient('public');

if (env.NODE_ENV !== 'production') {
  global.prismaClients = prismaClients;
}