import { getPublicPrismaClient } from "../app/lib/prisma.ts";
import { execSync } from "child_process";

async function main() {
    const publicPrisma = getPublicPrismaClient();
    console.log('Buscando todos os tenants para resolver migrações...');

    const tenants = await publicPrisma.tenant.findMany();

    if (tenants.length === 0) {
        console.log('Nenhum tenant encontrado.');
        return;
    }

    console.log(`Encontrados ${tenants.length} tenants. Resolvendo migrações...`);

    const databaseUrlBase = process.env.DATABASE_URL;
    if (!databaseUrlBase) throw new Error('DATABASE_URL não definida.');

    const migrationName = '20250829165320_new_database'; // The failed migration

    for (const tenant of tenants) {
        const tenantDatabaseUrl = `${databaseUrlBase}?schema=${tenant.schemaName}`;
        try {
            console.log(`--- Resolvendo migração para o tenant: ${tenant.name} (${tenant.schemaName}) ---`);

            // Mark the failed migration as applied
            execSync(`npx prisma migrate resolve --applied ${migrationName}`, {
                stdio: 'inherit',
                env: {
                    ...process.env,
                    DATABASE_URL: tenantDatabaseUrl,
                },
            });

            console.log(`✅ Migração resolvida com sucesso para ${tenant.name}.`);
        } catch (error) {
            console.error(`❌ Falha ao resolver migração para ${tenant.name}:`, error);
        }
    }

    console.log('\n🚀 Processo de resolução de migrações concluído para todos os tenants.');
    await publicPrisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
