import { BaseDataFetcher } from './BaseDataFetcher';
import type { UserWithCompany, PlainUser } from '@/app/lib/definitions';
import { UserQueryBuilder } from './query/UserQueryBuilder';

export class UserFetcher extends BaseDataFetcher<PlainUser | UserWithCompany> {
  private includeCompany: boolean;

  constructor(subdomain: string, options: { includeCompany?: boolean } = {}) {
    super(subdomain);
    this.includeCompany = options.includeCompany || false;
  }

  protected getModelName(): string {
    return 'user';
  }

  protected getQueryBuilder(): UserQueryBuilder {
    return new UserQueryBuilder();
  }

  protected getIncludeArgs(): object {
    if (this.includeCompany) {
      return { include: { company: true } };
    }
    return {};
  }
}
