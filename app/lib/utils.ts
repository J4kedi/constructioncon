import { auth } from "@/auth"

export async function getTenantIdFromRequest(): Promise<string> {
    const session = await auth();

    const tenantId = session?.user?.tenantId;

    if (tenantId) {
    return tenantId;
    }

    throw new Error('Tenant não autorizado.');
}