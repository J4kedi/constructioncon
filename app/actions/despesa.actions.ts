'use server';

import { getTenantPrismaClient } from '@/app/lib/prisma';
import { AddDespesaSchema, FormState } from '@/app/lib/definitions';
import { executeFormAction } from '@/app/lib/action-handler';
import { getRequestContext } from '@/app/lib/server-utils';
import { revalidateTag } from 'next/cache';

export async function createDespesa(prevState: FormState, formData: FormData): Promise<FormState> {
    const { subdomain } = await getRequestContext();

    return executeFormAction({
        formData,
        schema: AddDespesaSchema,
        revalidatePath: '/dashboard/financeiro',
        logic: async (data) => {
            const tenantPrisma = getTenantPrismaClient(subdomain!);
            const { obraId, ...rest } = data;
            const despesaData = {
                ...rest,
                data: new Date(data.data),
                obraId: obraId || null,
            };
            await tenantPrisma.despesa.create({ data: despesaData });
            revalidateTag('dashboard-data');
        },
        successMessage: 'Despesa adicionada com sucesso!',
    });
}
