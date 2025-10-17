'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createDespesa } from '@/app/actions/despesa.actions';
import { CategoriaDespesa, Obra } from '@prisma/client';
import { toast } from 'sonner';
import { Button } from '@/app/ui/components/Button';
import InputField from '@/app/ui/components/InputField';
import SelectField from '@/app/ui/components/SelectField';
import { DollarSign, ClipboardList, Calendar, Building2 } from 'lucide-react';
import { FormState } from '@/app/lib/definitions';

interface CreateDespesaFormProps {
  obras: Pick<Obra, 'id' | 'nome'>[];
  onClose: () => void;
}

export default function CreateDespesaForm({ obras, onClose }: CreateDespesaFormProps) {
  const initialState: FormState = { errors: {}, message: null, success: false };
  const [state, dispatch] = useActionState(createDespesa, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Despesa adicionada com sucesso!');
      onClose();
    }
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  return (
    <form ref={formRef} action={dispatch} className="space-y-4">
      <InputField
        id="descricao"
        name="descricao"
        label="Descrição da Despesa"
        Icon={ClipboardList}
        required
      />
      <InputField
        id="valor"
        name="valor"
        label="Valor (R$)"
        Icon={DollarSign}
        type="number"
        step="0.01"
        required
      />
      <SelectField
        id="categoria"
        name="categoria"
        label="Categoria"
        Icon={ClipboardList}
        required
      >
        {Object.values(CategoriaDespesa).map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </SelectField>
      <SelectField
        id="obraId"
        name="obraId"
        label="Associar à Obra (Opcional)"
        Icon={Building2}
      >
        <option value="">Nenhuma</option>
        {obras.map(obra => (
          <option key={obra.id} value={obra.id}>{obra.nome}</option>
        ))}
      </SelectField>
      <InputField
        id="data"
        name="data"
        label="Data da Despesa"
        Icon={Calendar}
        type="date"
        defaultValue={new Date().toISOString().split('T')[0]}
        required
      />
      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Adicionar Despesa</Button>
      </div>
    </form>
  );
}
