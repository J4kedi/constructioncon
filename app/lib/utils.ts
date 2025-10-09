import type { User } from 'next-auth';
import type { Obra } from '@prisma/client';
import type { PlainObra } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatObraForUI = (obra: Obra): PlainObra => {
  return {
    ...obra,
    orcamentoTotal: obra.orcamentoTotal.toNumber(),
    currentCost: obra.currentCost.toNumber(),
    dataInicio: new Date(obra.dataInicio).toLocaleDateString('pt-BR'),
    dataPrevistaFim: new Date(obra.dataPrevistaFim).toLocaleDateString('pt-BR'),
  };
};

export interface RequestContext {
  subdomain: string | null;
  tenantId: string | null;
  user: User | undefined;
}