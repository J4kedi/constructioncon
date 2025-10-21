'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/app/ui/components/PageHeader';
import { CashFlowChart } from '@/app/ui/dashboard/financeiro/fluxo-de-caixa/Chart';
import { CashFlowTable } from '@/app/ui/dashboard/financeiro/fluxo-de-caixa/Table';
import SelectField from '@/app/ui/components/SelectField';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/ui/components/Card';

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

  return (
    <div className="w-full">
      <PageHeader
        title="Fluxo de Caixa"
        description="Visão preditiva de entradas e saídas para as próximas semanas."
      >
        <div className="w-[180px]">
          <SelectField
            id="period"
            name="period"
            value={period}
            onValueChange={setPeriod}
            options={periodOptions}
          />
        </div>
      </PageHeader>

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
          <CardContent>
            <CashFlowTable data={filteredData} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
