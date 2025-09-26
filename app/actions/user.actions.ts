'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { UpdateUserSchema } from '@/app/lib/definitions';
import { getRequestContext } from '@/app/lib/utils';
import { executeFormAction, FormState } from '@/app/lib/action-handler';

export async function updateUser(prevState: FormState, formData: FormData): Promise<FormState> {
  const { subdomain } = await getRequestContext();
  if (!subdomain) {
    return { message: 'Falha: Subdomínio não identificado.', success: false };
  }

  return executeFormAction({
    formData,
    schema: UpdateUserSchema,
    revalidatePath: '/dashboard/users',
    logic: async (data) => {
      const { id, ...dataToUpdate } = data;
      const tenantPrisma = getTenantPrismaClient(subdomain);
      await tenantPrisma.user.update({ where: { id }, data: dataToUpdate });
    },
  });
}

export async function deleteUser(userId: string) {
  const { subdomain } = await getRequestContext();

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