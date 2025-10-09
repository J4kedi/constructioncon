import { getAllTenants } from '@/app/lib/data/tenant';
import TenantsTable from '@/app/ui/dashboard/super-admin/tenants-table';

export default async function Page() {
  const tenants = await getAllTenants();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-text">Gerenciamento de Tenants</h1>
      </div>
      <TenantsTable tenants={tenants} />
    </div>
  );
}
