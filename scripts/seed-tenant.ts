import bcrypt from 'bcrypt';
import { getTenantPrismaClient } from '../app/lib/prisma.ts';
import { UserRole, UnidadeMedida, PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { BaseScript } from './BaseScript.ts';

class SeedTenantScript extends BaseScript {
  private subdomain: string | undefined;
  private tenantPrisma: PrismaClient | undefined;

  protected getScriptName(): string {
    return "Seed de Dados do Tenant";
  }

  private parseArgs(): void {
    const args = process.argv.slice(2);
    if (args.length !== 1 || args[0].startsWith('--')) {
      console.error('Uso: pnpm ts-node scripts/seed-tenant.ts <subdominio>');
      process.exit(1);
    }
    
    const subdomain = args[0];
    this.validateSubdomain(subdomain);

    this.subdomain = subdomain;
  }

  protected async run(): Promise<void> {
    this.parseArgs();
    if (!this.subdomain) return;

    console.log(`--- Iniciando seed de dados para o tenant: ${this.subdomain} ---`);

    this.tenantPrisma = getTenantPrismaClient(this.subdomain);

    try {
      console.log('Buscando informações do tenant no schema public...');
      const tenant = await this.prisma.tenant.findUnique({
        where: { subdomain: this.subdomain },
      });

      if (!tenant) {
        throw new Error(`Tenant com subdomínio '${this.subdomain}' não encontrado no schema public.`);
      }
      console.log(`✅ Tenant encontrado: ${tenant.name}`);

      const existingCompany = await this.tenantPrisma.company.findFirst();
      if (existingCompany) {
        console.log('⚠️ Seed para este tenant já foi executado. A empresa já existe. Encerrando.');
        return;
      }

      console.log('Criando dados essenciais no schema do tenant via transação...');
      const hashedPassword = await bcrypt.hash('Qwe123@@', 10);

      await this.tenantPrisma.$transaction(async (tx) => {
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

        console.log('  -> 📦 Criando itens de exemplo no catálogo...');
        await tx.catalogoItem.createMany({
          data: [
            {
              nome: 'Cimento Portland CP II 50kg',
              unidade: UnidadeMedida.UN,
              categoria: 'Materiais Básicos',
              custoUnitario: new Decimal(35.50),
              companyId: company.id,
            },
            {
              nome: 'Vergalhão de Aço CA-50 10mm (Barra 12m)',
              unidade: UnidadeMedida.UN,
              categoria: 'Aço',
              custoUnitario: new Decimal(52.00),
              companyId: company.id,
            },
            {
              nome: 'Areia Média (Metro Cúbico)',
              unidade: UnidadeMedida.M3,
              categoria: 'Agregados',
              custoUnitario: new Decimal(100.00),
              companyId: company.id,
            },
          ],
        });
        console.log('  -> ✅ 3 itens de catálogo criados.');
      });

      console.log('🚀 Seed de dados essenciais para o tenant concluído com sucesso!');

    } finally {
      if (this.tenantPrisma) {
        await this.tenantPrisma.$disconnect();
        console.log('--- Conexão com o banco de dados do tenant encerrada ---');
      }
    }
  }
}

const script = new SeedTenantScript();
script.execute();