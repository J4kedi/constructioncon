import { Suspense } from 'react';
import Search from '@/app/ui/components/search';
import { EstoqueDashboardSkeleton } from '@/app/ui/components/skeletons';
import EstoqueDataWrapper from './EstoqueDataWrapper';
import ActionButtons from './ActionButtons';

// Esta é a página de layout principal para o dashboard de estoque.
// Ela define a estrutura da página, como título e busca, e delega o 
// carregamento e exibição dos dados para componentes filhos.

export default async function EstoquePage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
  };
}) {
  const query = searchParams?.query || '';

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-2xl font-bold text-text">Dashboard de Estoque</h1>
        <ActionButtons />
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Buscar itens..." />
      </div>

      {/* O Suspense mostra um skeleton enquanto os dados do dashboard são carregados no servidor */}
      <div className="mt-6">
        <Suspense key={query} fallback={<EstoqueDashboardSkeleton />}>
          <EstoqueDataWrapper />
        </Suspense>
      </div>

      {/* TODO: Adicionar outros componentes do dashboard (gráficos, listas, etc) */}
    </div>
  );
}