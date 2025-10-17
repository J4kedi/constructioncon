'use client';

import { ReactNode } from 'react';
import { Button } from '@/app/ui/components/Button';
import Modal from '@/app/ui/components/Modal';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  formAction?: (formData: FormData) => void;
  title: string;
  children: ReactNode;
  confirmButtonText?: string;
  cancelButtonText?: string;
  isConfirming?: boolean;
  errorMessage?: string | null;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  formAction,
  title,
  children,
  confirmButtonText = 'Confirmar',
  cancelButtonText = 'Cancelar',
  isConfirming = false,
  errorMessage = null,
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const content = (
    <div className="space-y-4">
      <div>{children}</div>
      
      {errorMessage && (
        <div className="text-sm text-red-500 bg-red-500/10 p-3 rounded-md">
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="flex justify-end gap-4 pt-4">
        <Button variant="outline" onClick={onClose} disabled={isConfirming}>
          {cancelButtonText}
        </Button>
        <Button 
          variant="destructive" 
          onClick={onConfirm}
          type={formAction ? 'submit' : 'button'}
          disabled={isConfirming}
        >
          {isConfirming ? 'Confirmando...' : confirmButtonText}
        </Button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      {formAction ? <form action={formAction}>{content}</form> : content}
    </Modal>
  );
}