import { z } from 'zod';
import { executeFormAction } from '@/app/lib/action-handler';
import { getTenantPrismaClient } from '@/app/lib/prisma';
import { FormState } from '@/app/lib/definitions';

type ModelName = keyof Omit<
  ReturnType<typeof getTenantPrismaClient>,
  | '$connect'
  | '$disconnect'
  | '$executeRaw'
  | '$executeRawUnsafe'
  | '$queryRaw'
  | '$queryRawUnsafe'
  | '$transaction'
  | '$on'
  | '$use'
>;

const createGenericAction = <T extends z.ZodType<any, any, any>>(
    modelName: ModelName,
    schema: T,
    revalidatePath: string,
    successMessage: string,
    operation: 'update' | 'delete'
) => {
    return (prevState: FormState, formData: FormData): Promise<FormState> => {
        return executeFormAction({
            formData,
            schema,
            requires: ['subdomain'],
            revalidatePath,
            logic: async (data, context) => {
                const tenantPrisma = getTenantPrismaClient(context.subdomain!);
                const model = tenantPrisma[modelName] as any;
                const { id, ...rest } = data;

                if (operation === 'update') {
                    await model.update({ where: { id }, data: rest });
                } else {
                    await model.delete({ where: { id } });
                }
            },
            successMessage,
        });
    };
};

export const createGenericDeleteAction = <T extends z.ZodType<any, any, any>>(
    modelName: ModelName,
    schema: T,
    revalidatePath: string,
    successMessage: string
) => {
    return createGenericAction(modelName, schema, revalidatePath, successMessage, 'delete');
};

export const createGenericUpdateAction = <T extends z.ZodType<any, any, any>>(
    modelName: ModelName,
    schema: T,
    revalidatePath: string,
    successMessage: string
) => {
    return createGenericAction(modelName, schema, revalidatePath, successMessage, 'update');
};
