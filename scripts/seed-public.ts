import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`Iniciando o seed do schema public...`);

    const featuresToCreate = [
        {
            key: 'dashboard-basic',
            name: 'Dashboard Básico',
            description: 'Acesso à visualização principal do dashboard.'
        },
        {
            key: 'projects-list-view',
            name: 'Listagem de Obras',
            description: 'Permite visualizar a lista de todas as obras da empresa.'
        },
        {
            key: 'advanced-reporting',
            name: 'Relatórios Avançados',
            description: 'Permite a exportação de relatórios financeiros detalhados.'
        },
        {
            key: 'project-timeline-view',
            name: 'Visualização de Linha do Tempo',
            description: 'Mostra um cronograma visual do andamento dos projetos.'
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