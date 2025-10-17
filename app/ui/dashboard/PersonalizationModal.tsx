'use client';

import { Prisma } from '@prisma/client';
import Modal from '@/app/ui/components/Modal';
import { User } from 'next-auth';
import EditPerfilForm from './users/EditPerfilForm';

import type { PlainUser } from '@/app/lib/definitions';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | PlainUser | null;
}

export default function PersonalizationModal({ isOpen, onClose, user }: PersonalizationModalProps) {
  if (!user) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Personalização">
      <EditPerfilForm user={user as PlainUser} onClose={onClose} />
    </Modal>
  );
}
