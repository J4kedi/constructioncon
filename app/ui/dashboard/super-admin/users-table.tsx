import type { User } from '@prisma/client';

type UserWithCompany = User & { companyName: string };

export default function UsersTable({ users }: { users: UserWithCompany[] }) {
  return (
    <div className="w-full">
      <div className="flow-root">
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden rounded-lg bg-background md:pt-0">
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
                      Empresa (Tenant)
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-5 font-medium">
                      Ativo
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-background">
                  {users.map((user) => (
                    <tr key={user.id} className="w-full border-b border-secondary/20 py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg">
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
                        {user.role}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        {user.isActive ? 'Sim' : 'Não'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}