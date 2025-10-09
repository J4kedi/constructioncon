import { auth } from '@/app/actions/auth';
import SideNav from "@/app/ui/dashboard/SideNav";
import SuperAdminSideNav from "@/app/ui/dashboard/super-admin/SideNav";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const session = await auth();
    const isSuperAdmin = session?.user?.role === 'SUPER_ADMIN';

    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden bg-gradient-to-br from-white to-background dark:bg-gradient-to-br dark:from-secondary/15 dark:to-background">
            <div className="w-full flex-none md:w-auto">
                {isSuperAdmin ? <SuperAdminSideNav user={session.user} /> : <SideNav />}
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>  
    );
}