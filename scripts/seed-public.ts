import { BaseScript } from './BaseScript.ts';
import { ALL_FEATURES } from '../app/lib/features.ts';

class SeedPublicScript extends BaseScript {
  protected getScriptName(): string {
    return "Seed do Schema Public (Features)";
  }

  protected async run(): Promise<void> {
    console.log('Iniciando a primeira passagem: garantindo que todas as features existam...');
    for (const feature of ALL_FEATURES) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { parentKey, ...featureData } = feature as any;
      await this.prisma.feature.upsert({
        where: { key: featureData.key },
        update: featureData,
        create: featureData,
      });
    }
    console.log('Primeira passagem concluída.');

    console.log('Iniciando a segunda passagem: estabelecendo hierarquia...');
    for (const feature of ALL_FEATURES) {
      if ((feature as any).parentKey) {
        const parentFeature = await this.prisma.feature.findUnique({
          where: { key: (feature as any).parentKey },
        });

        if (parentFeature) {
          await this.prisma.feature.update({
            where: { key: feature.key },
            data: { parentId: parentFeature.id },
          });
          console.log(`  - Relação estabelecida: ${feature.name} -> ${parentFeature.name}`);
        } else {
          console.log(`  - AVISO: Feature pai com a chave "${(feature as any).parentKey}" não encontrada para a feature "${feature.name}".`);
        }
      }
    }
    console.log('Segunda passagem concluída. Hierarquia de features configurada.');
  }
}

const script = new SeedPublicScript();
script.execute();