import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Criar documento
export async function POST(req: Request) {
  const formData = await req.formData();

  const tipo = formData.get('tipo') as string;
  const autor = formData.get('autor') as string;
  const conteudo = formData.get('conteudo') as string;
  const dataEmissao = new Date(formData.get('dataEmissao') as string);
  const projetoId = Number(formData.get('projetoId'));
  const enviado = formData.get('enviado') === 'true';

  const anexos: any[] = [];
  for (const [key, value] of formData.entries()) {
    if (value instanceof File) {
      anexos.push({
        name: value.name,
        type: value.type,
        size: value.size,
        content: await value.text(),
      });
    }
  }

  const documento = await prisma.documento.create({
    data: {
      tipo,
      autor,
      conteudo,
      dataEmissao,
      projetoId,
      enviado,
      anexos,
    },
  });

  return NextResponse.json(documento);
}

// Listar documentos
export async function GET() {
  const documentos = await prisma.documento.findMany({
    include: { projeto: true },
  });

  const documentosSemId = documentos.map(({ id, ...resto }) => resto);
  return NextResponse.json(documentosSemId);
}
