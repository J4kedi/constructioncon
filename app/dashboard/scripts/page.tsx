import { getAvailableScripts } from '@/app/actions/scripts.actions';
import ScriptCard from '@/app/ui/dashboard/super-admin/script-card';
import ScriptCardWithArgument from '@/app/ui/dashboard/super-admin/script-card-with-argument';

const SCRIPTS_WITH_ARGS = ['db:seed:tenant'];

export default async function Page() {
  const scripts = await getAvailableScripts();

  return (
    <div>
      <h1 className="text-3xl font-bold text-text mb-6">Operações e Scripts</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {scripts.map((script) => {
          if (SCRIPTS_WITH_ARGS.includes(script.key)) {
            return (
              <ScriptCardWithArgument
                key={script.key}
                scriptKey={script.key}
                description={script.description}
                argName="subdomain"
                argPlaceholder="Digite o subdomínio"
              />
            );
          }
          return (
            <ScriptCard
              key={script.key}
              scriptKey={script.key}
              description={script.description}
            />
          );
        })}
      </div>
    </div>
  );
}