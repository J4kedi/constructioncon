import { BaseDataFetcher } from './BaseDataFetcher';
import { UserQueryBuilder } from '@/app/lib/queryBuilder';
import { Prisma } from '@prisma/client';

type UserWithCompany = Prisma.UserGetPayload<{ include: { company: true } }>;

export class UserFetcher extends BaseDataFetcher<UserWithCompany> {
  protected getModelName(): string {
    return 'user';
  }

  protected buildQueryArgs(searchParams: { [key: string]: string | undefined }): any {
    const page = Number(searchParams?.page) || 1;
    const query = searchParams?.query;
    const sort = searchParams?.sort;

    const userQueryBuilder = new UserQueryBuilder();

    const queryArgs = userQueryBuilder
      .withSearch(query)
      .withPage(page)
      .sortBy(sort)
      .build();

    queryArgs.include = { company: true };

    return queryArgs;
  }
}
