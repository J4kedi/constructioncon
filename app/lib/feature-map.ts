import {
    BarChart3,
    Wallet,
    Users,
    Warehouse,
    FileText,
    HardHat,
    LucideIcon,
} from 'lucide-react';

export type FeatureUI = {
    icon: LucideIcon;
    href: string;
};

export const FEATURE_UI_MAP: Record<string, FeatureUI> = {
    'dashboard-basic': {
        icon: BarChart3,
        href: '/dashboard',
    },
    'works-management': {
        icon: HardHat,
        href: '/dashboard/obras',
    },
    'financial-view': {
        icon: Wallet,
        href: '/dashboard/financeiro',
    },
    'user-management': {
        icon: Users,
        href: '/dashboard/users',
    },
    'inventory-management': {
        icon: Warehouse,
        href: '/dashboard/estoque',
    },
    'advanced-reporting': {
        icon: FileText,
        href: '/dashboard/relatorios',
    },
};
