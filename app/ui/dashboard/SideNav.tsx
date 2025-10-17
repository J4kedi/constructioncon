import { auth } from '@/app/actions/auth';
import { fetchNavLinks } from '@/app/lib/data/nav';
import { superAdminLinks } from '@/app/lib/data/super-admin-links';
import SideNavLayout from './SideNavLayout';
import { UserRole } from '@prisma/client';

export default async function SideNav() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }

  const isSuperAdmin = session.user.role === UserRole.SUPER_ADMIN;
  const navLinks = isSuperAdmin ? superAdminLinks : await fetchNavLinks();

  return <SideNavLayout user={session.user} navLinks={navLinks} isSuperAdmin={isSuperAdmin} />;
}
