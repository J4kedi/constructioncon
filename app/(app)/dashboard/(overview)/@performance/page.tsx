import { fetchProjectPerformance } from '@/app/lib/data/dashboard-overview';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getRequestContext } from '@/app/lib/server-utils';
import { getFinancialHistoryAction } from '@/app/actions/financeiro.actions';
import FinancialHistoryChart from '@/app/ui/dashboard/financeiro/FinancialHistoryChart';
import { Suspense } from 'react';
import { ChartSkeleton } from '@/app/ui/components/skeletons';

interface PerformanceItemProps {
  nome: string;
  cpi: number;
  spi: number;
}

const PerformanceItem = ({ nome, cpi, spi }: PerformanceItemProps) => (
  <li 
    className="flex justify-between items-center py-2 border-b border-secondary/20 last:border-none"
    title={`Projeto: ${nome} | CPI: ${cpi.toFixed(2)}, SPI: ${spi.toFixed(2)}`}
  >
    <span className="text-sm font-medium text-text/90 truncate">{nome}</span>
    <div className="flex items-center space-x-4">
      <span className={`text-sm font-semibold ${cpi >= 1 ? 'text-success' : 'text-destructive'}`}>
        CPI: {cpi.toFixed(2)}
      </span>
      <span className={`text-sm font-semibold ${spi >= 1 ? 'text-success' : 'text-destructive'}`}>
        SPI: {spi.toFixed(2)}
      </span>
    </div>
  </li>
);

async function Performance() {
    const { subdomain } = await getRequestContext();
    if (!subdomain) return null;

    const { bestPerformers, worstPerformers } = await fetchProjectPerformance(subdomain);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Melhor Performance (CPI/SPI)</CardTitle>
                    <TrendingUp className="h-5 w-5 text-success" />
                </CardHeader>
                <CardContent>
                    <ul>
                        {bestPerformers.map(item => <PerformanceItem key={item.id} {...item} />)}
                    </ul>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-lg font-semibold">Pior Performance (CPI/SPI)</CardTitle>
                    <TrendingDown className="h-5 w-5 text-destructive" />
                </CardHeader>
                <CardContent>
                    <ul>
                        {worstPerformers.map(item => <PerformanceItem key={item.id} {...item} />)}
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}

export default async function PerformancePage() {
    return <Performance />;
}


