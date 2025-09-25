import { getRequestContext } from '@/app/lib/utils';
import { fetchObraById } from '@/app/lib/data';
import EditObraForm from '@/app/ui/dashboard/obras/EditObraForm';
import { notFound } from 'next/navigation';

export default async function EditObraPage({ params }: { params: { id: string } }) {
  const { subdomain } = await getRequestContext();
  const id = params.id;

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
        <EditObraForm obra={obra} />
      </div>
    </div>
  );
}
