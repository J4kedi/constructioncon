import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const DEFAULT_FEATURE_KEYS = [
    'dashboard-basic',
    'works-management',
    'financial-view',
    'user-management',
    'inventory-management',
];

async function main() {
    console.log(`Iniciando o seed do schema public...`);

    const featuresToCreate = [
        {
            key: 'dashboard-basic',
            name: 'Acompanhamento',
            description: 'Acesso à visualização de Acompanhamento.'
        },
        {
            key: 'works-management',
            name: 'Obras',
            description: 'Permite criar e gerenciar obras/projetos.'
        },
        {
            key: 'financial-view',
            name: 'Financeiro',
            description: 'Acesso ao dashboard Financeiro.'
        },
        {
            key: 'user-management',
            name: 'Usuários',
            description: 'Permite gerenciar os usuários da empresa.'
        },
        {
            key: 'inventory-management',
            name: 'Estoque',
            description: 'Acesso ao controle de estoque.'
        },
        {
            key: 'advanced-reporting',
            name: 'Relatórios',
            description: 'Permite a exportação de relatórios detalhados.'
        }
    ];

    await prisma.feature.createMany({
        data: featuresToCreate,
        skipDuplicates: true, 
    });

    console.log(`✅ Seed do schema public concluído. ${featuresToCreate.length} features garantidas.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

export {};
