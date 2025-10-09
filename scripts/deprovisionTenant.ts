import { BaseScript } from './BaseScript.ts';

class DeprovisionTenantScript extends BaseScript {
  private subdomain: string | undefined;

  protected getScriptName(): string {
    return "Deprovisionamento de Tenant";
  }

  protected async run(): Promise<void> {
    this.parseArgs();
    if (!this.subdomain) return;

    console.log(`Iniciando deprovisionamento para o tenant com subdomínio: ${this.subdomain}`);

    const tenant = await this.prisma.tenant.findUnique({
      where: { subdomain: this.subdomain },
    });

    if (!tenant) {
      throw new Error(`Tenant com subdomínio '${this.subdomain}' não encontrado.`);
    }

    const { schemaName } = tenant;
    console.log(`- Schema a ser removido: ${schemaName}`);

    await this.prisma.$transaction(async (tx) => {
      await tx.tenant.delete({
        where: { subdomain: this.subdomain },
      });
      console.log(`✅ Registro do tenant '${this.subdomain}' removido da tabela public.tenants.`);

      await tx.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`);
      console.log(`✅ Schema '${schemaName}' removido do banco de dados.`);
    });

    console.log(`
🚀 Deprovisionamento do tenant '${this.subdomain}' concluído com sucesso!`);
  }

  private parseArgs(): void {
    const args = process.argv.slice(2);
    if (args.length !== 1 || args[0].startsWith('--')) {
      console.error('Uso: ts-node scripts/deprovisionTenant.ts <subdominio>');
      process.exit(1);
    }

    const subdomain = args[0];
    this.validateSubdomain(subdomain);

    this.subdomain = subdomain;
  }
}

const script = new DeprovisionTenantScript();
script.execute();
