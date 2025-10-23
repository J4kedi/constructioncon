
import type { Obra } from '@prisma/client';
import type { PlainObra } from './definitions';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";


export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return (amount).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (dateStr: string, p0: string) => {
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

export const formatDateForFeed = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  today.setHours(0, 0, 0, 0);
  yesterday.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  if (compareDate.getTime() === today.getTime()) {
    return 'Hoje';
  }

  if (compareDate.getTime() === yesterday.getTime()) {
    return 'Ontem';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'long',
  }).format(date);
};
