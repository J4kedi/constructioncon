'use client';

import { useEffect, useActionState } from 'react'; // Corrigido
import { useFormStatus } from 'react-dom';
import { createObra } from '@/app/actions/obra.actions';
import { User } from '@prisma/client';
import { FormState } from '@/app/lib/action-handler';
import { Button } from '@/app/ui/components/Button';
import { toast } from 'sonner';

interface CreateObraFormProps {
  customers: User[];
  onClose?: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Criando Obra...' : 'Criar Obra'}
    </Button>
  );
}

export default function CreateObraForm({ customers, onClose }: CreateObraFormProps) {
  const initialState: FormState = { errors: {}, message: null };
  const [state, dispatch] = useActionState(createObra, initialState); // Corrigido

  useEffect(() => {
    if (state.success === true && state.message) {
      toast.success(state.message);
      if (onClose) {
        onClose();
      }
    }
    if (state.success === false && state.message) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-background p-4 md:p-6 space-y-4">
        <div>
          <label htmlFor="obraType" className="mb-2 block text-sm font-medium text-text">Tipo da Obra</label>
          <select name="obraType" id="obraType" className="block w-full appearance-none rounded-md border border-secondary/20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 py-2 px-3 text-sm">
            <option value="RESIDENCIAL">Residencial</option>
            <option value="COMERCIAL">Comercial</option>
          </select>
        </div>

        <div>
          <label htmlFor="nome" className="mb-2 block text-sm font-medium text-text">Nome da Obra</label>
          <input id="nome" name="nome" type="text" placeholder="Ex: Residencial Bela Vista" className="block w-full rounded-md border border-secondary/20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 py-2 px-3 text-sm placeholder:text-gray-500" />
        </div>

        <div>
          <label htmlFor="endCustomerName" className="mb-2 block text-sm font-medium text-text">Nome do Cliente Final</label>
          <input id="endCustomerName" name="endCustomerName" type="text" placeholder="Ex: João da Silva" className="block w-full rounded-md border border-secondary/20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 py-2 px-3 text-sm placeholder:text-gray-500" />
        </div>

        <div>
          <label htmlFor="orcamentoTotal" className="mb-2 block text-sm font-medium text-text">Orçamento Total (R$)</label>
          <input id="orcamentoTotal" name="orcamentoTotal" type="number" step="0.01" placeholder="Ex: 500000.00" className="block w-full rounded-md border border-secondary/20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 py-2 px-3 text-sm placeholder:text-gray-500" />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="dataInicio" className="mb-2 block text-sm font-medium text-text">Data de Início</label>
            <input id="dataInicio" name="dataInicio" type="date" className="block w-full rounded-md border border-secondary/20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 py-2 px-3 text-sm" />
          </div>
          <div className="flex-1">
            <label htmlFor="dataPrevistaFim" className="mb-2 block text-sm font-medium text-text">Data Prevista de Fim</label>
            <input id="dataPrevistaFim" name="dataPrevistaFim" type="date" className="block w-full rounded-md border border-secondary/20 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-50 py-2 px-3 text-sm" />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <SubmitButton />
        </div>
      </div>
    </form>
  );
}
