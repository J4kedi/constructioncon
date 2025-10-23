'use client';

import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { formatCurrency } from '@/app/lib/utils';
import { clsx } from 'clsx';

interface ActivityFeedItemProps {
  type: 'RECEITA' | 'DESPESA';
  description: string;
  value: number;
  date: Date;
}

export function ActivityFeedItem({ type, description, value, date }: ActivityFeedItemProps) {
  const isIncome = type === 'RECEITA';

  const Icon = isIncome ? ArrowUpCircle : ArrowDownCircle;
  const color = isIncome ? 'text-success' : 'text-destructive';

  const timeAgo = (d: Date): string => {
    const seconds = Math.floor((new Date().getTime() - d.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " anos atrás";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " meses atrás";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " dias atrás";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " horas atrás";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutos atrás";
    return "agora mesmo";
  }

  return (
    <li className="flex items-center justify-between py-3">
      <div className="flex items-center">
        <Icon className={clsx('h-6 w-6', color)} />
        <div className="ml-3">
          <p className="text-sm font-medium text-text truncate">{description}</p>
          <p className="text-xs text-text/60">{timeAgo(date)}</p>
        </div>
      </div>
      <p className={clsx('text-sm font-semibold', color)}>{formatCurrency(value)}</p>
    </li>
  );
}
