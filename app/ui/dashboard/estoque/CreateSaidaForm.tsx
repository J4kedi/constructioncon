'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createSaidaEstoque } from '@/app/actions/estoque.actions.ts';
import { FormState } from '@/app/lib/action-handler';
import { toast } from 'sonner';
import { Button } from '@/app/ui/components/Button';
import InputField from '@/app/ui/components/InputField';
import SelectField from '@/app/ui/components/SelectField';
import { Package, Hash, Building2 } from 'lucide-react';
import { PlainCatalogoItem, PlainObra } from '@/app/lib/definitions';

interface CreateSaidaFormProps {
  catalogoItens: PlainCatalogoItem[];
  obras: PlainObra[];
  onClose?: () => void;
}

export default function CreateSaidaForm({ catalogoItens, obras, onClose }: CreateSaidaFormProps) {
  const initialState: FormState = { errors: {}, message: null, success: false };
  const [state, dispatch] = useActionState(createSaidaEstoque, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Saída registrada com sucesso!');
      if (onClose) onClose();
    }
    if (state.message && !state.success) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  return (
    <form ref={formRef} action={dispatch} className="space-y-4">
      <SelectField
        id="catalogoItemId"
        name="catalogoItemId"
        label="Item do Catálogo"
        Icon={Package}
        required
        errors={state.errors?.catalogoItemId}
      >
        <option value="">Selecione um item</option>
        {catalogoItens.map((item) => (
          <option key={item.id} value={item.id}>{item.nome}</option>
        ))}
      </SelectField>

      <InputField
        id="quantidade"
        name="quantidade"
        label="Quantidade a ser Retirada"
        Icon={Hash}
        type="number"
        step="0.01"
        required
        errors={state.errors?.quantidade}
      />

      <SelectField
        id="obraDestinoId"
        name="obraDestinoId"
        label="Obra de Destino"
        Icon={Building2}
        required
        errors={state.errors?.obraDestinoId}
      >
        <option value="">Selecione uma obra</option>
        {obras.map((obra) => (
          <option key={obra.id} value={obra.id}>{obra.nome}</option>
        ))}
      </SelectField>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Registrar Saída</Button>
      </div>
    </form>
  );
}