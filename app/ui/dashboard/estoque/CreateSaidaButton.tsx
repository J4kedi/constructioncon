'use client';

import ModalFormButton from '@/app/ui/components/ModalFormButton';
import CreateSaidaForm from './CreateSaidaForm';
import { ArrowUp } from 'lucide-react';
import { PlainCatalogoItem, PlainObra } from '@/app/lib/definitions';

interface CreateSaidaButtonProps {
  catalogoItens: PlainCatalogoItem[];
  obras: PlainObra[];
}

export default function CreateSaidaButton({ catalogoItens, obras }: CreateSaidaButtonProps) {
  return (
    <ModalFormButton
      buttonLabel="Registrar Saída"
      modalTitle="Registrar Saída de Item do Estoque"
      buttonIcon={ArrowUp}
      variant="outline"
    >
      <CreateSaidaForm 
        catalogoItens={catalogoItens} 
        obras={obras}
        onClose={() => {}} 
      />
    </ModalFormButton>
  );
}