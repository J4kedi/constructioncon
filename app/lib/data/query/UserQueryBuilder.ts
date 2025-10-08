import { Prisma, UserRole } from '@prisma/client';
import { BasePrismaQueryBuilder } from './BaseQueryBuilder';

export class UserQueryBuilder extends BasePrismaQueryBuilder<Prisma.UserFindManyArgs> {
    constructor() {
        super({}, 8);
        this.query.where = { AND: [] };
        this.query.orderBy = { createdAt: 'desc' };
    }

    withSearch(query?: string): this {
        if (query) {
            (this.query.where.AND as Prisma.UserWhereInput[]).push({
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
            (this.query.where.AND as Prisma.UserWhereInput[]).push({
                name: { contains: name, mode: 'insensitive' }
            });
        }
        return this;
    }

    withRoles(roles?: UserRole[]): this {
        if (roles && roles.length > 0) {
            (this.query.where.AND as Prisma.UserWhereInput[]).push({
                role: { in: roles }
            });
        }
        return this;
    }

    createdAfter(date?: Date): this {
        if (date) {
            (this.query.where.AND as Prisma.UserWhereInput[]).push({
                createdAt: { gte: date }
            });
        }
        return this;
    }
}
