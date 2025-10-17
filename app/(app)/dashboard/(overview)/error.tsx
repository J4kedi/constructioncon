'use client';

import { useEffect } from 'react';
import { Button } from '@/app/ui/components/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-background p-8 rounded-lg border border-destructive/20">
      <h2 className="text-2xl font-bold text-destructive mb-4">Ops! Algo deu errado.</h2>
      <p className="text-text/80 mb-6 text-center">Não foi possível carregar os dados do dashboard. Você pode tentar novamente.</p>
      <Button 
        variant="destructive"
        onClick={() => reset()}
      >
        Tentar Novamente
      </Button>
    </div>
  );
}
