import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  try {
    const projetos = await prisma.projeto.findMany({
      orderBy: { id: 'desc' },
    });
    return NextResponse.json(projetos);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar projetos' }, { status: 500 });
  }
}