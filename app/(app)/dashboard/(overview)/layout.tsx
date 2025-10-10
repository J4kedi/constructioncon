import { getRequestContext } from '@/app/lib/server-utils';
import { UserRole } from '@prisma/client';
import SuperAdminDashboard from '@/app/ui/dashboard/super-admin-dashboard';

export default async function OverviewLayout({
  summary,
  deadlines,
  overruns,
  status,
  stock,
  feed,
}: {
  children: React.ReactNode;
  summary: React.ReactNode;
  deadlines: React.ReactNode;
  overruns: React.ReactNode;
  status: React.ReactNode;
  stock: React.ReactNode;
  feed: React.ReactNode;
}) {
  const { user, subdomain } = await getRequestContext();

  if (user?.role === UserRole.SUPER_ADMIN && !subdomain) {
    return <SuperAdminDashboard />;
  }

  return (
    <>
      <h1 className="text-3xl font-bold text-text mb-6">Acompanhamento Geral</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {summary}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {deadlines}
          {overruns}
          {feed}
        </div>

        <div className="space-y-6">
          {status}
          {stock}
        </div>
      </div>
    </>
  );
}