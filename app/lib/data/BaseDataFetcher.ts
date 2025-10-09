import { PrismaClient } from '@prisma/client';

interface ISearchableQueryBuilder {
  withSearch(query?: string): this;
  withPage(page: number): this;
  sortBy(sort?: string): this;
  build(): any;
}

export abstract class BaseDataFetcher<T> {
  protected prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  public async fetchPageData(searchParams: { [key: string]: string | undefined }) {
    const modelName = this.getModelName();

    if (!modelName || !(modelName in this.prisma)) {
      throw new Error(`Modelo inválido ou não encontrado no Prisma Client: ${modelName}`);
    }
    const dbModel = this.prisma[modelName as keyof PrismaClient];

    const queryArgs = await this.buildQueryArgs(searchParams);

    const [data, totalCount] = await this.prisma.$transaction([
      (dbModel as any).findMany(queryArgs),
      (dbModel as any).count({ where: queryArgs.where }),
    ]);

    const itemsPerPage = queryArgs.take ?? 10;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    return { data: data as T[], totalPages };
  }

  protected async buildQueryArgs(searchParams: { [key: string]: string | undefined }): Promise<any> {
    const resolvedSearchParams = await Promise.resolve(searchParams);
    const page = Number(resolvedSearchParams?.page) || 1;
    const query = resolvedSearchParams?.query;
    const sort = resolvedSearchParams?.sort;

    const builder = this.getQueryBuilder();
    const includeArgs = this.getIncludeArgs();

    const queryArgs = builder
      .withSearch(query)
      .withPage(page)
      .sortBy(sort)
      .build();

    return { ...queryArgs, ...includeArgs };
  }

  protected abstract getModelName(): string;
  protected abstract getQueryBuilder(): ISearchableQueryBuilder;
  protected abstract getIncludeArgs(): object;
}
