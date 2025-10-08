'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { revalidatePath } from 'next/cache';
import { UpdateUserSchema, DeleteUserSchema } from '@/app/lib/definitions';

import { executeFormAction, FormState } from '@/app/lib/action-handler';

export async function updateUser(prevState: FormState, formData: FormData): Promise<FormState> {
  return executeFormAction({
    formData,
    schema: UpdateUserSchema,
    requires: ['subdomain'],
    revalidatePath: '/dashboard/users',
    logic: async (data, context) => {
      const { id, ...dataToUpdate } = data;
      const tenantPrisma = getTenantPrismaClient(context.subdomain!);
      await tenantPrisma.user.update({ where: { id }, data: dataToUpdate });
    },
    successMessage: 'Usuário atualizado com sucesso!',
  });
}

export async function deleteUser(prevState: FormState, formData: FormData): Promise<FormState> {
  return executeFormAction({
    formData,
    schema: DeleteUserSchema,
    requires: ['subdomain'],
    revalidatePath: '/dashboard/users',
    logic: async (data, context) => {
      const tenantPrisma = getTenantPrismaClient(context.subdomain!);
      await tenantPrisma.user.delete({ where: { id: data.id } });
    },
    successMessage: 'Usuário deletado com sucesso.',
  });
}