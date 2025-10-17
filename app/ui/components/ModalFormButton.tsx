'use client';

import { useState, ReactElement, cloneElement } from 'react';
import { Button, ButtonProps } from '@/app/ui/components/Button';
import Modal from '@/app/ui/components/Modal';
import { Plus } from 'lucide-react';

interface ModalFormButtonProps extends ButtonProps {
  buttonLabel: string;
  modalTitle: string;
  children: ReactElement<{ onClose: () => void }>;
  buttonIcon?: React.ElementType;
}

export default function ModalFormButton({
  buttonLabel,
  modalTitle,
  children,
  buttonIcon: ButtonIcon = Plus,
  ...buttonProps
}: ModalFormButtonProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const formWithProps = cloneElement(children, { onClose: closeModal });

  return (
    <>
      <Button onClick={openModal} {...buttonProps}>
        <ButtonIcon className="h-5 md:mr-2" />
        <span className="hidden md:block">{buttonLabel}</span>
      </Button>
      <Modal isOpen={isModalOpen} onClose={closeModal} title={modalTitle}>
        {formWithProps}
      </Modal>
    </>
  );
}
