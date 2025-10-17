
import { BaseDataFetcher } from './BaseDataFetcher';
import { EstoqueItem } from '@/app/lib/definitions';
import { EstoqueQueryBuilder } from './query/EstoqueQueryBuilder';
import { Decimal } from '@prisma/client/runtime/library';

export class EstoqueFetcher extends BaseDataFetcher<EstoqueItem> {
    constructor(subdomain: string) {
        super(subdomain);
    }

    protected getModelName(): string {
        return 'catalogoItem';
    }

    protected getQueryBuilder(): EstoqueQueryBuilder {
        return new EstoqueQueryBuilder();
    }

    async fetchPageData(searchParams: { [key: string]: string | string[] | undefined; }) {
        const { data: items, totalPages } = await super.fetchPageData(searchParams);

        if (items.length === 0) {
            return { data: [], totalPages };
        }

        const itemIds = items.map(item => item.id);

        const stockQuantities = await this.prisma.estoqueMovimento.groupBy({
            by: ['catalogoItemId'],
            _sum: {
                quantidade: true,
            },
            where: {
                catalogoItemId: {
                    in: itemIds,
                },
            },
        });

        const quantityMap = new Map(stockQuantities.map(sq => [sq.catalogoItemId, sq._sum.quantidade ?? new Decimal(0)]));

        const itemsWithStock = items.map(item => ({
            ...item,
            quantidadeAtual: quantityMap.get(item.id) ?? new Decimal(0),
        }));

        return { data: itemsWithStock, totalPages };
    }
}
