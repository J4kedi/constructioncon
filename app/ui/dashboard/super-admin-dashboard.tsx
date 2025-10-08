import { getAllTenants, getAllUsersAcrossTenants } from '@/app/lib/data';

export default async function SuperAdminDashboard() {
  const tenants = await getAllTenants();
  const users = await getAllUsersAcrossTenants();

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-6">Visão Geral do Super Admin</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-secondary/20 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-text/90">Total de Tenants</h3>
          <p className="truncate rounded-xl bg-background/50 px-4 py-8 text-center text-2xl text-text">{tenants.length}</p>
        </div>
        <div className="rounded-xl bg-secondary/20 p-4 shadow-sm">
          <h3 className="text-sm font-medium text-text/90">Total de Usuários</h3>
          <p className="truncate rounded-xl bg-background/50 px-4 py-8 text-center text-2xl text-text">{users.length}</p>
        </div>
      </div>
    </div>
  );
}