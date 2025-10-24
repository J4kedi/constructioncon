import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// Buscar documento por ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  try {
    const documento = await prisma.documento.findUnique({
      where: { id },
      include: { projeto: true },
    });

    if (!documento) {
      return NextResponse.json({ error: 'Documento não encontrado' }, { status: 404 });
    }

    const { id: _, ...semId } = documento;
    return NextResponse.json(semId);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar documento' }, { status: 500 });
  }
}

// Atualizar documento por ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
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

  try {
    const documento = await prisma.documento.update({
      where: { id },
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

    const { id: _, ...semId } = documento;
    return NextResponse.json(semId);
  } catch {
    return NextResponse.json({ error: 'Erro ao atualizar documento' }, { status: 500 });
  }
}

// Deletar documento por ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  try {
    await prisma.documento.delete({ where: { id } });
    return NextResponse.json({ message: 'Documento deletado com sucesso' });
  } catch {
    return NextResponse.json({ error: 'Erro ao deletar documento' }, { status: 500 });
  }
}
