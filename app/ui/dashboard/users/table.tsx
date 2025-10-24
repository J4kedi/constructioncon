'use client';

import Image from 'next/image';
import { UserRole } from '@prisma/client';
import { Pencil } from 'lucide-react';
import { DeleteUser } from './DeleteUserButton';
import Modal from '@/app/ui/components/Modal';
import EditUserForm from './EditUserForm';
import Table from '@/app/ui/components/Table';
import { StatusBadge } from '@/app/ui/components/BadgeFactory';
import { PlainUser } from '@/app/lib/definitions';
import { useTableState } from '@/app/lib/hooks/useTableState';

type UsersTableProps = {
    users: PlainUser[];
    currentUserRole?: UserRole;
};

export default function UsersTable({ users: initialUsers, currentUserRole }: UsersTableProps) {
    const { items: users, modalState, handleDelete } = useTableState<PlainUser>(initialUsers);

    const isAdmin = currentUserRole === 'COMPANY_ADMIN' || currentUserRole === 'SUPER_ADMIN';

    const headers = ['Nome', 'Email', 'Cargo', 'Role', 'Data de Adição'];

    const renderCells = (user: PlainUser): React.ReactNode[] => [
        <div className="flex items-center gap-3">
            <Image
                src={user.avatarUrl || '/avatar-placeholder.svg'}
                className="rounded-full"
                width={28}
                height={28}
                alt={`${user.name}'s profile picture`}
            />
            <p>{user.name}</p>
        </div>,
        user.email,
        user.jobTitle || 'N/A',
        <StatusBadge type="role" value={user.role} />,
        new Date(user.createdAt).toLocaleDateString('pt-BR'),
        isAdmin && (
            <div className="flex justify-end gap-3">
                <button onClick={() => modalState.openModal(user)} className="rounded-md p-2 hover:bg-secondary/20 cursor-pointer">
                    <Pencil className="w-4" />
                </button>
                <DeleteUser id={user.id} onSuccess={() => handleDelete(user.id)} />
            </div>
        )
    ];

    return (
        <>
            <Table headers={headers} data={users} renderCells={renderCells} hasActions={isAdmin} />
            {modalState.selectedItem && (
                <Modal isOpen={modalState.isOpen} onClose={modalState.closeModal} title="Editar Usuário">
                    <EditUserForm user={modalState.selectedItem} onClose={modalState.closeModal} />
                </Modal>
            )}
        </>
    );
}