
import type { Obra } from '@prisma/client';
import type { PlainObra } from './definitions';

export const formatCurrency = (amount: number) => {
  return (amount).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
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
