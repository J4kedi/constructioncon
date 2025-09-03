import { headers } from 'next/headers';
import { findUsersWithBuilder } from '@/app/lib/data';

export default async function Page() {
  const heads = headers();
  const subdomain = (await heads).get('x-tenant-subdomain');

  if (!subdomain) {
    return <h1>Tenant não identificado.</h1>;
  }

  const users = await findUsersWithBuilder(subdomain, {});

  return (
    <div>
      <h1>Página de Usuários do Tenant: {subdomain}</h1>
      <p>Dados recebidos do banco de dados do tenant:</p>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}