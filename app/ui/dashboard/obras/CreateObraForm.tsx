'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { TriangleAlert } from 'lucide-react';
import { createObra } from '@/app/actions/obra.actions';
import { User } from '@prisma/client';
import { FormState } from '@/app/lib/action-handler';

interface CreateObraFormProps {
  customers: User[];
  onClose?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 disabled:bg-gray-400">
      {pending ? 'Criando Obra...' : 'Criar Obra'}
    </button>
  );
}

export default function CreateObraForm({ customers, onClose }: CreateObraFormProps) {
  const initialState: FormState = { errors: {}, message: null };
  const [state, dispatch] = useActionState(createObra, initialState);

  useEffect(() => {
    if (state.success && onClose) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-background p-4 md:p-6 space-y-4">
        
        <div>
          <label htmlFor="obraType" className="mb-2 block text-sm font-medium text-text">Tipo da Obra</label>
          <select name="obraType" id="obraType" className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm">
            <option value="RESIDENCIAL">Residencial</option>
            <option value="COMERCIAL">Comercial</option>
          </select>
        </div>

        <div>
          <label htmlFor="nome" className="mb-2 block text-sm font-medium text-text">Nome da Obra</label>
          <input id="nome" name="nome" type="text" placeholder="Ex: Residencial Bela Vista" className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm placeholder:text-gray-500" />
        </div>

        <div>
          <label htmlFor="endCustomerName" className="mb-2 block text-sm font-medium text-text">Nome do Cliente Final</label>
          <input id="endCustomerName" name="endCustomerName" type="text" placeholder="Ex: João da Silva" className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm placeholder:text-gray-500" />
        </div>

        <div>
          <label htmlFor="orcamentoTotal" className="mb-2 block text-sm font-medium text-text">Orçamento Total (R$)</label>
          <input id="orcamentoTotal" name="orcamentoTotal" type="number" step="0.01" placeholder="Ex: 500000.00" className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm placeholder:text-gray-500" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="dataInicio" className="mb-2 block text-sm font-medium text-text">Data de Início</label>
            <input id="dataInicio" name="dataInicio" type="date" className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm" />
          </div>
          <div className="flex-1">
            <label htmlFor="dataPrevistaFim" className="mb-2 block text-sm font-medium text-text">Data Prevista de Fim</label>
            <input id="dataPrevistaFim" name="dataPrevistaFim" type="date" className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm" />
          </div>
        </div>

        {state.message && (
          <div className="flex items-center gap-2 mt-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg">
            <TriangleAlert className="h-5 w-5" />
            <p>{state.message}</p>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-4">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}

