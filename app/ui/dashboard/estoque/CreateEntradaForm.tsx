'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createEntradaEstoque } from '@/app/actions/estoque.actions.ts';
import { FormState } from '@/app/lib/action-handler';
import type { Supplier } from '@prisma/client';
import { toast } from 'sonner';
import { Button } from '@/app/ui/components/Button';
import InputField from '@/app/ui/components/InputField';
import SelectField from '@/app/ui/components/SelectField';
import { Package, Hash, Truck } from 'lucide-react';
import { PlainCatalogoItem } from './CreateEntradaButton';

interface CreateEntradaFormProps {
  catalogoItens: PlainCatalogoItem[];
  suppliers: Supplier[];
  onClose?: () => void;
}

export default function CreateEntradaForm({ catalogoItens, suppliers, onClose }: CreateEntradaFormProps) {
  const initialState: FormState = { errors: {}, message: null, success: false };
  const [state, dispatch] = useActionState(createEntradaEstoque, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message || 'Entrada registrada com sucesso!');
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
        label="Quantidade"
        Icon={Hash}
        type="number"
        step="0.01"
        required
        errors={state.errors?.quantidade}
      />

      <SelectField
        id="supplierId"
        name="supplierId"
        label="Fornecedor"
        Icon={Truck}
        required
        errors={state.errors?.supplierId}
      >
        <option value="">Selecione um fornecedor</option>
        {suppliers.map((supplier) => (
          <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
        ))}
      </SelectField>

      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" type="button" onClick={onClose}>Cancelar</Button>
        <Button type="submit">Registrar Entrada</Button>
      </div>
    </form>
  );
}