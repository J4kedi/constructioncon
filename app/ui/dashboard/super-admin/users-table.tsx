import type { User, UserRole } from '@prisma/client';
import Table from '@/app/ui/components/Table';
import { Badge, badgeVariants } from '@/app/ui/components/Badge';
import { type VariantProps } from 'class-variance-authority';

type UserWithCompany = User & { companyName: string };

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

const roleVariantMap: Record<UserRole, BadgeVariant> = {
    USER: 'default',
    END_CUSTOMER: 'outline',
    COMPANY_ADMIN: 'secondary',
    SUPER_ADMIN: 'destructive',
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
        <Badge variant={roleVariantMap[user.role] || 'outline'}>
            {user.role.replace('_', ' ').toLowerCase()}
        </Badge>
      </td>
      <td className="whitespace-nowrap px-3 py-3">
        {user.isActive ? 'Sim' : 'Não'}
      </td>
    </tr>
  );

  return <Table headers={headers} data={users} renderRow={renderRow} hasActions={false} />;
}