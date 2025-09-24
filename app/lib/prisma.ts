import { PrismaClient } from "@prisma/client";

// Adiciona o cache e o cliente público ao objeto global do Node.js
const globalForPrisma = globalThis as unknown as {
  prismaClientCache: Map<string, PrismaClient> | undefined;
  publicPrismaClient: PrismaClient | undefined;
};

// Usa o cache global se existir, senão cria um novo
const prismaClientCache = globalForPrisma.prismaClientCache ?? new Map<string, PrismaClient>();

export function getTenantPrismaClient(subdomain: string): PrismaClient {
    const schemaName = `tenant_${subdomain.replace(/-/g, '-')}`;

    const cachedPrisma = prismaClientCache.get(schemaName);
    if (cachedPrisma) return cachedPrisma;

    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) throw new Error('DATABASE_URL não está definida no .env');

    const tenantDatabaseUrl = `${databaseUrl}?schema=${schemaName}`;

    const newPrismaClient = new PrismaClient({
        datasources: {
            db: {
                url: tenantDatabaseUrl,
            },
        },
    });

    prismaClientCache.set(schemaName, newPrismaClient);

    return newPrismaClient;
}

// Usa o cliente público global se existir, senão cria um novo
export function getPublicPrismaClient(): PrismaClient {
    if (globalForPrisma.publicPrismaClient) {
        return globalForPrisma.publicPrismaClient;
    }

    globalForPrisma.publicPrismaClient = new PrismaClient();
    return globalForPrisma.publicPrismaClient;
}

// Em ambiente de não produção, atribui o cache ao objeto global
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prismaClientCache = prismaClientCache;
}