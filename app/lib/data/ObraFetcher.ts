import { BaseDataFetcher } from './BaseDataFetcher';
import type { ObraWithEtapas } from '@/app/lib/definitions';
import { ObraQueryBuilder } from './query/ObraQueryBuilder';

export class ObraFetcher extends BaseDataFetcher<ObraWithEtapas> {
  constructor(subdomain: string) {
    super(subdomain);
  }

  protected getModelName(): string {
    return 'obra';
  }

  protected getQueryBuilder(): ObraQueryBuilder {
    return new ObraQueryBuilder();
  }

  protected getIncludeArgs(): object {
    return { include: { etapas: true } };
  }
}
