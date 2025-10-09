import type { User } from 'next-auth';

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

export interface RequestContext {
  subdomain: string | null;
  tenantId: string | null;
  user: User | undefined;
}