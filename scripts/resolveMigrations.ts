import { execSync } from 'child_process';
import { BaseScript } from './BaseScript.ts';

class ResolveMigrationsScript extends BaseScript {
  private migrationName: string | undefined;

  protected getScriptName(): string {
    return "Resolução de Migração com Falha para Tenants";
  }

  protected async run(): Promise<void> {
    this.parseArgs();
    if (!this.migrationName) return;

    const tenants = await this.prisma.tenant.findMany();

    if (tenants.length === 0) {
      console.log('Nenhum tenant encontrado. Encerrando...');
      return;
    }

    console.log(`Encontrados ${tenants.length} tenants. Resolvendo migração '${this.migrationName}' para todos...`);

    const databaseUrlBase = process.env.DATABASE_URL;
    if (!databaseUrlBase) {
      throw new Error('DATABASE_URL não definida no .env');
    }

    for (const tenant of tenants) {
      const tenantDatabaseUrl = `${databaseUrlBase}?schema=${tenant.schemaName}`;
      try {
        console.log(`--- Resolvendo para o tenant: ${tenant.name} (${tenant.schemaName}) ---`);

        execSync(`pnpm prisma migrate resolve --applied ${this.migrationName}`,
          {
            stdio: 'inherit',
            env: {
              ...process.env,
              DATABASE_URL: tenantDatabaseUrl,
            },
          },
        );

        console.log(`✅ Migração resolvida com sucesso para ${tenant.name}.`);
      } catch (error) {
        console.error(`❌ Falha ao resolver migração para ${tenant.name}:`, error);
      }
    }
  }

  private parseArgs(): void {
    const args = process.argv.slice(2);
    if (args.length !== 1 || args[0].startsWith('--')) {
      console.error('Uso: ts-node scripts/resolveMigrations.ts <nome-da-migracao>');
      console.error('Exemplo: ts-node scripts/resolveMigrations.ts 20250829165320_new_database');
      process.exit(1);
    }
    this.migrationName = args[0];
  }
}

const script = new ResolveMigrationsScript();
script.execute();