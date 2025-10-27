import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const documentos = await prisma.documento.findMany();
  return NextResponse.json(documentos);
}

export async function POST(req: Request) {
  const body = await req.json();
  const documento = await prisma.documento.create({
    data: {
      tipo: body.tipo,
      autor: body.autor,
      conteudo: body.conteudo,
      dataEmissao: new Date(body.dataEmissao),
      projetoId: body.projetoId,
      anexos: body.anexos,
    },
  });
  return NextResponse.json(documento);
}
