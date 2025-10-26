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
}

export default function CreateDocumentoForm({ isOpen, onClose, obras }: CreateDocumentoFormProps) {
  const initialState: FormState = { message: null, errors: {}, success: false };
  const [state, formAction] = useActionState(createDocumento, initialState);

  const generalDocTypes = ['CONTRATO', 'ALVARA', 'ART', 'MEMORIAL_DESCRITIVO', 'OUTRO'];
  const typeOptions = Object.values(DocumentType)
    .filter(type => generalDocTypes.includes(type))
    .map(type => ({ value: type, label: type.replace(/_/g, ' ') }));

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      onClose();
    } else if (state.message && state.errors) {
      toast.error(state.message);
    }
  }, [state, onClose]);

  return (
      <form action={formAction}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField id="name" name="name" label="Nome do Documento" errors={state.errors?.name} />
          <InputField id="file" name="file" label="Anexar Arquivo" type="file" errors={state.errors?.file} />
          <SelectField id="type" name="type" label="Tipo" errors={state.errors?.type}>
            <option value="">Selecione um tipo</option>
            {typeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </SelectField>
          <SelectField id="obraId" name="obraId" label="Obra" errors={state.errors?.obraId}>
            <option value="">Selecione uma obra</option>
            {obras.map(o => <option key={o.id} value={o.id}>{o.nome}</option>)}
          </SelectField>
        </div>
        <div className="mt-6 flex justify-end">
          <Button type="submit">Salvar</Button>
        </div>
      </form>
  );
}
