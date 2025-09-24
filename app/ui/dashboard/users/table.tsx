'use client';

import Image from 'next/image';
import { Prisma, UserRole } from '@prisma/client';
import { Pencil } from 'lucide-react';
import { DeleteUser } from './DeleteUserButton';
import { useState } from 'react';
import Modal from '@/app/ui/components/Modal';
import EditUserForm from './EditUserForm';

type User = Prisma.UserGetPayload<{}>;

type RoleBadgeProps = {
    role: UserRole;
};

function RoleBadge({ role }: RoleBadgeProps) {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full capitalize";
    const roleStyles = {
        USER: "bg-primary/20 text-primary",
        END_CUSTOMER: "bg-accent/20 text-accent",
        COMPANY_ADMIN: "bg-red-500/20 text-red-500",
        SUPER_ADMIN: "bg-yellow-500/20 text-yellow-500",
    };

    const fallbackStyle = "bg-gray-500/20 text-gray-500";

    return (
        <span className={`${baseClasses} ${roleStyles[role] || fallbackStyle}`}>
            {role.replace('_', ' ').toLowerCase()}
        </span>
    );
}

type UsersTableProps = {
    users: User[];
    currentUserRole?: UserRole;
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

    return (
        <div className="w-full">
            <div className="flow-root">
                <div className="overflow-x-auto">
                    <div className="inline-block min-w-full align-middle">
                        <div className="rounded-lg bg-secondary/20 p-2 md:pt-0">
                            <table className="min-w-full text-text">
                                <thead className="rounded-lg text-left text-sm font-normal">
                                    <tr>
                                        <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                            Nome
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Email
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Cargo
                                        </th>
                                        <th scope="col" className="px-3 py-5 font-medium">
                                            Role
                                        </th>
                                        <th scope="col" className="px-4 py-5 font-medium">
                                            Data de Adição
                                        </th>
                                        {isAdmin && (
                                            <th scope="col" className="relative py-3 pl-6 pr-3">
                                                <span className="sr-only">Ações</span>
                                            </th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="bg-background">
                                    {users.map((user) => (
                                        <tr key={user.id} className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
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
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {user.email}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                {user.jobTitle || 'N/A'}
                                            </td>
                                            <td className="whitespace-nowrap px-3 py-3">
                                                <RoleBadge role={user.role} />
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3">
                                                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                                            </td>
                                            {isAdmin && (
                                                <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                                    <div className="flex justify-end gap-3">
                                                        <button onClick={() => handleOpenModal(user)} className="rounded-md p-2 hover:bg-secondary/20 cursor-pointer">
                                                            <Pencil className="w-4" />
                                                        </button>
                                                        <DeleteUser id={user.id} />
                                                    </div>
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {selectedUser && (
                <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Editar Usuário">
                    <EditUserForm user={selectedUser} onClose={handleCloseModal} />
                </Modal>
            )}
        </div>
    );
}
