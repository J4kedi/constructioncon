import { NextResponse } from 'next/server';
import { getTenantIdFromRequest } from '@/app/lib/utils';
import { getPrismaClient } from '@/app/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const tenantId = await getTenantIdFromRequest(request);

    if (!tenantId) {
      return new NextResponse('Tenant não autorizado ou não encontrado.', { status: 401 });
    }

    const prisma = getPrismaClient(tenantId);

    const stream = new ReadableStream({
      async start(controller) {
        const sendData = async () => {
          const activeProjects = await prisma.obra.count({ where: { status: 'EM_ANDAMENTO' } });
          const totalCosts = await prisma.despesa.aggregate({ _sum: { valor: true } });

          const dataPayload = {
            activeProjects,
            totalCosts: totalCosts._sum.valor || 0,
            timestamp: new Date().toISOString(),
          };
          
          controller.enqueue(`data: ${JSON.stringify(dataPayload)}\n\n`);
        };

        await sendData();
        const intervalId = setInterval(sendData, 3000);

        request.signal.onabort = () => {
          clearInterval(intervalId);
          controller.close();
        };
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    if (error instanceof Error && error.message.includes('Tenant')) {
      return new NextResponse(error.message, { status: 401 });
    }
    return new NextResponse('Erro interno no servidor.', { status: 500 });
  }
}