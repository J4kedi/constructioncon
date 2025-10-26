
'use client';

import { UserRole, StatusContaPagar, StatusContaReceber } from '@prisma/client';
import { Badge, badgeVariants } from '@/app/ui/components/Badge';
import { type VariantProps } from 'class-variance-authority';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

interface BadgeConfig {
    variant: BadgeVariant;
    label: string;
}

const badgeConfig = {
    role: (value: UserRole): BadgeConfig => {
        const roleVariantMap: Record<UserRole, BadgeVariant> = {
            USER: 'default',
            END_CUSTOMER: 'outline',
            COMPANY_ADMIN: 'secondary',
            SUPER_ADMIN: 'destructive',
        };
        return {
            variant: roleVariantMap[value] || 'outline',
            label: value.replace('_', ' ').toLowerCase(),
        };
    },
    stockLevel: (value: { quantity: number; minLevel: number }): BadgeConfig => {
        if (value.quantity === 0) {
            return { variant: 'destructive', label: 'Esgotado' };
        }
        if (value.quantity < value.minLevel) {
            return { variant: 'warning', label: 'Baixo' };
        }
        return { variant: 'success', label: 'OK' };
    },
    transactionType: (value: 'RECEITA' | 'DESPESA'): BadgeConfig => {
        const isIncome = value === 'RECEITA';
        return {
            variant: isIncome ? 'success' : 'destructive',
            label: isIncome ? 'Receita' : 'Despesa',
        };
    },
    contaStatus: (value: StatusContaPagar | StatusContaReceber): BadgeConfig => {
        const statusVariantMap: Record<StatusContaPagar | StatusContaReceber, BadgeVariant> = {
            PAGO: 'success',
            RECEBIDO: 'success',
            A_PAGAR: 'warning',
            A_RECEBER: 'warning',
            VENCIDO: 'destructive',
        };
        return {
            variant: statusVariantMap[value] || 'default',
            label: value.replace('_', ' '),
        };
    },
    documentType: (value: DocumentType): BadgeConfig => {
        const typeVariantMap: Record<DocumentType, BadgeVariant> = {
            PLANTA_BAIXA: 'default',
            ALVARA: 'default',
            ART: 'secondary',
            MEMORIAL_DESCRITIVO: 'outline',
            CONTRATO: 'secondary',
            NOTA_FISCAL_SERVICO: 'success',
            NOTA_FISCAL_PRODUTO: 'success',
            BOLETO: 'warning',
            OUTRO: 'outline',
        };
        return {
            variant: typeVariantMap[value] || 'outline',
            label: value.replace('_', ' '),
        };
    },
};

export type BadgeType = keyof typeof badgeConfig;

interface StatusBadgeProps<T extends BadgeType> {
    type: T;
    value: Parameters<typeof badgeConfig[T]>[0];
    className?: string;
}

export function StatusBadge<T extends BadgeType>({ type, value, className }: StatusBadgeProps<T>) {
    // @ts-ignore
    const { variant, label } = badgeConfig[type](value);

    return (
        <Badge variant={variant} className={className}>
            {label}
        </Badge>
    );
}
