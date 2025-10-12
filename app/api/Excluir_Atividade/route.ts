import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'ID não fornecido.' }, { status: 400 });
  }

  try {
    await prisma.atividade_Cronograma.delete({ where: { id } });
    return NextResponse.json({ message: 'Tarefa excluída.' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao excluir tarefa:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
