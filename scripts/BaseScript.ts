import { getPublicPrismaClient } from '../app/lib/prisma';
import { PrismaClient } from '@prisma/client';

export abstract class BaseScript {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = getPublicPrismaClient();
  }

  public async execute(): Promise<void> {
    try {
      console.log(`--- Iniciando ${this.getScriptName()} ---`);
      await this.run();
      console.log(`✅ ${this.getScriptName()} concluído com sucesso.`);
    } catch (error) {
      console.error(`❌ Erro ao executar ${this.getScriptName()}:`, error);
      process.exit(1);
    } finally {
      await this.prisma.$disconnect();
      console.log("--- Conexão com o banco de dados encerrada ---");
    }
  }

  protected abstract getScriptName(): string;
  protected abstract run(): Promise<void>;
}
