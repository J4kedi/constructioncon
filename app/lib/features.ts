
export const ALL_FEATURES = [
    {
        key: 'dashboard-basic',
        name: 'Acompanhamento',
        description: 'Acesso à visualização de Acompanhamento.',
        href: '/dashboard',
        icon: 'BarChart3',
    },
    {
        key: 'works-management',
        name: 'Obras',
        description: 'Permite criar e gerenciar obras/projetos.',
        href: '/dashboard/obras',
        icon: 'HardHat',
    },
    {
        key: 'financial-view',
        name: 'Financeiro',
        description: 'Acesso ao dashboard Financeiro.',
        href: '/dashboard/financeiro',
        icon: 'Wallet',
    },
    {
        key: 'user-management',
        name: 'Usuários',
        description: 'Permite gerenciar os usuários da empresa.',
        href: '/dashboard/users',
        icon: 'Users',
    },
    {
        key: 'inventory-management',
        name: 'Estoque',
        description: 'Acesso ao controle de estoque.',
        href: '/dashboard/estoque',
        icon: 'Warehouse',
    },
    {
        key: 'advanced-reporting',
        name: 'Relatórios',
        description: 'Permite a exportação de relatórios detalhados.',
        href: '/dashboard/relatorios',
        icon: 'FileText',
    }
];

export const DEFAULT_FEATURE_KEYS = [
    'dashboard-basic',
    'works-management',
    'financial-view',
    'user-management',
    'inventory-management',
];
