'use server';

import { headers } from 'next/headers';
import { auth } from '@/app/actions/auth';
import type { RequestContext } from './utils.ts';

export async function getRequestContext(): Promise<RequestContext> {
  const headersList = headers();
  const subdomain = (await headersList).get('x-tenant-subdomain');
  const tenantId = (await headersList).get('x-tenant-id');
  
  const session = await auth();
  const user = session?.user;

  return { subdomain, tenantId, user };
}
