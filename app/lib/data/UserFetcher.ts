import { BaseDataFetcher } from './BaseDataFetcher';
import { Prisma } from '@prisma/client';
import { UserQueryBuilder } from './query/UserQueryBuilder';

type UserWithCompany = Prisma.UserGetPayload<{ include: { company: true } }>;

export class UserFetcher extends BaseDataFetcher<UserWithCompany> {
  protected getModelName(): string {
    return 'user';
  }

  protected getQueryBuilder(): UserQueryBuilder {
    return new UserQueryBuilder();
  }

  protected getIncludeArgs(): object {
    return { include: { company: true } };
  }
}
