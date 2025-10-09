import { BaseDataFetcher } from './BaseDataFetcher';
import { Prisma } from '@prisma/client';
import { ObraQueryBuilder } from './query/ObraQueryBuilder';

type ObraWithEtapas = Prisma.ObraGetPayload<{ include: { etapas: true } }>;

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
