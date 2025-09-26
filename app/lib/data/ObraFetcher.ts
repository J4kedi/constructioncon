import { BaseDataFetcher } from './BaseDataFetcher';
import { ObraQueryBuilder } from '../obraQueryBuilder';
import { Prisma } from '@prisma/client';

type ObraWithEtapas = Prisma.ObraGetPayload<{ include: { etapas: true } }>;

export class ObraFetcher extends BaseDataFetcher<ObraWithEtapas> {
  protected getModelName(): string {
    return 'obra';
  }

  protected buildQueryArgs(searchParams: { [key: string]: string | undefined }): any {
    const page = Number(searchParams?.page) || 1;
    const query = searchParams?.query;
    const sort = searchParams?.sort;

    const obraQueryBuilder = new ObraQueryBuilder();

    const queryArgs = obraQueryBuilder
      .withSearch(query)
      .withPage(page)
      .sortBy(sort)
      .build();
      
    queryArgs.include = { etapas: true };

    return queryArgs;
  }
}
