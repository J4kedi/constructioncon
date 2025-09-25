import { getPublicPrismaClient } from "../app/lib/prisma.ts";
import { execSync } from "child_process";
import { DEFAULT_FEATURE_KEYS } from "./seed-public.ts";

async function main() {
    const publicPrisma = getPublicPrismaClient();
    console.log('Buscando todos os tenants...');

    const tenants = await publicPrisma.tenant.findMany();

    if (tenants.length === 0) {
        console.log('Nenhum tenant encontrado. Encerrando...');
        return;
    }

    console.log(`Encontrados ${tenants.length} tenants. Aplicando migrações e sincronizando features...`);

    const databaseUrlBase = process.env.DATABASE_URL;
    if (!databaseUrlBase) throw new Error('DATABASE_URL não definida.');

    // Busca as features padrão uma única vez
    const defaultFeatures = await publicPrisma.feature.findMany({
        where: { key: { in: DEFAULT_FEATURE_KEYS } },
        select: { id: true }
    });

    if (defaultFeatures.length !== DEFAULT_FEATURE_KEYS.length) {
        console.error('❌ Erro: Nem todas as features padrão foram encontradas no banco de dados. Rode o seed-public primeiro.');
        process.exit(1);
    }

    for (const tenant of tenants) {
        const tenantDatabaseUrl = `${databaseUrlBase}?schema=${tenant.schemaName}&search_path=${tenant.schemaName},public`;

        try {
            console.log(`\n--- Processando tenant: ${tenant.name} (${tenant.schemaName}) ---`);

            // 1. Aplicar Migrações
            console.log(`[1/2] Aplicando migrações para ${tenant.name}...`);
            execSync(`pnpm prisma migrate deploy`, {
                stdio: 'inherit',
                env: {
                    ...process.env,
                    DATABASE_URL: tenantDatabaseUrl,
                },
            });
            console.log(`✅ Migrações aplicadas com sucesso para ${tenant.name}.`);

            // 2. Sincronizar Features Padrão
            console.log(`[2/2] Sincronizando features padrão para ${tenant.name}...`);
            await publicPrisma.tenant.update({
                where: { id: tenant.id },
                data: {
                    features: {
                        connect: defaultFeatures.map(feature => ({ id: feature.id }))
                    }
                }
            });
            console.log(`✅ Features padrão sincronizadas para ${tenant.name}.`);

        } catch (error) {
            console.error(`❌ Falha ao processar o tenant ${tenant.name}:`, error);
        }
    }

    console.log('\n🚀 Processo de migração e sincronização concluído para todos os tenants.');
    await publicPrisma.$disconnect();
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});
