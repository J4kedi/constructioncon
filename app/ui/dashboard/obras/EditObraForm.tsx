'use client';

import React, { useActionState } from 'react';
import { updateObra } from '@/app/actions/obra.actions';
import { FormState } from '@/app/lib/action-handler';
import { PlainObra } from '@/app/lib/definitions';

interface EditObraFormProps {
  obra: PlainObra;
}

// Helper para formatar a data para o input 'date'
const formatDateForInput = (dateStr: string): string => {
  if (!dateStr) return '';
  // Converte de dd/MM/yyyy para yyyy-MM-dd
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    return `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  // Se já estiver no formato ISO ou outro, tenta criar uma data
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0];
  }
  return '';
};

export default function EditObraForm({ obra }: EditObraFormProps) {
  const initialState: FormState = { errors: {}, message: null };
  const [state, dispatch] = useActionState(updateObra, initialState);

  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={obra.id} />
      <div className="rounded-md bg-background p-4 md:p-6 space-y-4">
        <div className="mb-4">
          <label htmlFor="type" className="mb-2 block text-sm font-medium text-text">
            Tipo da Obra
          </label>
          <select
            id="type"
            name="type"
            defaultValue={obra.type}
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm"
          >
            <option value="RESIDENCIAL">Residencial</option>
            <option value="COMERCIAL">Comercial</option>
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="nome" className="mb-2 block text-sm font-medium text-text">
            Nome da Obra
          </label>
          <input
            id="nome"
            name="nome"
            type="text"
            defaultValue={obra.nome}
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm"
          />
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
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="mb-2 block text-sm font-medium text-text">
            Endereço da Obra
          </label>
          <input
            id="address"
            name="address"
            type="text"
            defaultValue={obra.address ?? ''}
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm"
          />
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
            defaultValue={obra.orcamentoTotal}
            className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm"
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="dataInicio" className="mb-2 block text-sm font-medium text-text">
              Data de Início
            </label>
            <input
              id="dataInicio"
              name="dataInicio"
              type="date"
              defaultValue={formatDateForInput(obra.dataInicio)}
              className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="dataPrevistaFim" className="mb-2 block text-sm font-medium text-text">
              Data Prevista de Fim
            </label>
            <input
              id="dataPrevistaFim"
              name="dataPrevistaFim"
              type="date"
              defaultValue={formatDateForInput(obra.dataPrevistaFim)}
              className="block w-full rounded-md border border-secondary/20 bg-input py-2 px-3 text-sm"
            />
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