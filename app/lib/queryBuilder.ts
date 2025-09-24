import { Prisma, UserRole } from '@prisma/client';

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
            orderBy: initialQuery.orderBy ?? { createdAt: 'desc' },
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

    buildWhere(): Prisma.UserWhereInput {
        return this.query.where as Prisma.UserWhereInput;
    }
}

export class UserQueryBuilder extends BasePrismaQueryBuilder<Prisma.UserFindManyArgs> {
    constructor() {
        super({}, 8);
        this.query.where = { AND: [] };
    }

    withSearch(query?: string): this {
        if (query) {
            (this.query.where?.AND as Prisma.Input<Prisma.UserWhereInput>[])?.push({
                OR: [
                    { name: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                    { jobTitle: { contains: query, mode: 'insensitive' } },
                ]
            });
        }
        return this;
    }

    withName(name?: string): this {
        if (name) {
            (this.query.where?.AND as Prisma.Input<Prisma.UserWhereInput>[])?.push({ 
                name: { contains: name, mode: 'insensitive' } 
            });
        }
        return this;
    }

    withRoles(roles?: UserRole[]): this {
        if (roles && roles.length > 0) {
            (this.query.where?.AND as Prisma.Input<Prisma.UserWhereInput>[])?.push({ 
                role: { in: roles } 
            });
        }
        return this;
    }

    createdAfter(date?: Date): this {
        if (date) {
            (this.query.where?.AND as Prisma.Input<Prisma.UserWhereInput>[])?.push({ 
                createdAt: { gte: date } 
            });
        }
        return this;
    }
}