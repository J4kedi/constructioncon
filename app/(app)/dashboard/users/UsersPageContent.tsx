'use client';

import { useState } from 'react';
import { roboto } from '@/app/ui/fonts';
import UsersTable from '@/app/ui/dashboard/users/table';
import Modal from '@/app/ui/components/Modal';
import CreateUserForm from '@/app/ui/dashboard/users/CreateUserForm';
import { Plus } from 'lucide-react';
import { Prisma, UserRole } from '@prisma/client';
import Search from '@/app/ui/components/search';
import Pagination from '@/app/ui/dashboard/pagination';

type User = Prisma.UserGetPayload<{}>;

interface UsersPageContentProps {
  initialUsers: User[];
  totalPages: number;
  currentUserRole?: UserRole;
}

export default function UsersPageContent({ initialUsers, totalPages, currentUserRole }: UsersPageContentProps) {
  const [isModalOpen, setModalOpen] = useState(false);

  return (
    <main>
      <div className="flex justify-between items-center mb-4">
        <h1 className={`${roboto.className} text-xl md:text-2xl`}>
          Usuários
        </h1>
        <button 
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary/90 transition-all duration-300 shadow-md hover:shadow-primary/40"
        >
          <Plus size={20} />
          <span>Adicionar Novo Usuário</span>
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setModalOpen(false)} 
        title="Criar Novo Usuário"
      >
        <CreateUserForm onClose={() => setModalOpen(false)} />
      </Modal>

      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Pesquisar usuários..." />
      </div>

      <div className="w-full mt-6">
        <UsersTable users={initialUsers} currentUserRole={currentUserRole} />
      </div>

      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </main>
  );
}