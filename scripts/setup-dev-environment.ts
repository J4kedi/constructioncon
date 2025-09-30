import { execSync } from 'child_process';

// Função auxiliar para pausas
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('🚀 Iniciando a configuração completa do ambiente de desenvolvimento...');

  try {
    // Etapa 1: Iniciar os contêineres Docker
    console.log('\n--- Etapa 1: Iniciando o Docker Compose... ---');
    execSync('docker-compose up -d', { stdio: 'inherit' });
    console.log('✅ Contêineres do Docker iniciados em background.');

    // Etapa 2: Aguardar o banco de dados ficar pronto
    const waitTime = 20; // segundos
    console.log(`\n--- Etapa 2: Aguardando ${waitTime} segundos para o banco de dados iniciar... ---`);
    await sleep(waitTime * 1000);
    console.log('✅ Tempo de espera concluído.');

    // Etapa 3: Resetar o banco de dados para um estado limpo
    console.log('\n--- Etapa 3: Resetando o banco de dados... ---');
    execSync('pnpm prisma migrate reset --force', { stdio: 'inherit' });
    console.log('✅ Banco de dados resetado com sucesso.');

    // Etapa 4: Executar o seed completo do ambiente de demonstração
    console.log('\n--- Etapa 4: Executando o seed do ambiente de demonstração... ---');
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
