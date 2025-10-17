import { getAvailableScripts } from '@/app/actions/scripts.actions';
import ScriptCard from '@/app/ui/dashboard/super-admin/script-card';

const scriptArgsConfig: Record<string, { args: { name: string; placeholder: string }[] }> = {
  'db:seed:tenant': {
    args: [{ name: 'subdomain', placeholder: 'Digite o subdomínio do tenant para popular' }],
  },
  'db:deprovision': {
    args: [{ name: 'subdomain', placeholder: 'Digite o subdomínio do tenant para remover' }],
  },
  'db:provision': {
    args: [
      { name: 'companyName', placeholder: 'Nome da Empresa' },
      { name: 'subdomain', placeholder: 'Subdomínio (ex: minha-empresa)' },
    ],
  },
};

export default async function Page() {
  const scripts = await getAvailableScripts();

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-6">Operações e Scripts</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scripts.map((script) => {
          const config = scriptArgsConfig[script.key];
          return (
            <ScriptCard
              key={script.key}
              scriptKey={script.key}
              description={script.description}
              args={config?.args}
            />
          );
        })}
      </div>
    </div>
  );
}
