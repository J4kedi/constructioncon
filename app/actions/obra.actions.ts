'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { ObraSchema, UpdateObraSchema } from '@/app/lib/definitions';
import { executeFormAction, FormState } from '@/app/lib/action-handler';
import { z } from 'zod';
import { findCompany } from '@/app/lib/data/tenant';
import { fetchObraById } from '@/app/lib/data/obra.ts';
import { getRequestContext } from '@/app/lib/server-utils.ts';

export async function getObraDetailsAction(id: string) {
    const { subdomain } = await getRequestContext();
    if (!subdomain) {
        throw new Error("Subdomínio não identificado.");
    }
    return await fetchObraById(id, subdomain);
}

type ObraData = z.infer<typeof ObraSchema>;

async function createResidencialObra(data: ObraData, companyId: string, subdomain: string) {
  const tenantPrisma = getTenantPrismaClient(subdomain);
  await tenantPrisma.obra.create({
    data: {
      nome: `[Residencial] ${data.nome}`,
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
      const strategy = creationStrategies[data.obraType];

      if (!strategy) {
        throw new Error(`Tipo de obra desconhecido: ${data.obraType}`);
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