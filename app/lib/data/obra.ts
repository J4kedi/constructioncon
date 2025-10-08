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
