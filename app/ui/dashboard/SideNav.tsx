import { auth } from '@/app/actions/auth';
import { fetchNavLinks } from '@/app/lib/data';
import SideNavContent from './SideNavContent';

export default async function SideNav() {
  const session = await auth();
  const navLinks = await fetchNavLinks();

  if (!session?.user) {
    return null; 
  }

  return <SideNavContent user={session.user} navLinks={navLinks} />;
}
