import { TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';

type Overrun = {
    id: string;
    nome: string;
    overrun: number;
};

export default function BudgetOverruns({ overruns }: { overruns: Overrun[] }) {
    if (!overruns || overruns.length === 0) {
        return <p className="text-center text-sm text-text/70">Nenhuma obra acima do orçamento.</p>;
    }

    return (
        <ul className="space-y-4">
            {overruns.map(item => (
                <li key={item.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <TrendingDown className="h-5 w-5 text-red-500" />
                        <p className="text-sm font-medium text-text">{item.nome}</p>
                    </div>
                    <p className="text-sm font-semibold text-red-500">
                        +{formatCurrency(item.overrun)}
                    </p>
                </li>
            ))}
        </ul>
    );
}
