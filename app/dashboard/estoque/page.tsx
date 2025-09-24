'use client';

import { Suspense } from 'react';

export default function Page() {
    return (
        <div>
            <Suspense fallback={<div>Carregando módulo de estoque...</div>}>
                <h1>Página de estoque</h1>
            </Suspense>
        </div>
    );
}