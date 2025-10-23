'use client';

import { StatusObra } from '@prisma/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import { useThemeColors } from '@/app/lib/hooks/useThemeColors';

interface ChartData {
  name: string;
  value: number;
}

interface ObrasStatusPieChartProps {
  data: ChartData[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function ObrasStatusPieChart({ data }: ObrasStatusPieChartProps) {
  const themeColors = useThemeColors();

  const COLORS: Record<StatusObra | string, string> = {
    PLANEJAMENTO: themeColors.primary,
    EM_ANDAMENTO: themeColors.warning,
    CONCLUIDA: themeColors.success,
    PAUSADA: themeColors.muted,
    CANCELADA: themeColors.destructive,
  };

  if (!data || data.length === 0) {
    return <p className="text-center text-text/70">Sem dados de status de obras para exibir.</p>;
  }
  
  const formattedData = data.map(item => ({
      ...item,
      name: item.name.replace('_', ' ').toLowerCase(),
  }));

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={formattedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={110}
            fill="#8884d8"
            dataKey="value"
          >
            {formattedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name.toUpperCase().replace(' ', '_')] || '#8884d8'} />
            ))}
          </Pie>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
