'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { createCatalogoItem } from '@/app/actions/estoque.actions.ts';
import { FormState } from '@/app/lib/action-handler';
import { UnidadeMedida } from '@prisma/client';

interface CreateItemFormProps {
  onClose?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-400">
      {pending ? 'Criando Item...' : 'Criar Item'}
    </button>
  );
}

export default function CreateItemForm({ onClose }: CreateItemFormProps) {
  const initialState: FormState = { errors: {}, message: null };
  const [state, dispatch] = useActionState(createCatalogoItem, initialState);

  useEffect(() => {
    if (state.success) {
      if (onClose) onClose();
    }
  }, [state.success, onClose]);

  return (
    <form action={dispatch} className="space-y-4">
      <div>
        <label htmlFor="nome" className="mb-2 block text-sm font-medium text-text">Nome do Item</label>
        <input id="nome" name="nome" type="text" required className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm" />
        {state.errors?.nome && <p className="mt-1 text-xs text-red-500">{state.errors.nome[0]}</p>}
      </div>

      <div>
        <label htmlFor="descricao" className="mb-2 block text-sm font-medium text-text">Descrição</label>
        <textarea id="descricao" name="descricao" rows={3} className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm"></textarea>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="unidade" className="mb-2 block text-sm font-medium text-text">Unidade de Medida</label>
          <select id="unidade" name="unidade" required className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm">
            {Object.values(UnidadeMedida).map((unidade) => (
              <option key={unidade} value={unidade}>{unidade}</option>
            ))}
          </select>
          {state.errors?.unidade && <p className="mt-1 text-xs text-red-500">{state.errors.unidade[0]}</p>}
        </div>
        <div>
          <label htmlFor="categoria" className="mb-2 block text-sm font-medium text-text">Categoria</label>
          <input id="categoria" name="categoria" type="text" className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="custoUnitario" className="mb-2 block text-sm font-medium text-text">Custo Unitário (R$)</label>
          <input id="custoUnitario" name="custoUnitario" type="number" step="0.01" required defaultValue={0} className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm" />
          {state.errors?.custoUnitario && <p className="mt-1 text-xs text-red-500">{state.errors.custoUnitario[0]}</p>}
        </div>
        <div>
          <label htmlFor="nivelMinimo" className="mb-2 block text-sm font-medium text-text">Nível Mínimo de Estoque</label>
          <input id="nivelMinimo" name="nivelMinimo" type="number" required defaultValue={0} className="block w-full rounded-md border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 py-2 px-3 text-sm" />
          {state.errors?.nivelMinimo && <p className="mt-1 text-xs text-red-500">{state.errors.nivelMinimo[0]}</p>}
        </div>
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
