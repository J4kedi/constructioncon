'use server';

import { z } from 'zod';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { executeFormAction } from '@/app/lib/action-handler';
import type { FormState } from '@/app/lib/definitions';

const ContaReceberSchema = z.object({
  cliente: z.string().min(1, 'Cliente é obrigatório.'),
  obraId: z.string().optional(),
  descricao: z.string().min(1, 'Descrição é obrigatória.'),
  dataVencimento: z.string().min(1, 'Data de vencimento é obrigatória.'),
  valor: z.coerce.number().positive('O valor deve ser positivo.'),
  status: z.enum(['A_RECEBER', 'RECEBIDO', 'VENCIDO']),
  file: z.any().optional(),
});

export async function createContaReceber(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return executeFormAction({
    schema: ContaReceberSchema,
    formData,
    logic: async (data, context) => {
      const { file, ...rest } = data;
      const prisma = getTenantPrismaClient(context.subdomain);
      await prisma.contaReceber.create({
        data: {
          ...rest,
          anexoUrl: '/docs/placeholder.pdf', // Placeholder
          dataVencimento: new Date(data.dataVencimento),
        },
      });
    },
    revalidatePath: '/dashboard/financeiro/contas-a-receber',
    successMessage: 'Conta a receber criada com sucesso!',
    requires: ['subdomain'],
  });
}
