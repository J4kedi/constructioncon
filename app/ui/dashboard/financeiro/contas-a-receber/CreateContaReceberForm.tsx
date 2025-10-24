'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/app/ui/components/Button';
import InputField from '@/app/ui/components/InputField';
import SelectField from '@/app/ui/components/SelectField';
import Modal from '@/app/ui/components/Modal';
import { createContaReceber } from '@/app/actions/contas-a-receber.actions';
import type { FormState } from '@/app/lib/definitions';
import type { Obra } from '@prisma/client';

interface CreateContaReceberFormProps {
  isOpen: boolean;
  onClose: () => void;
  obras: Pick<Obra, 'id' | 'nome'>[];
}

export default function CreateContaReceberForm({ isOpen, onClose, obras }: CreateContaReceberFormProps) {
  const initialState: FormState = { message: null, errors: {}, success: false };
  const [state, formAction] = useActionState(createContaReceber, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      onClose();
    } else if (state.message && state.errors) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  return (
    <Modal title="Adicionar Conta a Receber" isOpen={isOpen} onClose={onClose}>
      <form action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="cliente" name="cliente" label="Cliente" errors={state.errors?.cliente} />
          <SelectField id="obraId" name="obraId" label="Obra/Contrato" errors={state.errors?.obraId}>
            <option value="">Selecione uma obra</option>
            {obras.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
          </SelectField>
          <InputField id="descricao" name="descricao" label="Descrição do Serviço/Medição" errors={state.errors?.descricao} />
          <InputField id="dataVencimento" name="dataVencimento" label="Data de Vencimento" type="date" errors={state.errors?.dataVencimento} />
          <InputField id="valor" name="valor" label="Valor" type="number" step="0.01" errors={state.errors?.valor} />
          <InputField id="file" name="file" label="Anexo (Fatura/Medição)" type="file" errors={state.errors?.file} />
          <SelectField id="status" name="status" label="Status" errors={state.errors?.status}>
            <option value="A_RECEBER">A Receber</option>
            <option value="RECEBIDO">Recebido</option>
            <option value="VENCIDO">Vencido</option>
          </SelectField>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
