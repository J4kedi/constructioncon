import { auth } from '@/app/actions/auth';
import SideNavContent from './SideNavContent';

export default async function SideNav() {
  const session = await auth();

  // A sessão deve existir por causa do middleware, mas é uma boa prática verificar.
  if (!session?.user) {
    // Pode-se retornar um skeleton ou null se o middleware já garante a sessão
    return null; 
  }

  return <SideNavContent user={session.user} />;
}
