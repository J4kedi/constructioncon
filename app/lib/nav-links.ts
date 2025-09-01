import { 
    BarChart3, 
    Wallet, 
    Users, 
    Warehouse, 
    FileText, 
} from 'lucide-react';

export const ALL_NAV_LINKS = [
  {
    name: 'Acompanhamento',
    href: '/dashboard/',
    icon: BarChart3,
    featureKey: 'dashboard-basic',
  },
  {
    name: 'Financeiro',
    href: '/dashboard/financeiro',
    icon: Wallet,
    featureKey: 'financial-view',
  },
  {
    name: 'Usuários',
    href: '/dashboard/users',
    icon: Users,
    featureKey: 'user-management',
  },
  {
    name: 'Estoque',
    href: '/dashboard/estoque',
    icon: Warehouse,
    featureKey: 'inventory-management',
  },
  {
    name: 'Relatórios',
    href: '/dashboard/relatorios',
    icon: FileText,
    featureKey: 'advanced-reporting',
  },
];
