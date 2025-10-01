'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { ObraSchema, UpdateObraSchema } from '@/app/lib/definitions';
import { executeFormAction, FormState } from '@/app/lib/action-handler';
import { z } from 'zod';
import { findCompany } from '@/app/lib/data'; // Importa a função compartilhada
import { getRequestContext } from '@/app/lib/utils';

type ObraData = z.infer<typeof ObraSchema>;

// A função findCompany foi movida para data.ts

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
  const { subdomain } = await getRequestContext();
  if (!subdomain) {
    return { message: 'Falha: Subdomínio não identificado.', success: false };
  }
  
  return executeFormAction({
    formData,
    schema: ObraSchema,
    revalidatePath: '/dashboard/obras',
    redirectPath: '/dashboard/obras',
    logic: async (data) => {
      const company = await findCompany(subdomain);
      const strategy = creationStrategies[data.obraType];

      if (!strategy) {
        throw new Error(`Tipo de obra desconhecido: ${data.obraType}`);
      }

      await strategy(data, company.id, subdomain);
    },
  });
}

export async function updateObra(subdomain: string, prevState: FormState, formData: FormData) {
  return executeFormAction({
    formData,
    schema: UpdateObraSchema,
    revalidatePath: '/dashboard/obras',
    redirectPath: '/dashboard/obras',
    logic: async (data) => {
      const { id, dataInicio, dataPrevistaFim, ...rest } = data;
      const tenantPrisma = getTenantPrismaClient(subdomain);
      
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
  });
}