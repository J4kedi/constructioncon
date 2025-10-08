import { BaseScript } from './BaseScript.ts';
import { runTenantSafeDeploy } from '../app/lib/migration-utils.ts';
import { UserRole } from '@prisma/client';
import { getTenantPrismaClient } from '../app/lib/prisma.ts';
import bcrypt from 'bcrypt';

const ADMIN_COMPANY_NAME = 'ConstructionCon Admin';
const ADMIN_SUBDOMAIN = 'admin';
const ADMIN_SCHEMA_NAME = `tenant_${ADMIN_SUBDOMAIN}`;
const ADMIN_EMAIL = 'admin@constructioncon.com';
const ADMIN_PASSWORD = 'superadmin123';

class SeedSuperAdminScript extends BaseScript {
  protected getScriptName(): string {
    return "Seed Super Admin";
  }

  protected async run(): Promise<void> {
    console.log(`--- Iniciando criação do ambiente do Super Admin ---`);

    const existingTenant = await this.prisma.tenant.findFirst({
      where: { OR: [{ subdomain: ADMIN_SUBDOMAIN }, { schemaName: ADMIN_SCHEMA_NAME }] },
    });

    if (existingTenant) {
      console.log('✅ Ambiente do Super Admin já existe. Nenhuma ação necessária.');
      return;
    }

    await this.createTenantRecord();

    console.log(`--- Aplicando migrações ao schema '${ADMIN_SCHEMA_NAME}' ---`);
    await runTenantSafeDeploy(ADMIN_SCHEMA_NAME);
    console.log('✅ Migrações aplicadas com sucesso.');

    await this.createAdminCompanyAndUser();

    console.log(`
🚀 Provisionamento do Super Admin concluído com sucesso!`);
    console.log(`   Email: ${ADMIN_EMAIL}`);
    console.log(`   Senha: ${ADMIN_PASSWORD}`);
  }

  private async createTenantRecord(): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      console.log('[1/2] Criando registro do tenant admin...');
      await tx.tenant.create({
        data: { name: ADMIN_COMPANY_NAME, subdomain: ADMIN_SUBDOMAIN, schemaName: ADMIN_SCHEMA_NAME },
      });
      console.log(`✅ Registro do tenant '${ADMIN_COMPANY_NAME}' criado.`);

      console.log(`[2/2] Criando schema '${ADMIN_SCHEMA_NAME}' no banco de dados...`);
      await tx.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${ADMIN_SCHEMA_NAME}";`);
      console.log(`✅ Schema criado.`);
    });
  }

  private async createAdminCompanyAndUser(): Promise<void> {
    console.log(`--- Populando o schema '${ADMIN_SCHEMA_NAME}' ---`);
    const tenantPrisma = getTenantPrismaClient(ADMIN_SUBDOMAIN);

    try {
      console.log('[1/2] Criando a empresa de administração...');
      const adminCompany = await tenantPrisma.company.create({
        data: {
          name: ADMIN_COMPANY_NAME,
        },
      });
      console.log(`✅ Empresa '${adminCompany.name}' criada.`);

      console.log('[2/2] Criando o usuário Super Admin...');
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      const superAdminUser = await tenantPrisma.user.create({
        data: {
          name: 'Super Admin',
          email: ADMIN_EMAIL,
          password: hashedPassword,
          role: UserRole.SUPER_ADMIN,
          companyId: adminCompany.id,
        },
      });
      console.log(`✅ Usuário '${superAdminUser.name}' criado com sucesso.`);
    } finally {
      await tenantPrisma.$disconnect();
    }
  }
}

const script = new SeedSuperAdminScript();
script.execute();
