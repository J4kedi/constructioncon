'use client';

import { useState, useMemo } from 'react';
import { CashFlowChart } from '@/app/ui/dashboard/financeiro/fluxo-de-caixa/Chart';
import { CashFlowTable } from '@/app/ui/dashboard/financeiro/fluxo-de-caixa/Table';
import SelectField from '@/app/ui/components/SelectField';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';
import PageHeader from '@/app/ui/components/PageHeader';

interface CashFlowData {
  date: string;
  entradas: number;
  saidas: number;
  saldoProjetado: number;
}

interface FluxoDeCaixaClientPageProps {
  data: CashFlowData[];
}

export default function FluxoDeCaixaClientPage({ data }: FluxoDeCaixaClientPageProps) {
  const [period, setPeriod] = useState('30');

  const periodOptions = [
    { label: 'Próximos 7 dias', value: '7' },
    { label: 'Próximos 15 dias', value: '15' },
    { label: 'Próximos 30 dias', value: '30' },
    { label: 'Próximos 90 dias', value: '90' },
  ];

  const filteredData = useMemo(() => {
    const days = parseInt(period, 10);
    const today = new Date();
    const endDate = new Date(today);
    endDate.setDate(today.getDate() + days);

    return data.filter(item => new Date(item.date) <= endDate);
  }, [data, period]);

  const periodSelector = (
    <div className="w-[200px]">
      <SelectField
        id="period"
        name="period"
        value={period}
        onChange={(e) => setPeriod(e.target.value)}
      >
        {periodOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </SelectField>
    </div>
  );

  return (
    <div className="w-full">
      <PageHeader
        title="Fluxo de Caixa"
        actionButtons={periodSelector}
      />

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Projeção de Saldo</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <CashFlowChart data={filteredData} />
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Projeção</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <CashFlowTable data={filteredData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

