import { BaseScript } from './BaseScript.ts';
import { DEFAULT_FEATURE_KEYS } from '../app/lib/features.ts';
import { runTenantSafeDeploy } from '../app/lib/migration-utils.ts';

class ProvisionTenantScript extends BaseScript {
  private name: string | undefined;
  private subdomain: string | undefined;
  private schemaName: string | undefined;

  protected getScriptName(): string {
    return "Provisionamento de Novo Tenant";
  }

  protected async run(): Promise<void> {
    this.parseArgs();
    if (!this.name || !this.subdomain || !this.schemaName) return;

    // --- Fase 1: Registro no Banco de Dados ---
    console.log(`--- Iniciando Fase 1: Registro para o tenant: ${this.name} (${this.schemaName}) ---`);
    await this.createTenantRecord();
    console.log('--- Fase 1 concluída: Registro e schema criados com sucesso. ---');

    // --- Fase 2: Migrações do Schema ---
    runTenantSafeDeploy(this.schemaName);

    console.log(`
🚀 Provisionamento completo do tenant '${this.name}' concluído com sucesso!`);
  }

  private async createTenantRecord(): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      console.log('[1/4] Verificando se o tenant já existe...');
      const existingTenant = await tx.tenant.findFirst({
        where: { OR: [{ subdomain: this.subdomain }, { schemaName: this.schemaName }] },
      });

      if (existingTenant) {
        throw new Error(`Tenant com subdomínio '${this.subdomain}' ou schema '${this.schemaName}' já existe.`);
      }
      console.log('✅ Verificação concluída.');

      console.log('[2/4] Criando registro do tenant...');
      const newTenant = await tx.tenant.create({
        data: { name: this.name!, subdomain: this.subdomain!, schemaName: this.schemaName! },
      });
      console.log(`✅ Registro do tenant '${newTenant.name}' criado.`);

      console.log('[3/4] Associando features padrão...');
      const featuresToConnect = await this.prisma.feature.findMany({
        where: { key: { in: DEFAULT_FEATURE_KEYS } },
        select: { id: true },
      });

      if (featuresToConnect.length !== DEFAULT_FEATURE_KEYS.length) {
        throw new Error('Nem todas as features padrão foram encontradas no schema public. Rode o seed-public primeiro.');
      }

      await tx.tenant.update({
        where: { id: newTenant.id },
        data: { features: { connect: featuresToConnect.map(f => ({ id: f.id })) } },
      });
      console.log(`✅ Features padrão associadas: ${DEFAULT_FEATURE_KEYS.join(', ')}`);

      console.log(`[4/4] Criando schema '${this.schemaName}' no banco de dados...`);
      await tx.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${this.schemaName}";`);
      console.log(`✅ Schema criado.`);
    });
  }

  private parseArgs(): void {
    const args = process.argv.slice(2);
    if (args.length !== 2 || args.some(arg => arg.startsWith('--'))) {
      console.error('Uso: ts-node scripts/provisionTenant.ts <NomeDoTenant> <subdominio>');
      console.error('Exemplo: ts-node scripts/provisionTenant.ts "Minha Construtora" minha-construtora');
      process.exit(1);
    }
    this.name = args[0];
    this.subdomain = args[1];
    this.schemaName = `tenant_${this.subdomain}`;
  }
}

const script = new ProvisionTenantScript();
script.execute();