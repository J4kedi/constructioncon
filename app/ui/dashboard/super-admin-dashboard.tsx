import { getAllTenants, getAllUsersAcrossTenants } from '@/app/lib/data/tenant';
import { Card } from '@/app/ui/dashboard/cards';
import { Building, Users } from 'lucide-react';

export default async function SuperAdminDashboard() {
  const tenants = await getAllTenants();
  const users = await getAllUsersAcrossTenants();

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-6">Visão Geral do Super Admin</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card 
          title="Total de Tenants"
          value={tenants.length}
          icon={<Building className="h-5 w-5 text-primary" />}
        />
        <Card 
          title="Total de Usuários"
          value={users.length}
          icon={<Users className="h-5 w-5 text-primary" />}
        />
      </div>
    </div>
  );
}