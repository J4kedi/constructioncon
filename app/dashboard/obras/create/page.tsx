import { fetchUsers } from '@/app/lib/data';
import { getRequestContext } from '@/app/lib/utils';
import CreateObraForm from '@/app/ui/dashboard/obras/CreateObraForm';
import { UserRole } from '@prisma/client';

export default async function CreateObraPage() {
  const { subdomain } = await getRequestContext();

  if (!subdomain) {
    return <p className="text-red-500">Erro: Tenant não pôde ser identificado.</p>;
  }

  const customers = await fetchUsers(subdomain, { roles: [UserRole.END_CUSTOMER] });

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-text mb-6">Criar Nova Obra</h1>
      <div className="p-8 bg-background rounded-lg border border-secondary/20 shadow-sm">
        <CreateObraForm customers={customers} />
      </div>
    </div>
  );
}
