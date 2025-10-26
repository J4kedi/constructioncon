'use client';

import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatDate } from '@/app/lib/utils';
import { useThemeColors } from '@/app/lib/hooks/useThemeColors';

interface CashFlowData {
  date: string;
  saldoProjetado: number;
}

export function CashFlowChart({ data }: { data: CashFlowData[] }) {
  const themeColors = useThemeColors();

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart 
        data={data}
        margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={themeColors.primary} stopOpacity={0.8}/>
            <stop offset="95%" stopColor={themeColors.primary} stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={themeColors.muted} />
        <XAxis 
          dataKey="date" 
          stroke={themeColors.text}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(str) => formatDate(str, 'dd/MM')}
        />
        <YAxis 
          stroke={themeColors.text}
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => formatCurrency(value as number, 'brl', 0)}
        />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: themeColors.background,
            borderColor: themeColors.border 
          }}
          itemStyle={{ color: themeColors.text }}
          labelStyle={{ color: themeColors.text }}
          labelFormatter={(label) => formatDate(label, 'full')}
          formatter={(value) => [formatCurrency(value as number), 'Saldo Projetado']}
        />
        <Area type="monotone" dataKey="saldoProjetado" stroke={themeColors.primary} fillOpacity={1} fill="url(#colorSaldo)" />
        <Line type="monotone" dataKey="saldoProjetado" stroke={themeColors.primary} strokeWidth={2} dot={false} activeDot={{ r: 8 }} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
