import { BaseDataFetcher } from './BaseDataFetcher';
import { Prisma } from '@prisma/client';
import { ObraQueryBuilder } from './query/ObraQueryBuilder';

type ObraWithEtapas = Prisma.ObraGetPayload<{ include: { etapas: true } }>;

export class ObraFetcher extends BaseDataFetcher<ObraWithEtapas> {
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
