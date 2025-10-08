import type { User, UserRole } from '@prisma/client';
import Table from '@/app/ui/components/Table';
import Badge, { type BadgeVariant } from '@/app/ui/components/Badge';

type UserWithCompany = User & { companyName: string };

const roleVariantMap: Record<UserRole, BadgeVariant> = {
    USER: 'primary',
    END_CUSTOMER: 'accent',
    COMPANY_ADMIN: 'danger',
    SUPER_ADMIN: 'warning',
};

export default function UsersTable({ users }: { users: UserWithCompany[] }) {
  const headers = ['Nome', 'Email', 'Empresa (Tenant)', 'Role', 'Ativo'];

  const renderRow = (user: UserWithCompany) => (
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
        <Badge 
            text={user.role.replace('_', ' ').toLowerCase()} 
            variant={roleVariantMap[user.role] || 'neutral'} 
        />
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {user.isActive ? 'Sim' : 'Não'}
      </td>
    </tr>
  );

  return <Table headers={headers} data={users} renderRow={renderRow} hasActions={false} />;
}
