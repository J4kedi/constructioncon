'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { ObraSchema, UpdateObraSchema } from '@/app/lib/definitions';
import { executeFormAction, FormState } from '@/app/lib/action-handler';
import { revalidatePath } from 'next/cache';
import { StatusObra } from '@prisma/client';

export async function updateObraStatus(obraId: string, status: StatusObra) {
  try {
    const { subdomain } = await getRequestContext();
    if (!subdomain) {
      throw new Error('Subdomínio não identificado.');
    }

    const tenantPrisma = getTenantPrismaClient(subdomain);
    await tenantPrisma.obra.update({
      where: { id: obraId },
      data: { status },
    });

    revalidatePath('/dashboard/obras');
    return { success: true, message: 'Status da obra atualizado com sucesso!' };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro desconhecido.';
    return { success: false, message: errorMessage };
  }
}

import { findCompany } from '@/app/lib/data/tenant';
import { fetchObraById } from '@/app/lib/data/obra.ts';
import { getRequestContext } from '@/app/lib/server-utils.ts';
import { formatObraForUI } from '@/app/lib/utils.ts';

export async function getObraDetailsAction(id: string) {
  const { subdomain } = await getRequestContext();
  if (!subdomain) {
    throw new Error('Subdomínio não identificado.');
  }
  const obra = await fetchObraById(id, subdomain);
  if (!obra) {
    return null;
  }
  return formatObraForUI(obra);
}

type ObraData = z.infer<typeof ObraSchema>;

async function createResidencialObra(data: ObraData, companyId: string, subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  await tenantPrisma.obra.create({
    data: {
      nome: `[Residencial] ${data.nome}`,
      type: 'RESIDENCIAL',
      endCustomerName: data.endCustomerName,
      orcamentoTotal: data.orcamentoTotal,
      dataInicio: new Date(data.dataInicio),
      dataPrevistaFim: new Date(data.dataPrevistaFim),
      address: data.address || null,
      companyId: companyId,
      endCustomerId: data.endCustomerId || null,
    },
  });
}

async function createComercialObra(data: ObraData, companyId: string, subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  await tenantPrisma.obra.create({
    data: {
      nome: `[Comercial] ${data.nome}`,
      type: 'COMERCIAL',
      endCustomerName: data.endCustomerName,
      orcamentoTotal: data.orcamentoTotal * 1.1,
      dataInicio: new Date(data.dataInicio),
      dataPrevistaFim: new Date(data.dataPrevistaFim),
      address: data.address || null,
      companyId: companyId,
      endCustomerId: data.endCustomerId || null,
    },
  });
}

const creationStrategies: Record<string, (data: ObraData, companyId: string, subdomain: string) => Promise<void>> = {
  RESIDENCIAL: createResidencialObra,
  COMERCIAL: createComercialObra,
};

export async function createObra(prevState: FormState, formData: FormData) {
  return executeFormAction({
    formData,
    schema: ObraSchema,
    requires: ['subdomain'],
    revalidatePath: '/dashboard/obras',
    redirectPath: '/dashboard/obras',
    logic: async (data, context) => {
      const company = await findCompany(context.subdomain!);
      const strategy = creationStrategies[data.type];

      if (!strategy) {
        throw new Error(`Tipo de obra desconhecido: ${data.type}`);
      }

      await strategy(data, company.id, context.subdomain!);
    },
    successMessage: 'Obra criada com sucesso!',
  });
}

export async function updateObra(prevState: FormState, formData: FormData) {
  return executeFormAction({
    formData,
    schema: UpdateObraSchema,
    requires: ['subdomain'],
    revalidatePath: '/dashboard/obras',
    redirectPath: '/dashboard/obras',
    logic: async (data, context) => {
      const { id, dataInicio, dataPrevistaFim, ...rest } = data;
      const tenantPrisma = getTenantPrismaClient(context.subdomain!);
      
      await tenantPrisma.obra.update({
        where: { id },
        data: {
          ...rest,
          dataInicio: dataInicio ? new Date(dataInicio) : undefined,
          dataPrevistaFim: dataPrevistaFim
            ? new Date(dataPrevistaFim)
            : undefined,
        },
      });
    },
    successMessage: 'Obra atualizada com sucesso!',
  });
}