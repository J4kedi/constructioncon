import { Suspense } from 'react';
import { getRequestContext } from '@/app/lib/server-utils';
import { fetchObrasEmAndamentoCount, fetchContasProximasDoVencimentoCount } from '@/app/lib/data/dashboard';
import { fetchSaldoAtual, fetchTarefasAtrasadasCount } from '@/app/lib/data/financeiro';
import { formatCurrency } from '@/app/lib/utils';
import KeyKPIsCard, { KPI } from '@/app/ui/dashboard/financeiro/KeyKPIsCard';
import { CardsSkeleton } from '@/app/ui/components/skeletons';

export default async function SummaryPage() {
    const { subdomain } = await getRequestContext();

    if (!subdomain) {
        return null;
    }

    const [obrasCount, contasProximasCount, saldoAtual, tarefasAtrasadas] = await Promise.all([
        fetchObrasEmAndamentoCount(subdomain),
        fetchContasProximasDoVencimentoCount(subdomain),
        fetchSaldoAtual(subdomain),
        fetchTarefasAtrasadasCount(subdomain),
    ]);
    
    const kpis: KPI = {
        obrasEmAndamento: obrasCount,
        tarefasAtrasadas: tarefasAtrasadas,
        contasProximas: contasProximasCount,
        saldoAtual: formatCurrency(saldoAtual),
    };

    return (
        <Suspense fallback={<CardsSkeleton />}>
            <KeyKPIsCard kpis={kpis} />
        </Suspense>
    );
}
