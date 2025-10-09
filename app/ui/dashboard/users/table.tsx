'use client';

import Image from 'next/image';
import { Prisma, UserRole } from '@prisma/client';
import { Pencil } from 'lucide-react';
import { DeleteUser } from './DeleteUserButton';
import { useState } from 'react';
import Modal from '@/app/ui/components/Modal';
import EditUserForm from './EditUserForm';
import Table from '@/app/ui/components/Table';
import { Badge, badgeVariants } from '@/app/ui/components/Badge';
import { type VariantProps } from 'class-variance-authority';

type User = Prisma.UserGetPayload<{}>;

type UsersTableProps = {
    users: User[];
    currentUserRole?: UserRole;
};

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

const roleVariantMap: Record<UserRole, BadgeVariant> = {
    USER: 'default',
    END_CUSTOMER: 'outline',
    COMPANY_ADMIN: 'secondary',
    SUPER_ADMIN: 'destructive',
};

export default function UsersTable({ users, currentUserRole }: UsersTableProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    const isAdmin = currentUserRole === 'COMPANY_ADMIN' || currentUserRole === 'SUPER_ADMIN';

    const handleOpenModal = (user: User) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
    };

    const headers = ['Nome', 'Email', 'Cargo', 'Role', 'Data de Adição'];

    const renderRow = (user: User) => (
        <tr key={user.id} className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none">
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                <div className="flex items-center gap-3">
                    <Image
                        src={user.avatarUrl || '/avatar-placeholder.svg'}
                        className="rounded-full"
                        width={28}
                        height={28}
                        alt={`${user.name}'s profile picture`}
                    />
                    <p>{user.name}</p>
                </div>
            </td>
            <td className="whitespace-nowrap px-3 py-3">{user.email}</td>
            <td className="whitespace-nowrap px-3 py-3">{user.jobTitle || 'N/A'}</td>
            <td className="whitespace-nowrap px-3 py-3">
                <Badge variant={roleVariantMap[user.role] || 'outline'}>
                    {user.role.replace('_', ' ').toLowerCase()}
                </Badge>
            </td>
            <td className="whitespace-nowrap px-4 py-3">{new Date(user.createdAt).toLocaleDateString('pt-BR')}</td>
            <td className="whitespace-nowrap py-3 pl-6 pr-3">
                {isAdmin && (
                    <div className="flex justify-end gap-3">
                        <button onClick={() => handleOpenModal(user)} className="rounded-md p-2 hover:bg-secondary/20 cursor-pointer">
                            <Pencil className="w-4" />
                        </button>
                        <DeleteUser id={user.id} />
                    </div>
                )}
            </td>
        </tr>
    );

    return (
        <>
            <Table headers={headers} data={users} renderRow={renderRow} hasActions={isAdmin} />
            {selectedUser && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Editar Usuário">
                    <EditUserForm user={selectedUser} onClose={handleCloseModal} />
                </Modal>
            )}
        </>
    );
}