import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { descricao, responsavel, inicio, fim } = body;

    if (!descricao || !responsavel || !inicio || !fim) {
      return NextResponse.json({ error: 'Todos os campos são obrigatórios.' }, { status: 400 });
    }

    const inicioDate = new Date(inicio);
    const fimDate = new Date(fim);
    const duracaoDias = Math.ceil((fimDate.getTime() - inicioDate.getTime()) / (1000 * 60 * 60 * 24));

    const atividade = await prisma.atividade_Cronograma.create({
      data: {
        descricao,
        responsavel,
        inicio: inicioDate,
        fim: fimDate,
        duracaoDias,
      },
    });

    return NextResponse.json(atividade, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno do servidor.' }, { status: 500 });
  }
}
