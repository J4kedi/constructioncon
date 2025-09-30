import bcrypt from 'bcrypt';
import { getPublicPrismaClient, getTenantPrismaClient } from '../app/lib/prisma.ts';
import { UserRole } from '@prisma/client';

async function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1 || args[0].startsWith('--')) {
    console.error('Uso: pnpm ts-node scripts/seed-tenant.ts <subdominio>');
    process.exit(1);
  }
  const subdomain = args[0];

  console.log(`--- Iniciando seed de dados para o tenant: ${subdomain} ---`);

  const publicPrisma = getPublicPrismaClient();
  const tenantPrisma = getTenantPrismaClient(subdomain);

  try {
    console.log('Buscando informações do tenant no schema public...');
    const tenant = await publicPrisma.tenant.findUnique({
      where: { subdomain },
    });

    if (!tenant) {
      throw new Error(`Tenant com subdomínio '${subdomain}' não encontrado no schema public.`);
    }
    console.log(`✅ Tenant encontrado: ${tenant.name}`);

    const existingCompany = await tenantPrisma.company.findFirst();
    if (existingCompany) {
      console.log('⚠️ Seed para este tenant já foi executado. A empresa já existe. Encerrando.');
      return;
    }

    console.log('Criando dados essenciais no schema do tenant via transação...');
    const hashedPassword = await bcrypt.hash('Qwe123@@', 10);

    await tenantPrisma.$transaction(async (tx) => {
      const company = await tx.company.create({
        data: {
          name: tenant.name,
        },
      });
      console.log(`  -> 🏢 Empresa '${company.name}' criada.`);

      const adminUser = await tx.user.create({
        data: {
          name: 'Admin',
          email: 'admin@constructioncon.com',
          password: hashedPassword,
          role: UserRole.COMPANY_ADMIN,
          companyId: company.id,
        },
      });
      console.log(`  -> 👤 Usuário COMPANY_ADMIN '${adminUser.email}' criado.`);
    });

    console.log('\n🚀 Seed de dados essenciais para o tenant concluído com sucesso!');

  } catch (error) {
    console.error(`❌ Erro ao executar o seed para o tenant '${subdomain}':`, error);
    process.exit(1);
  } finally {
    await publicPrisma.$disconnect();
    await tenantPrisma.$disconnect();
    console.log('--- Conexões com o banco de dados encerradas ---');
  }
}

main();
