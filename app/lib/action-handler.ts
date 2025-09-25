'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

export type FormState = {
  errors?: Record<string, string[] | undefined>;
  message?: string | null;
};

interface ActionConfig<T extends z.ZodType<any, any>> {
  schema: T;
  formData: FormData;
  logic: (data: z.infer<T>) => Promise<void>;
  redirectPath: string;
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
    };
  }

  try {
    await config.logic(validatedFields.data);
  } catch (error) {
    console.error('Database Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Não foi possível completar a operação.';
    return {
      message: `Erro no banco de dados: ${errorMessage}`,
    };
  }

  revalidatePath(config.redirectPath);
  redirect(config.redirectPath);
}
