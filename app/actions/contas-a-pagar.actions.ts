'use server';

import { z } from 'zod';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { executeFormAction } from '@/app/lib/action-handler';
import type { FormState } from '@/app/lib/definitions';

import { CategoriaDespesa } from '@prisma/client';

const ContaPagarSchema = z.object({
  supplierId: z.string().min(1, 'Fornecedor é obrigatório.'),
  dataEmissao: z.string().min(1, 'Data de emissão é obrigatória.'),
  dataVencimento: z.string().min(1, 'Data de vencimento é obrigatória.'),
  valor: z.coerce.number().positive('O valor deve ser positivo.'),
  obraId: z.string().optional(),
  categoria: z.nativeEnum(CategoriaDespesa, { error: "Categoria inválida." }),
  status: z.enum(['A_PAGAR', 'PAGO', 'VENCIDO']),
  file: z.any().optional(),
});

export async function createContaPagar(
  prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  return executeFormAction({
    schema: ContaPagarSchema,
    formData,
    logic: async (data, context) => {
      const { file, ...rest } = data;
      const prisma = getTenantPrismaClient(context.subdomain);
      const supplier = await prisma.supplier.findUnique({ where: { id: data.supplierId } });

      if (!supplier) {
        throw new Error('Fornecedor não encontrado. A operação foi cancelada.');
      }

      await prisma.contaPagar.create({
        data: {
          ...rest,
          fornecedor: supplier.name,
          anexoUrl: '/docs/placeholder.pdf', // Placeholder
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
