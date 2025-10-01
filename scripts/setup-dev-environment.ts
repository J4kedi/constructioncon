import { execSync } from 'child_process';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  const args = process.argv.slice(2);
  const isForce = args.includes('--force');

  if (!isForce) {
    console.warn(`
      ###################################################################################
      #                                                                                 #
      #  ATENÇÃO: Este script destruirá e recriará completamente o banco de dados.      #
      #                                                                                 #
      #  Para confirmar a execução, rode o comando com o argumento --force.             #
      #  Exemplo: pnpm run setup:dev -- --force                                         #
      #                                                                                 #
      ###################################################################################
    `);
    return;
  }

  console.log('🚀 Iniciando a configuração completa do ambiente de desenvolvimento (modo forçado)...');

  try {
    console.log('\n--- Etapa 1: Destruindo ambiente Docker existente (incluindo volumes)... ---');
    execSync('docker-compose down -v', { stdio: 'inherit' });
    console.log('✅ Ambiente Docker anterior destruído.');

    console.log('\n--- Etapa 2: Iniciando um novo ambiente Docker... ---');
    execSync('docker-compose up -d', { stdio: 'inherit' });
    console.log('✅ Contêineres do Docker iniciados em background.');

    const waitTime = 20;
    console.log(`\n--- Etapa 3: Aguardando ${waitTime} segundos para o banco de dados iniciar... ---`);
    await sleep(waitTime * 1000);
    console.log('✅ Tempo de espera concluído.');

    console.log('\n--- Etapa 4: Resetando o schema public... ---');
    execSync('pnpm prisma migrate reset --force', {
      stdio: 'inherit',
      env: {
        ...process.env,
        PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION: 'yes',
      },
    });
    console.log('✅ Banco de dados resetado com sucesso.');

    console.log('\n--- Etapa 5: Executando o seed do ambiente de demonstração... ---');
    execSync('pnpm run db:seed:demo', { stdio: 'inherit' });
    console.log('✅ Seed de demonstração concluído.');

    console.log('\n🎉 Ambiente de desenvolvimento configurado com sucesso! 🎉');
    console.log('Você pode agora iniciar a aplicação com: pnpm run dev');

  } catch (error) {
    console.error('\n❌ Ocorreu um erro durante a configuração do ambiente:', error);
    process.exit(1);
  }
}

main();