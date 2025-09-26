import { PrismaClient } from '@prisma/client';

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

    const queryArgs = this.buildQueryArgs(searchParams);

    const [data, totalCount] = await this.prisma.$transaction([
      (dbModel as any).findMany(queryArgs),
      (dbModel as any).count({ where: queryArgs.where }),
    ]);

    const itemsPerPage = queryArgs.take ?? 10;
    const totalPages = Math.ceil(totalCount / itemsPerPage);
    return { data: data as T[], totalPages };
  }

  protected abstract getModelName(): string;
  protected abstract buildQueryArgs(searchParams: { [key: string]: string | undefined }): any;
}
