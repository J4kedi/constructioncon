'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/app/ui/components/Button';
import Modal from '@/app/ui/components/Modal';
import RegisterForm from '@/app/ui/components/RegisterForm';

export default function CreateUserButton() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button onClick={openModal}>
        <Plus className="h-5 md:mr-2" />
        <span className="hidden md:block">Adicionar Usuário</span>
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal} title="Registrar Novo Usuário">
        <RegisterForm onClose={closeModal} />
      </Modal>
    </>
  );
}
