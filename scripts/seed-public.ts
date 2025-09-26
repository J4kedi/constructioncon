import { BaseScript } from './BaseScript.ts';
import { ALL_FEATURES } from '../app/lib/features.ts';

class SeedPublicScript extends BaseScript {
  protected getScriptName(): string {
    return "Seed do Schema Public (Features)";
  }

  protected async run(): Promise<void> {
    await this.prisma.feature.createMany({
      data: ALL_FEATURES,
      skipDuplicates: true,
    });
  }
}

const script = new SeedPublicScript();
script.execute();