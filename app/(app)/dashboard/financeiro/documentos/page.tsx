import { Suspense } from 'react';
import { getRequestContext } from '@/app/lib/server-utils';
import { DocumentosTableSkeleton } from '@/app/ui/components/skeletons';
import DocumentosTable from '@/app/ui/dashboard/financeiro/documentos/Table';
import Pagination from '@/app/ui/dashboard/pagination';
import PageHeader from '@/app/ui/components/PageHeader';
import { DocumentoFetcher } from '@/app/lib/data/DocumentoFetcher';
import CreateDocumentoButton from '@/app/ui/dashboard/financeiro/documentos/CreateDocumentoButton';
import { fetchAllObrasSimple } from '@/app/lib/data/obra';
import { fetchContasAPagar, fetchContasAReceber } from '@/app/lib/data/financeiro';

export const dynamic = 'force-dynamic';

export default async function DocumentosPage({ searchParams }: { searchParams: { [key: string]: string | undefined } }) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const { subdomain } = await getRequestContext();
  const query = resolvedSearchParams?.query || '';
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const documentoFetcher = new DocumentoFetcher(subdomain!);
  const { data: documentos, totalPages } = await documentoFetcher.fetchPageData(searchParams ?? {});

  const serializableDocumentos = documentos.map(doc => ({
    ...doc,
    obra: {
      ...doc.obra,
      orcamentoTotal: doc.obra.orcamentoTotal.toNumber(),
      currentCost: doc.obra.currentCost.toNumber(),
    },
    contaPagar: doc.contaPagar ? {
      ...doc.contaPagar,
      valor: doc.contaPagar.valor.toNumber(),
    } : null,
    contaReceber: doc.contaReceber ? {
      ...doc.contaReceber,
      valor: doc.contaReceber.valor.toNumber(),
    } : null,
  }));

  const [obras, rawContasPagar, rawContasReceber] = await Promise.all([
    fetchAllObrasSimple(subdomain!),
    fetchContasAPagar(subdomain!),
    fetchContasAReceber(subdomain!),
  ]);

  const contasPagar = rawContasPagar.map(c => ({ ...c, valor: c.valor.toNumber() }));
  const contasReceber = rawContasReceber.map(c => ({ ...c, valor: c.valor.toNumber() }));

  return (
    <div className="w-full">
      <PageHeader 
        title="Documentos Fiscais"
        actionButtons={
          <CreateDocumentoButton 
            obras={obras}
            contasPagar={contasPagar}
            contasReceber={contasReceber}
          />
        }
        searchPlaceholder="Buscar por nome, obra, fornecedor ou cliente..."
      />

      <Suspense key={query + currentPage} fallback={<DocumentosTableSkeleton />}>
        <DocumentosTable data={serializableDocumentos} />
      </Suspense>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}
