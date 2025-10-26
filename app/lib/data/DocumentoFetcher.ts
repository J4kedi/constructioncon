import { BaseDataFetcher } from './BaseDataFetcher';
import { DocumentoQueryBuilder } from './query/DocumentoQueryBuilder';
import { Prisma } from '@prisma/client';

type DocumentoComRelacoes = Prisma.DocumentGetPayload<{
  include: {
    obra: true;
    contaPagar: { include: { supplier: true } };
    contaReceber: true;
  };
}>;

export class DocumentoFetcher extends BaseDataFetcher<DocumentoComRelacoes> {
  constructor(subdomain: string) {
    super(subdomain);
  }

  protected getModelName(): string {
    return 'document';
  }

  protected getQueryBuilder(): DocumentoQueryBuilder {
    return new DocumentoQueryBuilder();
  }

  protected getIncludeArgs(): object {
    return {
      include: {
        obra: true,
        contaPagar: { include: { supplier: true } },
        contaReceber: true,
      },
    };
  }
}
