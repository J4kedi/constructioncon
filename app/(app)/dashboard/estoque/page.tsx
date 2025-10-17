import { Suspense } from 'react';
import { getRequestContext } from '@/app/lib/server-utils.ts';
import { fetchEstoquePageData } from '@/app/lib/data/estoque.ts';
import { EstoqueDashboardSkeleton } from '@/app/ui/components/skeletons';
import EstoqueDataWrapper from './EstoqueDataWrapper';
import CreateItemButton from '@/app/ui/dashboard/estoque/CreateItemButton';
import CreateEntradaButton from '@/app/ui/dashboard/estoque/CreateEntradaButton';
import CreateSaidaButton from '@/app/ui/dashboard/estoque/CreateSaidaButton';
import PageHeader from '@/app/ui/components/PageHeader';
import { formatObraForUI } from '@/app/lib/utils';

export default async function EstoquePage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const query = resolvedSearchParams?.query || '';

  const { subdomain } = await getRequestContext();
  const { catalogoItens, suppliers, obras } = await fetchEstoquePageData(subdomain);

  return (
    <div className="w-full">
      <PageHeader 
        title="Dashboard de Estoque"
        searchPlaceholder="Buscar itens..."
        actionButtons={(
          <div className="flex items-center gap-4">
            <CreateItemButton />
            <CreateEntradaButton catalogoItens={catalogoItens} suppliers={suppliers} />
            <CreateSaidaButton catalogoItens={catalogoItens} obras={obras} />
          </div>
        )}
      />

      <div className="mt-6">
        <Suspense key={query} fallback={<EstoqueDashboardSkeleton />}>
          <EstoqueDataWrapper query={query} />
        </Suspense>
      </div>
    </div>
  );
}