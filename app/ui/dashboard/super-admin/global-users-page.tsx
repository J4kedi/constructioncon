import Pagination from "@/app/ui/dashboard/pagination";
import Search from "@/app/ui/components/search";
import UsersTable from "@/app/ui/dashboard/super-admin/users-table";
import { roboto } from "@/app/ui/fonts";
import type { User } from '@prisma/client';

type UserWithCompany = User & { companyName: string };

interface GlobalUsersPageContentProps {
  users: UserWithCompany[];
  totalPages: number;
}

export default function GlobalUsersPageContent({ users, totalPages }: GlobalUsersPageContentProps) {
  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <h1 className={`${roboto.className} text-xl md:text-2xl`}>Gerenciamento Global de Usuários</h1>
      </div>
      <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
        <Search placeholder="Procurar usuários por nome ou email..." />
      </div>
      <div className="w-full mt-6">
        <UsersTable users={users} />
      </div>
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalPages} />
      </div>
    </div>
  );
}