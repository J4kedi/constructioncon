import { Suspense } from 'react';
import { getRequestContext } from '@/app/lib/server-utils';
import { fetchObrasEmAndamentoCount, fetchProximaContaPagar } from '@/app/lib/data/dashboard';
import { formatDate } from '@/app/lib/utils';
import KeyKPIsCard, { KPI } from '@/app/ui/dashboard/financeiro/KeyKPIsCard';
import { CardsSkeleton } from '@/app/ui/components/skeletons';

export default async function SummaryPage() {
    const { subdomain } = await getRequestContext();

    if (!subdomain) {
        return null;
    }

    const [obrasCount, proximaConta] = await Promise.all([
        fetchObrasEmAndamentoCount(subdomain),
        fetchProximaContaPagar(subdomain),
    ]);
    
    const kpis: KPI = {
        obrasEmAndamento: obrasCount,
        tarefasAtrasadas: 5, // Simulado
        proximaConta: proximaConta ? { valor: proximaConta.valor.toNumber(), data: formatDate(proximaConta.dataVencimento, 'dd/MM') } : null,
        saldoAtual: 125340.50, // Simulado
    };

    return (
        <Suspense fallback={<CardsSkeleton />}>
            <KeyKPIsCard kpis={kpis} />
        </Suspense>
    );
}
