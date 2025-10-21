'use server';

import { z } from 'zod';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { executeFormAction } from '@/app/lib/action-handler';
import type { FormState } from '@/app/lib/definitions';

const ContaPagarSchema = z.object({
  fornecedor: z.string().min(1, 'Fornecedor é obrigatório.'),
  dataEmissao: z.string().min(1, 'Data de emissão é obrigatória.'),
  dataVencimento: z.string().min(1, 'Data de vencimento é obrigatória.'),
  valor: z.coerce.number().positive('O valor deve ser positivo.'),
  obraId: z.string().optional(),
  categoria: z.string().optional(),
  status: z.enum(['A_PAGAR', 'PAGO', 'VENCIDO']),
  anexoUrl: z.string().url().optional().or(z.literal('')),
});

export async function createContaPagar(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return executeFormAction({
    schema: ContaPagarSchema,
    formData,
    logic: async (data, context) => {
      const prisma = getTenantPrismaClient(context.subdomain);
      await prisma.contaPagar.create({
        data: {
          ...data,
          dataEmissao: new Date(data.dataEmissao),
          dataVencimento: new Date(data.dataVencimento),
        },
      });
    },
    revalidatePath: '/dashboard/financeiro/contas-a-pagar',
    successMessage: 'Conta a pagar criada com sucesso!',
    requires: ['subdomain'],
  });
}
