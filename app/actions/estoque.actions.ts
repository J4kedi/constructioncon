'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { CatalogoItemSchema, EstoqueEntradaSchema, EstoqueSaidaSchema, FormState } from '@/app/lib/definitions';
import { executeFormAction } from '@/app/lib/action-handler';
import { findCompany } from '@/app/lib/data/tenant';
import { TipoMovimento } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

export async function createCatalogoItem(prevState: FormState, formData: FormData) {
  return executeFormAction({
    formData,
    schema: CatalogoItemSchema,
    requires: ['subdomain'],
    logic: async (data, context) => {
      const company = await findCompany(context.subdomain!);
      const tenantPrisma = getTenantPrismaClient(context.subdomain!);

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
  return executeFormAction({
    formData,
    schema: EstoqueEntradaSchema,
    requires: ['subdomain', 'user'],
    logic: async (data, context) => {
      const tenantPrisma = getTenantPrismaClient(context.subdomain!);

      const itemCatalogo = await tenantPrisma.catalogoItem.findUniqueOrThrow({
        where: { id: data.catalogoItemId },
      });

      const custoTotal = itemCatalogo.custoUnitario.mul(data.quantidade);

      await tenantPrisma.$transaction(async (tx) => {
        await tx.estoqueMovimento.create({
          data: {
            catalogoItemId: data.catalogoItemId,
            quantidade: data.quantidade,
            supplierId: data.supplierId,
            tipo: TipoMovimento.ENTRADA,
            usuarioId: context.user!.id,
          },
        });

        await tx.despesa.create({
          data: {
            descricao: `Compra de material: ${itemCatalogo.nome}`,
            valor: custoTotal,
            categoria: 'MATERIAL',
            approverId: context.user!.id,
            supplierId: data.supplierId,
          },
        });
      });
    },
    revalidatePaths: ['/dashboard/estoque', '/dashboard/financeiro'],
    successMessage: 'Entrada de estoque registrada com sucesso!',
  });
}

export async function createSaidaEstoque(prevState: FormState, formData: FormData) {
  return executeFormAction({
    formData,
    schema: EstoqueSaidaSchema,
    requires: ['subdomain', 'user'],
    logic: async (data, context) => {
      const tenantPrisma = getTenantPrismaClient(context.subdomain!);

      await tenantPrisma.$transaction(async (tx) => {
        const stockSoma = await tx.estoqueMovimento.aggregate({
          where: { catalogoItemId: data.catalogoItemId },
          _sum: { quantidade: true },
        });
        
        const quantidadeAtual = stockSoma._sum.quantidade ?? new Decimal(0);

        if (quantidadeAtual.lt(data.quantidade)) {
          throw new Error('Estoque insuficiente para realizar a saída.');
        }

        await tx.estoqueMovimento.create({
          data: {
            catalogoItemId: data.catalogoItemId,
            quantidade: new Decimal(data.quantidade).negated(),
            obraDestinoId: data.obraDestinoId,
            tipo: TipoMovimento.SAIDA,
            usuarioId: context.user!.id,
          },
        });
      });
    },
    revalidatePath: '/dashboard/estoque',
    successMessage: 'Saída de estoque registrada com sucesso!',
  });
}
