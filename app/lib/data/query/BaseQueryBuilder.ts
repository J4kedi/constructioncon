import { Prisma } from '@prisma/client';

export abstract class BasePrismaQueryBuilder<T extends { where?: any; orderBy?: any; skip?: number; take?: number }> {
    protected query: T;
    protected itemsPerPage: number;

    constructor(initialQuery: T, itemsPerPage: number = 10) {
        this.query = initialQuery;
        this.itemsPerPage = itemsPerPage;
    }

    withPage(page: number = 1): this {
        this.query.skip = (page - 1) * this.itemsPerPage;
        this.query.take = this.itemsPerPage;
        return this;
    }

    sortBy(sort?: string): this {
        if (sort) {
            const [field, order] = sort.split('-');
            if (field && order) {
                this.query.orderBy = { [field]: order };
            }
        }
        return this;
    }

    build(): T {
        return this.query;
    }

    abstract withSearch(query?: string): this;
}
