import { getRequestContext } from '@/app/lib/server-utils';
import { UserRole } from '@prisma/client';
import SuperAdminDashboard from '@/app/ui/dashboard/super-admin-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';

export default async function OverviewLayout({
  summary,
  deadlines,
  overruns,
  status,
  stock,
  feed,
  performance,
}: {
  children: React.ReactNode;
  summary: React.ReactNode;
  deadlines: React.ReactNode;
  overruns: React.ReactNode;
  status: React.ReactNode;
  stock: React.ReactNode;
  feed: React.ReactNode;
  performance: React.ReactNode;
}) {
  const { user, subdomain } = await getRequestContext();

    if (user?.role === UserRole.SUPER_ADMIN && !subdomain) {
      return <SuperAdminDashboard />;
    }

  return (
    <>
      <h1 className="text-3xl font-bold text-text mb-6">Acompanhamento Geral</h1>
      
      <div className="space-y-6">
        {summary}
        
        {performance}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Prazos e Riscos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {deadlines}
                {overruns}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                {feed}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Status Operacional</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {status}
                {stock}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}