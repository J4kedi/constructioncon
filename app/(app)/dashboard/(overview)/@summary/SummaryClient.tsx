'use client';

import { useEffect, useState } from 'react';
import { DollarSign, TrendingUp, Building } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';
import { Card } from '@/app/ui/dashboard/cards';
import { getSummaryDataAction } from '@/app/actions/dashboard.actions';

type SummaryData = Awaited<ReturnType<typeof getSummaryDataAction>>;

export default function SummaryClient({ initialData }: { initialData: SummaryData }) {
    const [data, setData] = useState(initialData);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getSummaryDataAction();
                setData(result);
            } catch (err) {
                console.error("Falha ao atualizar os dados do resumo:", err);
            }
        };

        const intervalId = setInterval(fetchData, 10000); // Atualiza a cada 10 segundos

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <Card title="Faturamento Total" value={formatCurrency(data.faturamento)} icon={<DollarSign className="h-5 w-5 text-primary" />} />
            <Card title="Lucro Bruto" value={formatCurrency(data.lucroBruto)} icon={<TrendingUp className="h-5 w-5 text-primary" />} />
            <Card title="Obras Ativas" value={data.activeObrasCount} icon={<Building className="h-5 w-5 text-primary" />} />
        </>
    );
}
