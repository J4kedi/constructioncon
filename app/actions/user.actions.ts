'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function updateUser(prevState: any, formData: FormData) {
  console.log('Atualizando usuário...');
  return { message: 'Usuário atualizado com sucesso!' };
}

export async function deleteUser(userId: string) {
  const subdomain = (await headers()).get('x-tenant-subdomain');

  if (!subdomain) {
    return { success: false, message: 'Falha: Subdomínio não identificado.' };
  }

  try {
    const tenantPrisma = getTenantPrismaClient(subdomain);
    await tenantPrisma.user.delete({ where: { id: userId } });
    
    revalidatePath('/dashboard/users');
    return { success: true, message: 'Usuário deletado com sucesso.' };
  } catch (e) {
    console.error('Erro ao deletar usuário:', e);
    return { success: false, message: 'Falha ao deletar usuário.' };
  }
}
