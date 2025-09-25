'use server';

import prisma from '@/app/lib/prisma';
import { ObraSchema, UpdateObraSchema } from '@/app/lib/definitions';
import { executeFormAction, FormState } from '@/app/lib/action-handler';
import { z } from 'zod';

type ObraData = z.infer<typeof ObraSchema>;

async function findCompany(subdomain: string) {
  const company = await prisma.company.findFirst({ where: { name: subdomain } });
  if (!company) {
    throw new Error(`Empresa não encontrada para o subdomínio: ${subdomain}`);
  }
  return company;
}

async function createResidencialObra(data: ObraData, companyId: string) {
  await prisma.obra.create({
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

async function createComercialObra(data: ObraData, companyId: string) {
  await prisma.obra.create({
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

const creationStrategies: Record<string, (data: ObraData, companyId: string) => Promise<void>> = {
  RESIDENCIAL: createResidencialObra,
  COMERCIAL: createComercialObra,
};

export async function createObra(subdomain: string, prevState: FormState, formData: FormData) {
  return executeFormAction({
    formData,
    schema: ObraSchema,
    redirectPath: '/dashboard/obras',
    logic: async (data) => {
      const company = await findCompany(subdomain);
      const strategy = creationStrategies[data.obraType];

      if (!strategy) {
        throw new Error(`Tipo de obra desconhecido: ${data.obraType}`);
      }

      await strategy(data, company.id);
    },
  });
}

export async function updateObra(prevState: FormState, formData: FormData) {
  return executeFormAction({
    formData,
    schema: UpdateObraSchema,
    redirectPath: '/dashboard/obras',
    logic: async (data) => {
      const { id, ...dataToUpdate } = data;
      await prisma.obra.update({
        where: { id },
        data: {
          ...dataToUpdate,
          orcamentoTotal: dataToUpdate.orcamentoTotal,
          dataInicio: dataToUpdate.dataInicio ? new Date(dataToUpdate.dataInicio) : undefined,
          dataPrevistaFim: dataToUpdate.dataPrevistaFim ? new Date(dataToUpdate.dataPrevistaFim) : undefined,
        },
      });
    },
  });
}