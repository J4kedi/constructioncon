'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/app/ui/components/Button';
import InputField from '@/app/ui/components/InputField';
import SelectField from '@/app/ui/components/SelectField';
import Modal from '@/app/ui/components/Modal';
import { createContaPagar } from '@/app/actions/contas-a-pagar.actions';
import type { FormState } from '@/app/lib/definitions';
import type { Obra } from '@prisma/client';

interface CreateContaPagarFormProps {
  isOpen: boolean;
  onClose: () => void;
  obras: Pick<Obra, 'id' | 'nome'>[];
}

export default function CreateContaPagarForm({ isOpen, onClose, obras }: CreateContaPagarFormProps) {
  const initialState: FormState = { message: null, errors: {}, success: false };
  const [state, formAction] = useActionState(createContaPagar, initialState);

  const obraOptions = obras.map(obra => ({ value: obra.id, label: obra.nome }));

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
          <InputField id="fornecedor" name="fornecedor" label="Fornecedor" errors={state.errors?.fornecedor} />
          <InputField id="dataEmissao" name="dataEmissao" label="Data de Emissão" type="date" errors={state.errors?.dataEmissao} />
          <InputField id="dataVencimento" name="dataVencimento" label="Data de Vencimento" type="date" errors={state.errors?.dataVencimento} />
          <InputField id="valor" name="valor" label="Valor" type="number" step="0.01" errors={state.errors?.valor} />
          <SelectField id="obraId" name="obraId" label="Centro de Custo (Obra)" options={obraOptions} errors={state.errors?.obraId} />
          <InputField id="categoria" name="categoria" label="Categoria" errors={state.errors?.categoria} />
          <SelectField id="status" name="status" label="Status" options={[{ value: 'A_PAGAR', label: 'A Pagar' }, { value: 'PAGO', label: 'Pago' }, { value: 'VENCIDO', label: 'Vencido' }]} errors={state.errors?.status} />
          <InputField id="anexoUrl" name="anexoUrl" label="Anexo (URL)" errors={state.errors?.anexoUrl} />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
