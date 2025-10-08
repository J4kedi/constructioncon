'use server';

import { exec } from 'child_process';
import { promisify } from 'util';
import { auth } from '@/app/actions/auth';
import { z } from 'zod';

const execAsync = promisify(exec);

const ALLOWED_SCRIPTS: Record<string, { command: string; description: string }> = {
  'db:provision': {
    command: 'pnpm db:provision',
    description: 'Provisiona um novo tenant (requer nome e subdomínio).',
  },
  'db:cleanup': {
    command: 'pnpm db:cleanup',
    description: 'Limpa os dados de tenants de demonstração ou teste.',
  },
  'db:deprovision': {
    command: 'pnpm db:deprovision',
    description: 'Desprovisiona um tenant específico (requer subdomínio).',
  },
  'db:seed:public': {
    command: 'pnpm db:seed:public',
    description: 'Popula a tabela `features` no schema public com os dados iniciais.',
  },
  'db:seed:tenant': {
    command: 'pnpm db:seed:tenant',
    description: 'Popula um tenant específico com dados iniciais (requer subdomínio).',
  },
  'db:seed:demo': {
    command: 'pnpm db:seed:demo',
    description: 'Popula o banco de dados com dados de demonstração completos.',
  },
  'db:migrate:tenants': {
    command: 'pnpm db:migrate:tenants',
    description: 'Aplica as migrações pendentes a todos os schemas de tenants existentes.',
  },
};

const provisionSchema = z.object({
  name: z.string().min(3, 'O nome da empresa deve ter pelo menos 3 caracteres.'),
  subdomain: z.string().min(3, 'O subdomínio deve ter pelo menos 3 caracteres.').regex(/^[a-z0-9-]+$/, 'O subdomínio pode conter apenas letras minúsculas, números e hífens.'),
});

async function checkAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === 'SUPER_ADMIN';
}

export async function getAvailableScripts() {
  return Object.entries(ALLOWED_SCRIPTS).map(([key, { description }]) => ({
    key,
    description,
  }));
}

export async function provisionTenantAction(formData: FormData): Promise<{ success: boolean; output: string }> {
  if (!await checkAdmin()) {
    return { success: false, output: 'Erro: Apenas Super Admins podem executar esta ação.' };
  }

  const validation = provisionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validation.success) {
    return { success: false, output: validation.error.issues.map(e => e.message).join('\n') };
  }

  const { name, subdomain } = validation.data;
  const command = `pnpm db:provision "${name}" "${subdomain}"`;

  try {
    console.log(`Executando comando: ${command}`);
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Stderr para ${command}:`, stderr);
      return { success: false, output: stderr };
    }

    return { success: true, output: stdout };
  } catch (error: any) {
    console.error(`Falha ao executar ${command}:`, error);
    return { success: false, output: error.message || 'Ocorreu um erro desconhecido.' };
  }
}

export async function deprovisionTenantAction(subdomain: string): Promise<{ success: boolean; output: string }> {
  if (!await checkAdmin()) {
    return { success: false, output: 'Erro: Apenas Super Admins podem executar esta ação.' };
  }

  if (!subdomain || subdomain.trim() === '') {
    return { success: false, output: 'Erro: O subdomínio não pode ser vazio.' };
  }

  // Prevenção extra para não deletar o tenant admin
  if (subdomain === 'admin') {
    return { success: false, output: 'Erro: O tenant principal de administração não pode ser removido.' };
  }

  const command = `pnpm db:deprovision "${subdomain}"`;

  try {
    console.log(`Executando comando: ${command}`);
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Stderr para ${command}:`, stderr);
      return { success: false, output: stderr };
    }

    return { success: true, output: stdout };
  } catch (error: any) {
    console.error(`Falha ao executar ${command}:`, error);
    return { success: false, output: error.message || 'Ocorreu um erro desconhecido.' };
  }
}

export async function runScriptAction(scriptKeyWithArgs: string): Promise<{ success: boolean; output: string }> {
  if (!await checkAdmin()) {
    return { success: false, output: 'Erro: Apenas Super Admins podem executar scripts.' };
  }

  const [scriptKey, ...args] = scriptKeyWithArgs.split(' ');
  const script = ALLOWED_SCRIPTS[scriptKey];

  if (!script) {
    return { success: false, output: `Erro: Script '${scriptKey}' não é permitido.` };
  }

  const command = `${script.command} ${args.join(' ')}`.trim();

  try {
    console.log(`Executando comando: ${command}`);
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Stderr para ${command}:`, stderr);
      return { success: false, output: stderr };
    }

    return { success: true, output: stdout };
  } catch (error: any) {
    console.error(`Falha ao executar ${command}:`, error);
    return { success: false, output: error.message || 'Ocorreu um erro desconhecido.' };
  }
}