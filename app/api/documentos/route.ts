import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

// GET
export async function GET() {
  try {
    const documentos = await prisma.documento.findMany({
      orderBy: { criadoEm: 'desc' },
    });
    return NextResponse.json(documentos);
  } catch (error) {
    console.error('Erro no GET /api/documentos:', error);
    return NextResponse.json({ error: 'Erro ao buscar documentos' }, { status: 500 });
  }
}

// POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const novo = await prisma.documento.create({
      data: {
        tipo: body.tipo,
        autor: body.autor,
        conteudo: body.conteudo,
        dataEmissao: new Date(body.dataEmissao),
        anexos: Array.isArray(body.anexos) ? body.anexos : [],
        // projetoId: body.projetoId,  // descomente se quiser vincular a um projeto
      },
    });

    return NextResponse.json(novo);
  } catch (error) {
    console.error('Erro no POST /api/documentos:', error);
    return NextResponse.json({ error: 'Erro ao criar documento' }, { status: 500 });
  }
}

// PUT
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const id = Number(body.id);

    if (!id) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    const atualizado = await prisma.documento.update({
      where: { id },
      data: {
        tipo: body.tipo,
        autor: body.autor,
        conteudo: body.conteudo,
        dataEmissao: new Date(body.dataEmissao),
        anexos: Array.isArray(body.anexos) ? body.anexos : [],
        // projetoId: body.projetoId,  // descomente se quiser atualizar o vínculo
      },
    });

    return NextResponse.json(atualizado);
  } catch (error) {
    console.error('Erro no PUT /api/documentos:', error);
    return NextResponse.json({ error: 'Erro ao atualizar documento' }, { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json();
    const parsedId = Number(id);

    if (!parsedId) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await prisma.documento.delete({ where: { id: parsedId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Erro no DELETE /api/documentos:', error);
    return NextResponse.json({ error: 'Erro ao excluir documento' }, { status: 500 });
  }
}
