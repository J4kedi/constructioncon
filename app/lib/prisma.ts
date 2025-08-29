import { PrismaClient } from "@prisma/client";

const prismaClientCache = new Map<string, PrismaClient>();

export function getTenantPrismaClient(subdomain: string) {
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

let publicPrismaClient: PrismaClient;

export function getPublicPrismaClient(): PrismaClient {
    if (!publicPrismaClient) publicPrismaClient = new PrismaClient();

    return publicPrismaClient;
}