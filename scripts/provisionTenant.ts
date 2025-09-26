import { PrismaClient } from "@prisma/client";
import { execSync } from 'child_process';
import { DEFAULT_FEATURE_KEYS } from "./seed-public.ts";

const prisma = new PrismaClient();

async function main() {
    const args = process.argv.slice(2);

    if (args.length !== 2) {
        console.error('Uso: ts-node scripts/provisionTenant.ts <NomeDoTenant> <subdominio>');
        process.exit(1);
    }

    const [name, subdomain] = args;
    const schemaName = `tenant_${subdomain}`;

    console.log(`--- Iniciando provisionamento para o tenant: ${name} (${schemaName}) ---`);

    try {
        await prisma.$transaction(async (tx) => {
            console.log('[1/4] Verificando se o tenant já existe...');
            const existingTenant = await tx.tenant.findFirst({
                where: { OR: [{ subdomain }, { schemaName }] },
            });

            if (existingTenant) {
                throw new Error(`Tenant com subdomínio '${subdomain}' ou schema '${schemaName}' já existe.`);
            }
            console.log('✅ Verificação concluída.');

            console.log('[2/4] Criando registro do tenant...');
            const newTenant = await tx.tenant.create({
                data: { name, subdomain, schemaName },
            });
            console.log(`✅ Registro do tenant '${newTenant.name}' criado.`);

            console.log('[3/4] Associando features padrão...');
            await tx.tenant.update({
                where: { id: newTenant.id },
                data: {
                    features: {
                        connect: DEFAULT_FEATURE_KEYS.map(key => ({ key }))
                    }
                }
            });
            console.log(`✅ Features padrão associadas: ${DEFAULT_FEATURE_KEYS.join(', ')}`);

            console.log(`[4/4] Criando schema '${schemaName}' no banco de dados...`);
            await tx.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schemaName}";`);
            console.log(`✅ Schema criado.`);
        });
        console.log('\n--- Fase 1 concluída: Registro e schema criados com sucesso. ---');
    } catch (error) {
        console.error('❌ Erro durante a Fase 1 (criação do registro/schema):', error.message);
        process.exit(1);
    }

    console.log(`\n--- Iniciando Fase 2: Aplicando migrações ao schema '${schemaName}' ---`);
    const databaseUrlBase = process.env.DATABASE_URL;
    if (!databaseUrlBase) {
        console.error('❌ DATABASE_URL não definida no .env');
        process.exit(1);
    }

    const tenantDatabaseUrl = `${databaseUrlBase}?schema=${schemaName}&search_path=${schemaName},public`;

    try {
        execSync(`pnpm prisma migrate deploy`, {
            stdio: 'inherit',
            env: {
                ...process.env,
                DATABASE_URL: tenantDatabaseUrl,
            },
        });
        console.log(`✅ Migrações aplicadas com sucesso para o tenant '${name}'.`);
    } catch (error) {
        console.error(`❌ Falha crítica ao aplicar migrações para '${name}'.`);
        console.error('AVISO: O registro do tenant e o schema foram criados, mas as tabelas não. Investigue o erro acima e tente aplicar as migrações manualmente.');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }

    console.log(`\n🚀 Provisionamento completo do tenant '${name}' concluído com sucesso!`);
}

main();