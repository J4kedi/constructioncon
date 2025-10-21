'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function FinanceiroPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard/financeiro/painel');
  }, [router]);

  return null;
}