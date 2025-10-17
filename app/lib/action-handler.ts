'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { getRequestContext } from '@/app/lib/server-utils';
import type { RequestContext, FormState, RequiredContext } from '@/app/lib/definitions';

interface ActionConfig<T extends z.ZodType<any, any>> {
  schema: T;
  formData: FormData;
  logic: (data: z.infer<T>, context: RequestContext) => Promise<void>;
  revalidatePath?: string;
  revalidatePaths?: string[];
  redirectPath?: string;
  requires?: RequiredContext[];
  successMessage?: string;
}

export async function executeFormAction<T extends z.ZodType<any, any>>(
  config: ActionConfig<T>
): Promise<FormState> {
  const context = await getRequestContext();

  if (config.requires?.includes('subdomain') && !context.subdomain) {
    return { message: 'Falha: Subdomínio não identificado.', success: false };
  }

  if (config.requires?.includes('user') && !context.user?.id) {
    return { message: 'Falha: Usuário não autenticado.', success: false };
  }

  const validatedFields = config.schema.safeParse(
    Object.fromEntries(config.formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Erro de validação. Por favor, corrija os campos destacados.',
      success: false,
    };
  }

  try {
    await config.logic(validatedFields.data, context);
  } catch (error) {
    console.error('Action Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Não foi possível completar a operação.';
    return {
      message: `Erro: ${errorMessage}`,
      success: false,
    };
  }

  if (config.revalidatePaths) {
    config.revalidatePaths.forEach(path => revalidatePath(path));
  } else if (config.revalidatePath) {
    revalidatePath(config.revalidatePath);
  }

  if (config.redirectPath) {
    redirect(config.redirectPath);
  }

  return {
    message: config.successMessage || 'Operação concluída com sucesso!',
    success: true,
  };
}


