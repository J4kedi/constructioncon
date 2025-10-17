
'use client';

import { UserRole } from '@prisma/client';
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
