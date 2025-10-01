'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createSaidaEstoque } from '@/app/actions/estoque.actions.ts';
import { FormState } from '@/app/lib/action-handler';
import type { CatalogoItem, Obra } from '@prisma/client';

interface CreateSaidaFormProps {
  catalogoItens: CatalogoItem[];
  obras: Obra[];
  onClose?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-400">
      {pending ? 'Registrando Saída...' : 'Registrar Saída'}
    </button>
  );
}

export default function CreateSaidaForm({ catalogoItens, obras, onClose }: CreateSaidaFormProps) {
  const initialState: FormState = { errors: {}, message: null };
  const [state, dispatch] = useActionState(createSaidaEstoque, initialState);

  useEffect(() => {
    if (state.success) {
      if (onClose) onClose();
    }
  }, [state.success, onClose]);

  return (
    <form action={dispatch} className="space-y-4">
      
      <div>
        <label htmlFor="catalogoItemId" className="mb-2 block text-sm font-medium text-text">Item do Catálogo</label>
        <select id="catalogoItemId" name="catalogoItemId" required className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm">
          <option value="" disabled>Selecione um item</option>
          {catalogoItens.map((item) => (
            <option key={item.id} value={item.id}>{item.nome}</option>
          ))}
        </select>
        {state.errors?.catalogoItemId && <p className="mt-1 text-xs text-red-500">{state.errors.catalogoItemId[0]}</p>}
      </div>

      <div>
        <label htmlFor="quantidade" className="mb-2 block text-sm font-medium text-text">Quantidade a ser Retirada</label>
        <input id="quantidade" name="quantidade" type="number" step="0.01" required className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm" />
        {state.errors?.quantidade && <p className="mt-1 text-xs text-red-500">{state.errors.quantidade[0]}</p>}
      </div>

      <div>
        <label htmlFor="obraDestinoId" className="mb-2 block text-sm font-medium text-text">Obra de Destino</label>
        <select id="obraDestinoId" name="obraDestinoId" required className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm">
          <option value="" disabled>Selecione uma obra</option>
          {obras.map((obra) => (
            <option key={obra.id} value={obra.id}>{obra.nome}</option>
          ))}
        </select>
        {state.errors?.obraDestinoId && <p className="mt-1 text-xs text-red-500">{state.errors.obraDestinoId[0]}</p>}
      </div>

      {state.message && !state.success && (
        <div className="text-sm text-red-500">
          <p>{state.message}</p>
        </div>
      )}

      <div className="mt-6 flex justify-end gap-4">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-text rounded-md">Cancelar</button>
        <SubmitButton />
      </div>
    </form>
  );
}
