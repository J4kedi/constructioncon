import { User } from 'next-auth';
import { superAdminLinks } from '@/app/lib/data/super-admin-links';
import SideNavLayout from '../SideNavLayout';

export default function SuperAdminSideNav({ user }: { user: User }) {
  return (
    <SideNavLayout
      user={user}
      navLinks={superAdminLinks}
    />
  );
}
