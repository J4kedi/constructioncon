'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from '@/app/lib/utils';

interface CashFlowData {
  date: string;
  saldoProjetado: number;
}

export function CashFlowChart({ data }: { data: CashFlowData[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
        <XAxis 
          dataKey="date" 
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(str) => formatDate(str, 'dd/MM')}
        />
        <YAxis 
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(value) => formatCurrency(value as number)}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--background))', 
            borderColor: 'hsl(var(--border))' 
          }}
          labelFormatter={(label) => formatDate(label, 'full')}
          formatter={(value) => [formatCurrency(value as number), 'Saldo Projetado']}
        />
        <Legend />
        <Line type="monotone" dataKey="saldoProjetado" name="Saldo Projetado" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
