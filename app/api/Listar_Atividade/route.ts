import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const atividades = await prisma.atividade_Cronograma.findMany({
      orderBy: { inicio: 'asc' },
    });

    return NextResponse.json(atividades, { status: 200 });
  } catch (error) {
    console.error('Erro ao buscar atividades:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
  
}
