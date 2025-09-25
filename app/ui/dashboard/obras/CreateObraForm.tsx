'use client';

import { useFormState } from 'react-dom';
import { ObraSchema } from '@/app/lib/definitions';
import { createObra } from '@/app/actions/obra.actions';
import { User } from '@prisma/client';

interface CreateObraFormProps {
  customers: User[];
}

export default function CreateObraForm({ customers }: CreateObraFormProps) {
  const initialState = { errors: {}, message: null };
  // Ação do servidor para criar a obra, adaptada para validação
  const createObraWithTenant = createObra.bind(null, 'sua-lógica-para-obter-o-subdomain');
  const [state, dispatch] = useFormState(createObraWithTenant, initialState);

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-background p-4 md:p-6">
        {/* Nome da Obra */}
        <div className="mb-4">
          <label htmlFor="nome" className="mb-2 block text-sm font-medium text-text">
            Nome da Obra
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            placeholder="Ex: Residencial Bela Vista"
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="nome-error"
          />
          <div id="nome-error" aria-live="polite" aria-atomic="true">
            {state.errors?.nome &&
              state.errors.nome.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Nome do Cliente Final */}
        <div className="mb-4">
          <label htmlFor="endCustomerName" className="mb-2 block text-sm font-medium text-text">
            Nome do Cliente Final
          </label>
          <input
            id="endCustomerName"
            name="endCustomerName"
            type="text"
            placeholder="Ex: João da Silva"
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="endCustomerName-error"
          />
           <div id="endCustomerName-error" aria-live="polite" aria-atomic="true">
            {state.errors?.endCustomerName &&
              state.errors.endCustomerName.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Orçamento Total */}
        <div className="mb-4">
          <label htmlFor="orcamentoTotal" className="mb-2 block text-sm font-medium text-text">
            Orçamento Total (R$)
          </label>
          <input
            id="orcamentoTotal"
            name="orcamentoTotal"
            type="number"
            step="0.01"
            placeholder="Ex: 500000.00"
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm placeholder:text-gray-500"
            aria-describedby="orcamentoTotal-error"
          />
           <div id="orcamentoTotal-error" aria-live="polite" aria-atomic="true">
            {state.errors?.orcamentoTotal &&
              state.errors.orcamentoTotal.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Data de Início */}
        <div className="mb-4">
          <label htmlFor="dataInicio" className="mb-2 block text-sm font-medium text-text">
            Data de Início
          </label>
          <input
            id="dataInicio"
            name="dataInicio"
            type="date"
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm"
            aria-describedby="dataInicio-error"
          />
           <div id="dataInicio-error" aria-live="polite" aria-atomic="true">
            {state.errors?.dataInicio &&
              state.errors.dataInicio.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Data Prevista de Fim */}
        <div className="mb-4">
          <label htmlFor="dataPrevistaFim" className="mb-2 block text-sm font-medium text-text">
            Data Prevista de Fim
          </label>
          <input
            id="dataPrevistaFim"
            name="dataPrevistaFim"
            type="date"
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm"
            aria-describedby="dataPrevistaFim-error"
          />
           <div id="dataPrevistaFim-error" aria-live="polite" aria-atomic="true">
            {state.errors?.dataPrevistaFim &&
              state.errors.dataPrevistaFim.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Botão de Submissão */}
        <div className="mt-6 flex justify-end gap-4">
          <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90">
            Criar Obra
          </button>
        </div>
      </div>
    </form>
  );
}
