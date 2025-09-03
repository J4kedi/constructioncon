

export class PrismaQueryBuilder {
    private query: { where: any; orderBy: any; take: number; skip: number; };

    constructor() {
        this.query = {
            where: {},
            orderBy: {},
            take: 10,
            skip: 0,
        };
    }

    withName(name?: string) {
        if (name) this.query.where.name = { contains: name, mode: 'insensitive' };
        return this;
    }

    withStatus(status?: string) {
        if (status) this.query.where.status = status;
        return this;
    }

    createdAfter(date?: Date) {
        if (date) this.query.where.createdAt = { gte: date };
        return this;
    }

    sortBy(field?: string) {
        if (field) this.query.orderBy[field] = 'asc';
        return this;
    }

    withPage(page: number = 1) {
        this.query.skip = (page - 1) * this.query.take;
        return this;
    }

    build() {
        return this.query;
    }
}