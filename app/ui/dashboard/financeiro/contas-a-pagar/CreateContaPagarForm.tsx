'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/app/ui/components/Button';
import InputField from '@/app/ui/components/InputField';
import SelectField from '@/app/ui/components/SelectField';
import Modal from '@/app/ui/components/Modal';
import { createContaPagar } from '@/app/actions/contas-a-pagar.actions';
import type { FormState } from '@/app/lib/definitions';
import type { Obra, Supplier } from '@prisma/client';
import { CategoriaDespesa } from '@prisma/client';

interface CreateContaPagarFormProps {
  isOpen: boolean;
  onClose: () => void;
  obras: Pick<Obra, 'id' | 'nome'>[];
  suppliers: Pick<Supplier, 'id' | 'name'>[];
}

export default function CreateContaPagarForm({ isOpen, onClose, obras, suppliers }: CreateContaPagarFormProps) {
  const initialState: FormState = { message: null, errors: {}, success: false };
  const [state, formAction] = useActionState(createContaPagar, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      onClose();
    } else if (state.message && state.errors) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  return (
    <Modal title="Adicionar Conta a Pagar" isOpen={isOpen} onClose={onClose}>
      <form action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField id="supplierId" name="supplierId" label="Fornecedor" errors={state.errors?.supplierId}>
            <option value="">Selecione um fornecedor</option>
            {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </SelectField>
          <InputField id="dataEmissao" name="dataEmissao" label="Data de Emissão" type="date" errors={state.errors?.dataEmissao} />
          <InputField id="dataVencimento" name="dataVencimento" label="Data de Vencimento" type="date" errors={state.errors?.dataVencimento} />
          <InputField id="valor" name="valor" label="Valor" type="number" step="0.01" errors={state.errors?.valor} />
          <SelectField id="obraId" name="obraId" label="Centro de Custo (Obra)" errors={state.errors?.obraId}>
            <option value="">Selecione uma obra</option>
            {obras.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
          </SelectField>
          <SelectField id="categoria" name="categoria" label="Categoria" errors={state.errors?.categoria}>
            {Object.values(CategoriaDespesa).map(cat => <option key={cat} value={cat}>{cat.replace(/_/g, ' ')}</option>)}
          </SelectField>
          <SelectField id="status" name="status" label="Status" errors={state.errors?.status}>
            <option value="A_PAGAR">A Pagar</option>
            <option value="PAGO">Pago</option>
            <option value="VENCIDO">Vencido</option>
          </SelectField>
          <InputField id="file" name="file" label="Anexo (Boleto/NF)" type="file" errors={state.errors?.file} />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
