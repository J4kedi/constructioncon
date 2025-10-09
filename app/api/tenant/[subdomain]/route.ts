import { NextResponse } from 'next/server';
import { getPublicPrismaClient } from '@/app/lib/prisma';
import { unstable_cache as cache } from 'next/cache';

const prisma = getPublicPrismaClient();

/**
 * Esta Rota de API corre no ambiente Node.js e pode usar o Prisma de forma segura.
 * Ela busca um tenant pelo subdomínio.
 * @param context - Contém os parâmetros da rota.
*/

async function getTenantData(subdomain: string) {
  console.log(`Buscando dados do tenant para: ${subdomain} (sem cache)`);
  return prisma.tenant.findUnique({
    where: { subdomain },
    include: {
      features: {
        select: { key: true },
      },
    },
  });
}

const getCachedTenantData = cache(
    getTenantData,
    ['tenant_api_data'],
    { revalidate: 3600 }
);

export async function GET(
  request: Request,
  { params }: { params: { subdomain: string } }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const { subdomain } = resolvedParams;

    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomínio é obrigatório.' }, { status: 400 });
    }

    const tenant = await getCachedTenantData(subdomain);

    if (!tenant) {
      return NextResponse.json({ error: 'Tenant não encontrado.' }, { status: 404 });
    }

    return NextResponse.json(tenant);

  } catch (error) {
    console.error('API Error fetching tenant:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
