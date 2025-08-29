import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`Iniciando o seed do schema public...`);

    const featuresToCreate = [
        {
            key: 'dashboard-basic',
            name: 'Dashboard Básico',
            description: 'Acesso à visualização de Acompanhamento.'
        },
        {
            key: 'financial-view',
            name: 'Visualização Financeira',
            description: 'Acesso ao dashboard Financeiro.'
        },
        {
            key: 'user-management',
            name: 'Gerenciamento de Usuários',
            description: 'Permite gerenciar os usuários da empresa.'
        },
        {
            key: 'inventory-management',
            name: 'Gerenciamento de Estoque',
            description: 'Acesso ao controle de estoque.'
        },
        {
            key: 'advanced-reporting',
            name: 'Relatórios Avançados',
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
