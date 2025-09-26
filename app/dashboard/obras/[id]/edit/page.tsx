import { fetchObraById } from '@/app/lib/data';
import { getRequestContext } from '@/app/lib/utils';
import EditObraForm from '@/app/ui/dashboard/obras/EditObraForm';
import { notFound } from 'next/navigation';

export default async function EditObraPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const { subdomain } = await getRequestContext();

  if (!subdomain) {
    return <p className="text-red-500">Erro: Tenant não pôde ser identificado.</p>;
  }

  const obra = await fetchObraById(id, subdomain);

  if (!obra) {
    notFound();
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">Editar Obra</h1>
      <div className="p-8 bg-background rounded-lg border border-secondary/20 shadow-sm">
        <EditObraForm obra={obra} subdomain={subdomain} />
      </div>
    </div>
  );
}