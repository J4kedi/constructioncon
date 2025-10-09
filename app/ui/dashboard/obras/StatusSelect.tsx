'use client';

import { useTransition } from 'react';
import { StatusObra } from '@prisma/client';
import { updateObraStatus } from '@/app/actions/obra.actions';
import { toast } from 'sonner';
import { badgeVariants, type BadgeProps } from '@/app/ui/components/Badge';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

interface StatusSelectProps {
  obraId: string;
  currentStatus: StatusObra;
}

const statusVariantMap: Record<StatusObra, BadgeProps['variant']> = {
    PLANEJAMENTO: 'default',
    EM_ANDAMENTO: 'warning',
    CONCLUIDA: 'success', 
    PAUSADA: 'outline',
    CANCELADA: 'destructive',
};

export default function StatusSelect({ obraId, currentStatus }: StatusSelectProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as StatusObra;

    startTransition(async () => {
      const result = await updateObraStatus(obraId, newStatus);
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  const variant = statusVariantMap[currentStatus] || 'outline';

  return (
    <div className="relative inline-flex items-center">
      <div 
        className={clsx(
          badgeVariants({ variant }), 
          'absolute inset-0 transition-opacity',
          isPending ? 'opacity-50' : 'opacity-100'
        )}
      />
      <select
        onChange={handleStatusChange}
        defaultValue={currentStatus}
        disabled={isPending}
        className={clsx(
          'relative appearance-none bg-transparent border-none',
          'h-full w-full pl-2.5 pr-6 py-0.5 text-xs font-semibold',
          'cursor-pointer focus:outline-none focus:ring-0'
        )}
        style={{ color: 'inherit' }} // Herda a cor do texto do badge
      >
        {Object.values(StatusObra).map((status) => (
          <option key={status} value={status} className="bg-background text-text">
            {status.replace('_', ' ').toLowerCase()}
          </option>
        ))}
      </select>
      <ChevronDown 
        className={clsx(
          'absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 transition-opacity',
          isPending ? 'opacity-0' : 'opacity-50'
        )}
      />
    </div>
  );
}