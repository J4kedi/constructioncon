'use client';

import { useEffect, useState } from 'react';
import { getFinancialOverviewAction, getFinancialHistoryAction } from '@/app/actions/financeiro.actions';
import { Card, CardsSkeleton } from '@/app/ui/dashboard/cards';
import FinancialHistoryChart from '@/app/ui/dashboard/financeiro/FinancialHistoryChart';
import { formatCurrency } from '@/app/lib/utils';
import { DollarSign, TrendingDown, TrendingUp, Archive } from 'lucide-react';

type OverviewData = {
    faturamento: number;
    custosTotais: number;
    lucroBruto: number;
    valorEstoque: number;
};

type HistoryData = {
    name: string;
    Faturamento: number;
    Custos: number;
    Lucro: number;
}[];

function FinancialPageSkeleton() {
    const shimmer = 'before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 dark:before:via-white/10 before:to-transparent';

    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-6">Painel Financeiro</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <CardsSkeleton />
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6">
                <div className={`${shimmer} relative w-full overflow-hidden rounded-xl bg-secondary/20 p-4 h-96`}>
                    <div className="mb-4 h-8 w-36 rounded-md bg-secondary/40" />
                    <div className="rounded-xl bg-background/50 p-4 h-full" />
                </div>
            </div>
        </div>
    );
}

export default function Page() {
    const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
    const [historyData, setHistoryData] = useState<HistoryData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [overviewResult, historyResult] = await Promise.all([
                    getFinancialOverviewAction(),
                    getFinancialHistoryAction()
                ]);
                setOverviewData(overviewResult);
                setHistoryData(historyResult);
                setError(null);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Ocorreu um erro.';
                setError(errorMessage);
                console.error(errorMessage);
            } finally {
                if (isLoading) setIsLoading(false);
            }
        };

        fetchData();

        const intervalId = setInterval(fetchData, 3000);

        return () => clearInterval(intervalId);
    }, []);

    if (isLoading) {
        return <FinancialPageSkeleton />;
    }

    if (error) {
        return <div className="text-red-500">Erro ao carregar dados: {error}</div>;
    }

    if (!overviewData || !historyData) {
        return <div>Nenhum dado financeiro encontrado.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-text mb-6">Painel Financeiro</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <Card title="Faturamento Total" value={formatCurrency(overviewData.faturamento)} icon={<DollarSign className="h-5 w-5 text-primary" />} />
                <Card title="Custos Totais" value={formatCurrency(overviewData.custosTotais)} icon={<TrendingDown className="h-5 w-5 text-primary" />} />
                <Card title="Lucro Bruto" value={formatCurrency(overviewData.lucroBruto)} icon={<TrendingUp className="h-5 w-5 text-primary" />} />
                <Card title="Valor em Estoque" value={formatCurrency(overviewData.valorEstoque)} icon={<Archive className="h-5 w-5 text-primary" />} />
            </div>

            <div className="bg-background border border-secondary/20 rounded-lg p-6 mt-6">
                <h2 className="text-xl font-bold text-text mb-4">Histórico Financeiro Mensal</h2>
                <FinancialHistoryChart data={historyData} />
            </div>
        </div>
    );
}