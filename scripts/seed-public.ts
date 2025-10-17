import { BaseScript } from './BaseScript.ts';
import { ALL_FEATURES } from '../app/lib/features.ts';

class SeedPublicScript extends BaseScript {
  protected getScriptName(): string {
    return "Seed do Schema Public (Features)";
  }

  protected async run(): Promise<void> {
    for (const feature of ALL_FEATURES) {
      await this.prisma.feature.upsert({
        where: { key: feature.key },
        update: feature,
        create: feature,
      });
    }
  }
}

const script = new SeedPublicScript();
script.execute();