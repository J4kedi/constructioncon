import { execSync } from 'child_process';
import { BaseScript } from './BaseScript.ts';
import { DEFAULT_FEATURE_KEYS } from '../app/lib/features.ts';

class ApplyMigrationsScript extends BaseScript {
  protected getScriptName(): string {
    return "Aplicação de Migrações e Sincronização de Features para Tenants";
  }

  protected async run(): Promise<void> {
    const tenants = await this.prisma.tenant.findMany();

    if (tenants.length === 0) {
      console.log('Nenhum tenant encontrado. Encerrando...');
      return;
    }

    console.log(`Encontrados ${tenants.length} tenants...`);

    const databaseUrlBase = process.env.DATABASE_URL;
    if (!databaseUrlBase) {
      throw new Error('DATABASE_URL não definida.');
    }

    const defaultFeatures = await this.prisma.feature.findMany({
      where: { key: { in: DEFAULT_FEATURE_KEYS } },
      select: { id: true },
    });

    if (defaultFeatures.length !== DEFAULT_FEATURE_KEYS.length) {
      throw new Error('Nem todas as features padrão foram encontradas. Rode o seed-public primeiro.');
    }

    for (const tenant of tenants) {
      const tenantDatabaseUrl = `${databaseUrlBase}?schema=${tenant.schemaName}&search_path=${tenant.schemaName},public`;

      try {
        console.log(`\n--- Processando tenant: ${tenant.name} (${tenant.schemaName}) ---`);

        console.log(`[1/2] Aplicando migrações para ${tenant.name}...`);
        execSync(`pnpm prisma migrate deploy`, {
          stdio: 'inherit',
          env: {
            ...process.env,
            DATABASE_URL: tenantDatabaseUrl,
          },
        });
        console.log(`✅ Migrações aplicadas com sucesso para ${tenant.name}.`);

        console.log(`[2/2] Sincronizando features padrão para ${tenant.name}...`);
        await this.prisma.tenant.update({
          where: { id: tenant.id },
          data: {
            features: {
              connect: defaultFeatures.map((feature) => ({ id: feature.id })),
            },
          },
        });
        console.log(`✅ Features padrão sincronizadas para ${tenant.name}.`);
      } catch (error) {
        console.error(`❌ Falha ao processar o tenant ${tenant.name}:`, error);
      }
    }
  }
}

const script = new ApplyMigrationsScript();
script.execute();

