import { getPublicPrismaClient } from '../app/lib/prisma.ts';

const prisma = getPublicPrismaClient();

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error('Uso: ts-node scripts/deprovisionTenant.ts <subdominio>');
    process.exit(1);
  }

  const [subdomain] = args;
  console.log(`Iniciando deprovisionamento para o tenant com subdomínio: ${subdomain}`);

  try {
    // 1. Encontrar o tenant para obter o nome do schema
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain },
    });

    if (!tenant) {
      throw new Error(`Tenant com subdomínio '${subdomain}' não encontrado.`);
    }
    
    const { schemaName } = tenant;
    console.log(`- Schema a ser removido: ${schemaName}`);

    // 2. Usar transação para remover o registro e o schema
    await prisma.$transaction(async (tx) => {
      // 2.1 Apagar o registro do tenant na tabela `tenants`
      await tx.tenant.delete({
        where: { subdomain },
      });
      console.log(`✅ Registro do tenant '${subdomain}' removido da tabela public.tenants.`);

      // 2.2 Executar SQL raw para apagar o schema físico
      await tx.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`);
      console.log(`✅ Schema '${schemaName}' removido do banco de dados.`);
    });

    console.log(`\n🚀 Deprovisionamento do tenant '${subdomain}' concluído com sucesso!`);

  } catch (error) {
    console.error('❌ Erro durante o deprovisionamento do tenant:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();