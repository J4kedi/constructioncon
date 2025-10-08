import { auth } from '@/app/actions/auth';
import { headers } from 'next/headers';
import SuperAdminDashboard from '@/app/ui/dashboard/super-admin-dashboard';
import TenantDashboard from '@/app/ui/dashboard/tenant-dashboard';

export default async function Page() {
    const session = await auth();
    const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

    if (isSuperAdmin) {
        return <SuperAdminDashboard />;
    }

    const headerList = headers();
    const subdomain = (await headerList).get('x-tenant-subdomain');

    if (!subdomain) {
        return <p className="text-red-500">Erro: Tenant não pôde ser identificado. Verifique o subdomínio.</p>;
    }

    return <TenantDashboard subdomain={subdomain} />;
}