import { Prisma, StatusObra } from '@prisma/client';
import { BasePrismaQueryBuilder } from './BaseQueryBuilder';

export class ObraQueryBuilder extends BasePrismaQueryBuilder<Prisma.ObraFindManyArgs> {
    constructor() {
        super({}, 8);
        this.query.where = { AND: [] };
        this.query.orderBy = { dataInicio: 'desc' };
    }

    withSearch(query?: string): this {
        if (query) {
            (this.query.where.AND as Prisma.ObraWhereInput[]).push({
                OR: [
                    { nome: { contains: query, mode: 'insensitive' } },
                    { endCustomerName: { contains: query, mode: 'insensitive' } },
                    { address: { contains: query, mode: 'insensitive' } },
                ]
            });
        }
        return this;
    }

    withStatus(statuses?: StatusObra[]): this {
        if (statuses && statuses.length > 0) {
            (this.query.where.AND as Prisma.ObraWhereInput[]).push({
                status: { in: statuses }
            });
        }
        return this;
    }
}
