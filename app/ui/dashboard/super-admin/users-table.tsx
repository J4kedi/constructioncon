import type { User, UserRole } from '@prisma/client';
import Table from '@/app/ui/components/Table';
import { StatusBadge } from '@/app/ui/components/BadgeFactory';

import type { GlobalUserView } from '@/app/lib/definitions';

export default function UsersTable({ users }: { users: GlobalUserView[] }) {
  const headers = ['Nome', 'Email', 'Empresa (Tenant)', 'Role', 'Ativo'];

  const renderRow = (user: GlobalUserView) => (
    <tr key={user.id} className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none">
      <td className="whitespace-nowrap py-3 pl-6 pr-3">
        <p>{user.name}</p>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {user.email}
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {user.companyName}
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        <StatusBadge type="role" value={user.role} />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {user.isActive ? 'Sim' : 'Não'}
      </td>
    </tr>
  );

  return <Table headers={headers} data={users} renderRow={renderRow} hasActions={false} />;
}