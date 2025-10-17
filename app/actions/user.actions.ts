'use server'

import { UpdateUserSchema, DeleteUserSchema, UpdateProfileSchema, FormState } from '@/app/lib/definitions';
import { auth } from '@/app/actions/auth';
import { executeFormAction } from '@/app/lib/action-handler';
import fs from 'fs/promises';
import path from 'path';
import { createGenericDeleteAction, createGenericUpdateAction } from '@/app/lib/action-factories';
import { getTenantPrismaClient } from '../lib/prisma';

async function _handleImageUpload(formData: FormData, dataToUpdate: any) {
  const imageFile = formData.get('image') as File;
  if (imageFile && imageFile.size > 0) {
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, '_')}`;
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    await fs.writeFile(path.join(uploadsDir, filename), buffer);
    dataToUpdate.avatarUrl = `/uploads/${filename}`;
  }
}

export async function updateProfile(prevState: FormState, formData: FormData): Promise<FormState> {
  return executeFormAction({
    formData,
    schema: UpdateProfileSchema,
    revalidatePath: '/dashboard',
    logic: async (data, context) => {
      const session = await auth();
      if (!session?.user?.id) {
        throw new Error("Usuário não autenticado.");
      }

      const dataToUpdate: { name?: string; avatarUrl?: string } = {};
      if (data.name) {
        dataToUpdate.name = data.name;
      }

      await _handleImageUpload(formData, dataToUpdate);

      if (Object.keys(dataToUpdate).length > 0) {
        const tenantPrisma = getTenantPrismaClient(context.subdomain);
        await tenantPrisma.user.update({ where: { id: session.user.id }, data: dataToUpdate });
      }
    },
    successMessage: 'Perfil atualizado com sucesso!',
  });
}

export const updateUser = createGenericUpdateAction(
    'user',
    UpdateUserSchema,
    '/dashboard/users',
    'Usuário atualizado com sucesso!'
);

export const deleteUser = createGenericDeleteAction(
    'user',
    DeleteUserSchema,
    '/dashboard/users',
    'Usuário deletado com sucesso.'
);