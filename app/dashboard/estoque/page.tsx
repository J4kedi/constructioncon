'use client';

import { lazy, Suspense } from 'react';

const EstoqueMfe = lazy(() => import('estoque/page'));

export default function Page() {
    return (
        <div>
            <Suspense fallback={<div>Carregando módulo de estoque...</div>}>
                <EstoqueMfe />
            </Suspense>
        </div>
    );
}