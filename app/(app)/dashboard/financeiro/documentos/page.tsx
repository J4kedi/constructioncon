import { Suspense } from 'react';
import { fetchDocumentos, fetchContasAPagar, fetchContasAReceber } from '@/app/lib/data/financeiro';
import { fetchAllObrasSimple } from '@/app/lib/data/obra';
import { getRequestContext } from '@/app/lib/server-utils';
import DocumentosClientPage from './client-page';
import { DocumentosTableSkeleton } from '@/app/ui/components/skeletons';

export default async function DocumentosPage({ searchParams }: { searchParams?: { query?: string } }) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const { subdomain } = await getRequestContext();
  const query = resolvedSearchParams?.query || '';
  
  const [documentos, obras, contasPagar, contasReceber] = await Promise.all([
    fetchDocumentos(subdomain!, query),
    fetchAllObrasSimple(subdomain!),
    fetchContasAPagar(subdomain!),
    fetchContasAReceber(subdomain!),
  ]);

  return (
    <Suspense fallback={<DocumentosTableSkeleton />}>
      <DocumentosClientPage 
        documentos={documentos}
        obras={obras}
        contasPagar={contasPagar}
        contasReceber={contasReceber}
      />
    </Suspense>
  );
}
