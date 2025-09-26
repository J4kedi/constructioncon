import { Prisma, StatusObra } from '@prisma/client';

type PrismaQueryArgs = {
    where?: object;
    orderBy?: object | object[];
    take?: number;
    skip?: number;
};

class BasePrismaQueryBuilder<T extends PrismaQueryArgs> {
    protected query: T;
    protected itemsPerPage: number;

    constructor(initialQuery: Partial<T>, itemsPerPage: number = 10) {
        this.itemsPerPage = itemsPerPage;
        this.query = {
            ...initialQuery,
            where: initialQuery.where ?? {},
            orderBy: initialQuery.orderBy ?? { dataInicio: 'desc' },
            take: this.itemsPerPage,
            skip: initialQuery.skip ?? 0,
        } as T;
    }

    sortBy(field?: string): this {
        if (field) {
            const [fieldName, direction] = field.split(':');
            const dir = direction === 'desc' ? 'desc' : 'asc';
            this.query.orderBy = { [fieldName]: dir } as T['orderBy'];
        }
        return this;
    }

    withPage(page: number = 1): this {
        this.query.skip = (page - 1) * this.itemsPerPage;
        return this;
    }

    build(): T {
        return this.query;
    }
}

export class ObraQueryBuilder extends BasePrismaQueryBuilder<Prisma.ObraFindManyArgs> {
    constructor() {
        super({}, 8);
        this.query.where = { AND: [] };
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
