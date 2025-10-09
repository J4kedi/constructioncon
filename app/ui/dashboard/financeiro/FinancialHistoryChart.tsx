'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { formatCurrency } from '@/app/lib/utils';

interface ChartData {
  name: string;
  Faturamento: number;
  Custos: number;
  Lucro: number;
}

interface FinancialHistoryChartProps {
  data: ChartData[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-4 bg-background/80 backdrop-blur-sm border border-secondary/20 rounded-lg shadow-lg">
        <p className="label font-bold text-text">{`${label}`}</p>
        <p className="text-blue-400">{`Faturamento : ${formatCurrency(payload[0].value)}`}</p>
        <p className="text-red-400">{`Custos : ${formatCurrency(payload[1].value)}`}</p>
        <p className="text-green-400">{`Lucro : ${formatCurrency(payload[2].value)}`}</p>
      </div>
    );
  }

  return null;
};

export default function FinancialHistoryChart({ data }: FinancialHistoryChartProps) {
  if (!data || data.length === 0) {
    return <p className="text-center text-text/70">Sem dados históricos para exibir.</p>;
  }

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <AreaChart
          data={data}
          margin={{
            top: 10, right: 30, left: 20, bottom: 0,
          }}
        >
          <defs>
            <linearGradient id="colorFaturamento" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorCustos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
          <XAxis dataKey="name" stroke="#9ca3af" />
          <YAxis stroke="#9ca3af" tickFormatter={(value) => formatCurrency(value)} />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Area type="monotone" dataKey="Faturamento" stroke="#3b82f6" fillOpacity={1} fill="url(#colorFaturamento)" strokeWidth={2} />
          <Area type="monotone" dataKey="Custos" stroke="#ef4444" fillOpacity={1} fill="url(#colorCustos)" strokeWidth={2} />
          <Line type="monotone" dataKey="Lucro" stroke="#22c55e" strokeWidth={3} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
