'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { executeFormAction } from '@/app/lib/action-handler';
import type { FormState } from '@/app/lib/definitions';
import { DocumentoSchema } from '@/app/lib/definitions';

export async function createDocumento(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return executeFormAction({
    schema: DocumentoSchema,
    formData,
    logic: async (data, context) => {
      const prisma = getTenantPrismaClient(context.subdomain);
      await prisma.document.create({ data });
    },
    revalidatePath: '/dashboard/financeiro/documentos',
    successMessage: 'Documento adicionado com sucesso!',
    requires: ['subdomain'],
  });
}
