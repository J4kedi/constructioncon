import { Prisma } from '@prisma/client';
import { BasePrismaQueryBuilder } from './BaseQueryBuilder';

export class EstoqueQueryBuilder extends BasePrismaQueryBuilder<Prisma.CatalogoItemFindManyArgs> {
    constructor() {
        super({}, 8);
        this.query.where = { AND: [] };
        this.query.orderBy = { nome: 'asc' };
    }

    withSearch(query?: string) {
        if (query) {
            (this.query.where.AND as Prisma.CatalogoItemWhereInput[]).push({
                OR: [
                    { nome: { contains: query, mode: 'insensitive' } },
                    { categoria: { contains: query, mode: 'insensitive' } },
                ]
            });
        }
        return this;
    }
}
