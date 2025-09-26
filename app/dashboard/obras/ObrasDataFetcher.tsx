import { headers } from 'next/headers';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { ObraFetcher } from '@/app/lib/data/ObraFetcher';
import Pagination from '@/app/ui/dashboard/pagination';

import ObrasTable, { PlainObra } from '@/app/ui/dashboard/obras/ObrasTable';

export default async function ObrasDataFetcher({
  searchParams 
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const headerList = headers();
  const subdomain = (await headerList).get('x-tenant-subdomain');

  if (!subdomain) {
    return <p className="text-red-500">Erro: Tenant não pôde ser identificado.</p>;
  }

  const prisma = getTenantPrismaClient(subdomain);
  const obraFetcher = new ObraFetcher(prisma);
  const { data: obras, totalPages } = await obraFetcher.fetchPageData(searchParams);

  const plainObras: PlainObra[] = obras.map(obra => ({
    ...obra,
    orcamentoTotal: obra.orcamentoTotal.toNumber(),
    currentCost: obra.currentCost.toNumber(),
    dataInicio: new Date(obra.dataInicio).toLocaleDateString('pt-BR'),
    dataPrevistaFim: new Date(obra.dataPrevistaFim).toLocaleDateString('pt-BR'),
    etapas: [], // Etapas não são serializáveis, tratar separadamente se necessário
  }));

  return (
    <div className="mt-8 flow-root">
        {plainObras?.length > 0 ? (
            <ObrasTable obras={plainObras} />
        ) : (
            <p className="text-center text-text/60 p-4">Nenhuma obra encontrada.</p>
        )}
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
