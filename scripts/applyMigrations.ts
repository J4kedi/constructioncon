import { BaseScript } from './BaseScript.ts';
import { DEFAULT_FEATURE_KEYS } from '../app/lib/features.ts';
import { runTenantSafeDeploy } from '../app/lib/migration-utils.ts';

class ApplyMigrationsScript extends BaseScript {
  protected getScriptName(): string {
    return "Aplicação de Migrações para Tenants Existentes";
  }

  protected async run(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany();

    if (tenants.length === 0) {
      console.log('Nenhum tenant encontrado. Encerrando...');
      return;
    }

    console.log(`Encontrados ${tenants.length} tenants para atualizar...`);

    for (const tenant of tenants) {
      try {
        console.log(`\n--------------------------------------------------------------------`);
        console.log(`PROCESSANDO TENANT: ${tenant.name} (${tenant.schemaName})`);
        console.log(`--------------------------------------------------------------------`);
        
        runTenantSafeDeploy(tenant.schemaName);

      } catch (error) {
        console.error(`❌ Falha ao processar o tenant ${tenant.name}:`, error);
      }
    }

    console.log('\n✅ Processo de migração para todos os tenants concluído.');
  }
}

const script = new ApplyMigrationsScript();
script.execute();