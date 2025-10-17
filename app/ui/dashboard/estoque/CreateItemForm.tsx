'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createCatalogoItem } from '@/app/actions/estoque.actions';
import { FormState } from '@/app/lib/action-handler';
import { UnidadeMedida } from '@prisma/client';
import { toast } from 'sonner';
import { Button } from '@/app/ui/components/Button';
import InputField from '@/app/ui/components/InputField';
import SelectField from '@/app/ui/components/SelectField';
import { Package, Text, List, Tag, DollarSign, AlertTriangle } from 'lucide-react';

interface CreateItemFormProps {
  onClose?: () => void;
}

export default function CreateItemForm({ onClose }: CreateItemFormProps) {
  const initialState: FormState = { errors: {}, message: null, success: false };
  const [state, dispatch] = useActionState(createCatalogoItem, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Item criado com sucesso!');
      if (onClose) onClose();
    }
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  return (
    <form ref={formRef} action={dispatch} className="space-y-4">
      <InputField
        id="nome"
        name="nome"
        label="Nome do Item"
        Icon={Package}
        required
        errors={state.errors?.nome}
      />
      <InputField
        id="descricao"
        name="descricao"
        label="Descrição (Opcional)"
        Icon={Text}
        errors={state.errors?.descricao}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <SelectField
          id="unidade"
          name="unidade"
          label="Unidade de Medida"
          Icon={List}
          required
          errors={state.errors?.unidade}
        >
          {Object.values(UnidadeMedida).map((unidade) => (
            <option key={unidade} value={unidade}>{unidade}</option>
          ))}
        </SelectField>
        <InputField
          id="categoria"
          name="categoria"
          label="Categoria (Opcional)"
          Icon={Tag}
          errors={state.errors?.categoria}
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <InputField
          id="custoUnitario"
          name="custoUnitario"
          label="Custo Unitário (R$)"
          Icon={DollarSign}
          type="number"
          step="0.01"
          required
          defaultValue={0}
          errors={state.errors?.custoUnitario}
        />
        <InputField
          id="nivelMinimo"
          name="nivelMinimo"
          label="Nível Mínimo de Estoque"
          Icon={AlertTriangle}
          type="number"
          required
          defaultValue={0}
          errors={state.errors?.nivelMinimo}
        />
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Criar Item</Button>
      </div>
    </form>
  );
}