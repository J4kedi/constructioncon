'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export type FormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string | null;
  success?: boolean;
};

interface ActionConfig<T extends z.ZodType<any, any>> {
  schema: T;
  formData: FormData;
  logic: (data: z.infer<T>) => Promise<void>;
  revalidatePath: string;
  redirectPath?: string;
}

export async function executeFormAction<T extends z.ZodType<any, any>>(
  config: ActionConfig<T>
): Promise<FormState> {
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
    await config.logic(validatedFields.data);
  } catch (error) {
    console.error('Database Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Não foi possível completar a operação.';
    return {
      message: `Erro no banco de dados: ${errorMessage}`,
      success: false,
    };
  }

  revalidatePath(config.revalidatePath);

  if (config.redirectPath) {
    redirect(config.redirectPath);
  }

  return {
    message: 'Operação concluída com sucesso!',
    success: true,
  };
}