'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { UpdateUserSchema } from '@/app/lib/definitions';

import { getRequestContext } from '@/app/lib/utils';

// ... other imports

export async function updateUser(prevState: any, formData: FormData) {
  const { subdomain } = await getRequestContext();
  if (!subdomain) {
    return { message: 'Falha: Subdomínio não identificado.' };
  }

  const validatedFields = UpdateUserSchema.safeParse({
    id: formData.get('id'),
    name: formData.get('name'),
    jobTitle: formData.get('jobTitle'),
    role: formData.get('role'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Verifique os campos.',
    };
  }

  const { id, ...dataToUpdate } = validatedFields.data;

  try {
    const tenantPrisma = getTenantPrismaClient(subdomain);
    await tenantPrisma.user.update({ where: { id }, data: dataToUpdate });
    
    revalidatePath('/dashboard/users');
    return { success: true, message: 'Usuário atualizado com sucesso.' };
  } catch (e) {
    console.error('Erro ao atualizar usuário:', e);
    return { message: 'Falha no banco de dados: Não foi possível atualizar o usuário.' };
  }
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
