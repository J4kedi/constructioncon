import { getTenantPrismaClient } from '@/app/lib/prisma';
import { ObraQueryBuilder } from './query/ObraQueryBuilder';

const ITEMS_PER_PAGE = 8;

export async function fetchFilteredObras(subdomain: string, query: string, currentPage: number) {
  try {
    const tenantPrisma = getTenantPrismaClient(subdomain);

    const obraQueryBuilder = new ObraQueryBuilder();
    const queryArgs = obraQueryBuilder
      .withSearch(query)
      .withPage(currentPage)
      .build();

    const [obras, totalCount] = await tenantPrisma.$transaction([
      tenantPrisma.obra.findMany(queryArgs),
      tenantPrisma.obra.count({ where: queryArgs.where }),
    ]);

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
    return { obras, totalPages };

  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch obras.');
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

        return {
            ...obra,
            orcamentoTotal: obra.orcamentoTotal.toNumber(),
            currentCost: obra.currentCost.toNumber(),
            progressPercentage: obra.progressPercentage,
            createdAt: obra.createdAt.toISOString(),
            updatedAt: obra.updatedAt.toISOString(),
            dataInicio: obra.dataInicio.toISOString(),
            dataPrevistaFim: obra.dataPrevistaFim.toISOString(),
        };
    } catch (error) {
        console.error('Database Error em fetchObraById:', error);
        return null;
    }
}