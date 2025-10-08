import { headers } from 'next/headers';
import { auth } from '@/app/actions/auth';
import { User } from 'next-auth';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export interface RequestContext {
  subdomain: string | null;
  tenantId: string | null;
  user: User | undefined;
}

export async function getRequestContext(): Promise<RequestContext> {
  const headersList = headers();
  const subdomain = (await headersList).get('x-tenant-subdomain');
  const tenantId = (await headersList).get('x-tenant-id');
  
  const session = await auth();
  const user = session?.user;

  return { subdomain, tenantId, user };
}
