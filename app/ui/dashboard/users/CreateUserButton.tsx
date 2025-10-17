'use client';

import ModalFormButton from '@/app/ui/components/ModalFormButton';
import RegisterForm from '@/app/ui/dashboard/users/RegisterForm';

export default function CreateUserButton() {
  return (
    <ModalFormButton
      buttonLabel="Adicionar Usuário"
      modalTitle="Registrar Novo Usuário"
    >
      <RegisterForm onClose={() => {}} />
    </ModalFormButton>
  );
}
