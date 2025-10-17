import type { PrismaQueryArgs } from '@/app/lib/definitions';

export class BasePrismaQueryBuilder<T extends PrismaQueryArgs> {
    protected query: T;
    protected itemsPerPage: number;

    constructor(initialQuery: Partial<T>, itemsPerPage: number = 10) {
        this.itemsPerPage = itemsPerPage;
        this.query = {
            ...initialQuery,
            where: initialQuery.where ?? {},
            orderBy: initialQuery.orderBy,
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

    buildWhere() {
        return this.query.where;
    }
}
