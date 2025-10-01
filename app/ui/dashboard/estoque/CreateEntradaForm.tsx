'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createEntradaEstoque } from '@/app/actions/estoque.actions.ts';
import { FormState } from '@/app/lib/action-handler';
import type { CatalogoItem, Supplier } from '@prisma/client';

interface CreateEntradaFormProps {
  catalogoItens: CatalogoItem[];
  suppliers: Supplier[];
  onClose?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-400">
      {pending ? 'Registrando Entrada...' : 'Registrar Entrada'}
    </button>
  );
}

export default function CreateEntradaForm({ catalogoItens, suppliers, onClose }: CreateEntradaFormProps) {
  const initialState: FormState = { errors: {}, message: null };
  const [state, dispatch] = useActionState(createEntradaEstoque, initialState);

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
        <label htmlFor="quantidade" className="mb-2 block text-sm font-medium text-text">Quantidade</label>
        <input id="quantidade" name="quantidade" type="number" step="0.01" required className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm" />
        {state.errors?.quantidade && <p className="mt-1 text-xs text-red-500">{state.errors.quantidade[0]}</p>}
      </div>

      <div>
        <label htmlFor="supplierId" className="mb-2 block text-sm font-medium text-text">Fornecedor</label>
        <select id="supplierId" name="supplierId" required className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm">
          <option value="" disabled>Selecione um fornecedor</option>
          {suppliers.map((supplier) => (
            <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
          ))}
        </select>
        {state.errors?.supplierId && <p className="mt-1 text-xs text-red-500">{state.errors.supplierId[0]}</p>}
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
