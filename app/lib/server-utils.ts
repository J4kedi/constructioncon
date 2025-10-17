'use server';

import { headers } from 'next/headers';
import { auth } from '@/app/actions/auth';
import type { RequestContext } from './definitions.ts';

export async function getRequestContext(): Promise<RequestContext> {
  const headersList = await headers();
  const subdomain = headersList.get('x-tenant-subdomain');
  const tenantId = headersList.get('x-tenant-id');
  
  const session = await auth();
  const user = session?.user;

  return { subdomain, tenantId, user };
}
