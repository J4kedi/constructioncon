'use client';

import { useFormState } from 'react-dom';
import { updateObra } from '@/app/actions/obra.actions';
import type { Obra } from '@prisma/client';
import { FormState } from '@/app/lib/action-handler';

interface EditObraFormProps {
  obra: Obra;
}

export default function EditObraForm({ obra }: EditObraFormProps) {
  const initialState: FormState = { errors: {}, message: null };
  const [state, dispatch] = useFormState(updateObra, initialState);

  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={obra.id} />
      <div className="rounded-md bg-background p-4 md:p-6">
        
        <div className="mb-4">
          <label htmlFor="nome" className="mb-2 block text-sm font-medium text-text">
            Nome da Obra
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            defaultValue={obra.nome}
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="nome-error"
          />
          <div id="nome-error" aria-live="polite" aria-atomic="true">
            {state.errors?.nome &&
              state.errors.nome.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="endCustomerName" className="mb-2 block text-sm font-medium text-text">
            Nome do Cliente Final
          </label>
          <input
            id="endCustomerName"
            name="endCustomerName"
            type="text"
            defaultValue={obra.endCustomerName}
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="endCustomerName-error"
          />
           <div id="endCustomerName-error" aria-live="polite" aria-atomic="true">
            {state.errors?.endCustomerName &&
              state.errors.endCustomerName.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="orcamentoTotal" className="mb-2 block text-sm font-medium text-text">
            Orçamento Total (R$)
          </label>
          <input
            id="orcamentoTotal"
            name="orcamentoTotal"
            type="number"
            step="0.01"
            defaultValue={obra.orcamentoTotal.toNumber()}
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="orcamentoTotal-error"
          />
           <div id="orcamentoTotal-error" aria-live="polite" aria-atomic="true">
            {state.errors?.orcamentoTotal &&
              state.errors.orcamentoTotal.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>{error}</p>
              ))}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
            Salvar Alterações
          </button>
        </div>
      </div>
    </form>
  );
}
