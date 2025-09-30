import { BaseScript } from './BaseScript.ts';

class CleanupScript extends BaseScript {
  protected getScriptName(): string {
    return "Limpeza de Todos os Tenants e Schemas";
  }

  protected async run(): Promise<void> {
    const isForce = process.argv.includes('--force');

    if (!isForce) {
      console.warn(`
        ###################################################################################
        #                                                                                 #
        #  ATENÇÃO: Este é um script destrutivo que apagará TODOS os schemas de tenants.   #
        #                                                                                 #
        #  Para confirmar a execução, rode o comando com o argumento --force.             #
        #  Exemplo: ts-node scripts/cleanup.ts --force                                    #
        #                                                                                 #
        ###################################################################################
      `);
      return;
    }

    console.log('Iniciando limpeza forçada...');
    const tenants = await this.prisma.tenant.findMany();

    if (tenants.length > 0) {
      console.log(`Encontrados ${tenants.length} tenants para limpar.`);
      for (const tenant of tenants) {
        console.log(`- Apagando schema para o tenant: ${tenant.name} (${tenant.schemaName})`);
        await this.prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS \"${tenant.schemaName}\" CASCADE;`);
        console.log(`  Schema \"${tenant.schemaName}\" apagado.`);
      }

      console.log('Apagando todos os registros da tabela de tenants...');
      await this.prisma.tenant.deleteMany({});
      console.log('Registros de tenants apagados.');
    } else {
      console.log('Nenhum tenant encontrado para limpar.');
    }
  }
}

const script = new CleanupScript();
script.execute();