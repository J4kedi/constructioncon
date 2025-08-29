import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main () {
    const args = process.argv.slice(2);

    if (args.length != 2) {
        console.error('Uso: ts-node scripts/provisionTenant.ts <NomeDoTenant> <subdominio>');
        process.exit(1);
    }

    const [name, subdomain] = args;
    const schemaName = `tenant_${subdomain.replace(/-/g, '-')}`;

    console.log(`Iniciando provisionamento para o tenant: ${name}`);
    console.log(`- Subdomínio: ${subdomain}`);
    console.log(`- Schema no DB ${schemaName}`);

    try {
        await prisma.$transaction(async (tx) => {
            const existingTenant = await tx.tenant.findFirst({
                where: { OR: [{ subdomain }, { schemaName }] },
            });

            if (existingTenant) {
                throw new Error(`Tenant com subdomínio '${subdomain}' ou schema '${schemaName}' já existe`);
            }

            const newTenant = await tx.tenant.create({
                data: {
                    name,
                    subdomain,
                    schemaName,
                },
            });
            console.log(`✅ Registro do tenant '${newTenant.name}' criado com sucesso.`);

            await tx.$executeRawUnsafe(`CREATE SCHEMA "${schemaName}";`);
            console.log(`✅ Schema '${schemaName}' criado no banco de dados.`);
        });

        console.log(`\n🚀 Provisionamento do tenant '${name}' concluído com sucesso!`);
    } catch (error) {
        console.error('❌ Erro durante o provisionamento do tenant:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
};

main();
