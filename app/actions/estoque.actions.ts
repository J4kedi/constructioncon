'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { CatalogoItemSchema, EstoqueEntradaSchema, EstoqueSaidaSchema } from '@/app/lib/definitions';
import { executeFormAction, FormState } from '@/app/lib/action-handler';
import { getRequestContext } from '@/app/lib/utils';
import { findCompany } from '@/app/lib/data';
import { revalidatePath } from 'next/cache';
import { TipoMovimento } from '@prisma/client';
import { auth } from '@/app/actions/auth.ts'; // Importa a função de autenticação

export async function createCatalogoItem(prevState: FormState, formData: FormData) {
  const { subdomain } = await getRequestContext();
  if (!subdomain) {
    return { message: 'Falha: Subdomínio não identificado.', success: false, errors: {} };
  }

  return executeFormAction({
    formData,
    schema: CatalogoItemSchema,
    logic: async (data) => {
      const company = await findCompany(subdomain);
      const tenantPrisma = getTenantPrismaClient(subdomain);

      await tenantPrisma.catalogoItem.create({
        data: {
          nome: data.nome,
          descricao: data.descricao,
          unidade: data.unidade,
          categoria: data.categoria,
          custoUnitario: data.custoUnitario,
          nivelMinimo: data.nivelMinimo,
          companyId: company.id,
        },
      });
    },
    revalidatePath: '/dashboard/estoque',
    successMessage: 'Novo item adicionado ao catálogo com sucesso!',
  });
}

export async function createEntradaEstoque(prevState: FormState, formData: FormData) {
  const { subdomain } = await getRequestContext();
  if (!subdomain) {
    return { message: 'Falha: Subdomínio não identificado.', success: false, errors: {} };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { message: 'Falha: Usuário não autenticado.', success: false, errors: {} };
  }

  return executeFormAction({
    formData,
    schema: EstoqueEntradaSchema,
    logic: async (data) => {
      const tenantPrisma = getTenantPrismaClient(subdomain);
      await tenantPrisma.estoqueMovimento.create({
        data: {
          catalogoItemId: data.catalogoItemId,
          quantidade: data.quantidade,
          supplierId: data.supplierId,
          tipo: TipoMovimento.ENTRADA,
          usuarioId: userId,
        },
      });
    },
    revalidatePath: '/dashboard/estoque',
    successMessage: 'Entrada de estoque registrada com sucesso!',
  });
}

export async function createSaidaEstoque(prevState: FormState, formData: FormData) {
  const { subdomain } = await getRequestContext();
  if (!subdomain) {
    return { message: 'Falha: Subdomínio não identificado.', success: false, errors: {} };
  }

  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return { message: 'Falha: Usuário não autenticado.', success: false, errors: {} };
  }

  return executeFormAction({
    formData,
    schema: EstoqueSaidaSchema,
    logic: async (data) => {
      const tenantPrisma = getTenantPrismaClient(subdomain);
      
      const stockSoma = await tenantPrisma.estoqueMovimento.aggregate({
        where: { catalogoItemId: data.catalogoItemId },
        _sum: { quantidade: true },
      });
      const quantidadeAtual = stockSoma._sum.quantidade ?? 0;

      if (quantidadeAtual < data.quantidade) {
        throw new Error('Estoque insuficiente para realizar a saída.');
      }

      await tenantPrisma.estoqueMovimento.create({
        data: {
          catalogoItemId: data.catalogoItemId,
          quantidade: -data.quantidade, // Saídas são registradas como valores negativos
          obraDestinoId: data.obraDestinoId,
          tipo: TipoMovimento.SAIDA,
          usuarioId: userId,
        },
      });
    },
    revalidatePath: '/dashboard/estoque',
    successMessage: 'Saída de estoque registrada com sucesso!',
  });
}
