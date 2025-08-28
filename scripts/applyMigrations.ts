import { getPublicPrismaClient } from "@/app/lib/prisma";
import { execSync } from "child_process";

async function main () {
    const publicPrisma = getPublicPrismaClient();
    console.log('Buscando todos os tenants...');

    const tenants = await publicPrisma.tenant.findMany();

    if (tenants.length === 0) {
        console.log('Nenhum tenant encontrado. Encerradndo...');
        console.log('Encerrado.');
        return;
    }

    console.log(`Encontrados ${tenants.length} tenants. Aplicando migrações...`);

    const databaseUrlBase = process.env.DATABASE_URL;

    if (!databaseUrlBase) throw new Error('DATABASE_URL não definida.');

    for (const tenant of tenants) {
        const tenantDatabaseUrl = `${databaseUrlBase}?schema=${tenant.schemaName}`;

        try {
            console.log(`--- Aplicando migrações para o tenant: ${tenant.name} (${tenant.schemaName}) ---`);

            execSync(`DATABASE_URL="${tenantDatabaseUrl}" npx prisma migrate deploy`, {
                stdio: 'inherit',
            });

            console.log(`✅ Migrações aplicadas com sucesso para ${tenant.name}.`);
        } catch (error) {
            console.error(`❌ Falha ao aplicar migrações para ${tenant.name}:`, error);
        }
    }

    console.log('\n🚀 Processo de migração concluído para todos os tenants.');
    await publicPrisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});