import { Prisma } from '@prisma/client';
import { BasePrismaQueryBuilder } from './BaseQueryBuilder';

export class DocumentoQueryBuilder extends BasePrismaQueryBuilder<Prisma.DocumentFindManyArgs> {
  constructor() {
    super({ where: { AND: [] } });
    this.query.orderBy = { uploadedAt: 'desc' };
  }

  withSearch(query?: string) {
    if (query) {
      (this.query.where.AND as Prisma.DocumentWhereInput[]).push({
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { obra: { nome: { contains: query, mode: 'insensitive' } } },
          { contaPagar: { supplier: { name: { contains: query, mode: 'insensitive' } } } },
          { contaReceber: { cliente: { contains: query, mode: 'insensitive' } } },
        ]
      });
    }
    return this;
  }
}
