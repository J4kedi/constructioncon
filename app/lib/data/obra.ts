import { getTenantPrismaClient } from '@/app/lib/prisma';

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

export async function fetchAllObrasSimple(subdomain: string) {
    try {
        const tenantPrisma = getTenantPrismaClient(subdomain);
        const obras = await tenantPrisma.obra.findMany({
            select: {
                id: true,
                nome: true,
            },
            orderBy: {
                nome: 'asc',
            },
        });
        return obras;
    } catch (error) {
        console.error('Database Error em fetchAllObrasSimple:', error);
        return [];
    }
}