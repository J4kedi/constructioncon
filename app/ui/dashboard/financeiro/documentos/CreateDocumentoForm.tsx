'use client';

import { useActionState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/app/ui/components/Button';
import InputField from '@/app/ui/components/InputField';
import SelectField from '@/app/ui/components/SelectField';
import Modal from '@/app/ui/components/Modal';
import { createDocumento } from '@/app/actions/documento.actions';
import type { FormState } from '@/app/lib/definitions';
import { DocumentType, Obra, ContaPagar, ContaReceber } from '@prisma/client';

interface CreateDocumentoFormProps {
  isOpen: boolean;
  onClose: () => void;
  obras: Pick<Obra, 'id' | 'nome'>[];
  contasPagar: Pick<ContaPagar, 'id' | 'fornecedor' | 'dataVencimento'>[];
  contasReceber: Pick<ContaReceber, 'id' | 'cliente' | 'descricao'>[];
}

export default function CreateDocumentoForm({ isOpen, onClose, obras, contasPagar, contasReceber }: CreateDocumentoFormProps) {
  const initialState: FormState = { message: null, errors: {}, success: false };
  const [state, formAction] = useActionState(createDocumento, initialState);

  const obraOptions = obras.map(o => ({ value: o.id, label: o.nome }));
  const contasPagarOptions = contasPagar.map(c => ({ value: c.id, label: `Fornecedor: ${c.fornecedor} (Vence: ${c.dataVencimento.toLocaleDateString()})` }));
  const contasReceberOptions = contasReceber.map(c => ({ value: c.id, label: `Cliente: ${c.cliente} (${c.descricao})` }));
  const typeOptions = Object.values(DocumentType).map(type => ({ value: type, label: type.replace(/_/g, ' ') }));

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      onClose();
    } else if (state.message && state.errors) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  return (
    <Modal title="Adicionar Documento" isOpen={isOpen} onClose={onClose}>
      <form action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="name" name="name" label="Nome do Documento" errors={state.errors?.name} />
          <InputField id="url" name="url" label="URL do Documento" errors={state.errors?.url} />
          <SelectField id="type" name="type" label="Tipo" options={typeOptions} errors={state.errors?.type} />
          <SelectField id="obraId" name="obraId" label="Obra" options={obraOptions} errors={state.errors?.obraId} />
          <SelectField id="contaPagarId" name="contaPagarId" label="Vincular a Conta a Pagar (Opcional)" options={contasPagarOptions} errors={state.errors?.contaPagarId} />
          <SelectField id="contaReceberId" name="contaReceberId" label="Vincular a Conta a Receber (Opcional)" options={contasReceberOptions} errors={state.errors?.contaReceberId} />
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
