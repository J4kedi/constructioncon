import { getPublicPrismaClient } from '../app/lib/prisma.ts';
import { PrismaClient } from '@prisma/client';

export abstract class BaseScript {
  protected prisma: PrismaClient;

  constructor() {
    this.prisma = getPublicPrismaClient();
  }

  protected validateSubdomain(subdomain: string): void {
    const subdomainRegex = /^[a-z0-9-]+$/;
    if (!subdomainRegex.test(subdomain)) {
      console.error('Erro: O subdomínio fornecido é inválido.');
      console.error('O subdomínio deve conter apenas letras minúsculas, números e hífens (ex: minha-construtora).');
      process.exit(1);
    }
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
